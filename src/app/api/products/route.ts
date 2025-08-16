import { NextRequest, NextResponse } from 'next/server';
import { queryProducts, ProductFilters, SortOption } from '@/lib/productDatabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 解析筛选参数
    const filters: ProductFilters = {};
    
    const category = searchParams.get('category');
    if (category && category !== 'all') {
      filters.category = category;
    }

    const priceRange = searchParams.get('priceRange');
    if (priceRange && priceRange !== 'all') {
      if (priceRange.includes('-')) {
        const [min, max] = priceRange.split('-').map(Number);
        filters.priceMin = min;
        if (max) filters.priceMax = max;
      } else {
        filters.priceMin = Number(priceRange);
      }
    }

    const rating = searchParams.get('rating');
    if (rating && rating !== '0') {
      filters.rating = Number(rating);
    }

    const features = searchParams.get('features');
    if (features) {
      filters.features = features.split(',');
    }

    const brand = searchParams.get('brand');
    if (brand) {
      filters.brand = brand;
    }

    const inStock = searchParams.get('inStock');
    if (inStock !== null) {
      filters.inStock = inStock === 'true';
    }

    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }

    // 解析排序参数
    const sort = (searchParams.get('sort') || 'featured') as SortOption;

    // 解析分页参数
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;

    // 查询产品
    const result = await queryProducts(filters, sort, { page, limit });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, sort, pagination } = body;

    const result = await queryProducts(filters, sort, pagination);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Products POST API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}
