import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getBrands, getFeatures } from '@/lib/productDatabase';

export async function GET(request: NextRequest) {
  try {
    const [categories, brands, features] = await Promise.all([
      getCategories(),
      getBrands(),
      getFeatures()
    ]);

    // 价格区间选项
    const priceRanges = [
      { id: 'all', name: '全部价格', min: 0, max: null },
      { id: '0-25', name: '$0 - $25', min: 0, max: 25 },
      { id: '25-50', name: '$25 - $50', min: 25, max: 50 },
      { id: '50-100', name: '$50 - $100', min: 50, max: 100 },
      { id: '100-200', name: '$100 - $200', min: 100, max: 200 },
      { id: '200', name: '$200+', min: 200, max: null },
    ];

    // 评分选项
    const ratingOptions = [
      { id: 0, name: '全部评分', value: 0 },
      { id: 5, name: '5星', value: 5 },
      { id: 4, name: '4星及以上', value: 4 },
      { id: 3, name: '3星及以上', value: 3 },
      { id: 2, name: '2星及以上', value: 2 },
      { id: 1, name: '1星及以上', value: 1 },
    ];

    // 排序选项
    const sortOptions = [
      { id: 'featured', name: '推荐排序' },
      { id: 'newest', name: '最新上架' },
      { id: 'price-low', name: '价格：从低到高' },
      { id: 'price-high', name: '价格：从高到低' },
      { id: 'rating', name: '评分最高' },
    ];

    return NextResponse.json({
      success: true,
      data: {
        categories: [
          { id: 'all', name: '全部分类', count: categories.reduce((sum, cat) => sum + cat.count, 0) },
          ...categories
        ],
        brands: [
          { id: 'all', name: '全部品牌', count: brands.reduce((sum, brand) => sum + brand.count, 0) },
          ...brands
        ],
        priceRanges,
        ratingOptions,
        sortOptions,
        features
      }
    });

  } catch (error) {
    console.error('Filters API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch filter options'
    }, { status: 500 });
  }
}
