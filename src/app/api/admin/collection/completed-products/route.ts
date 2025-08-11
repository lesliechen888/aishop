import { NextRequest, NextResponse } from 'next/server';
import { CollectedProduct } from '@/types/collection';

// 模拟存储已完成采集的商品（实际项目中应该使用数据库）
let completedProducts: CollectedProduct[] = [];

// 添加采集完成的商品
export function addCompletedProduct(product: CollectedProduct) {
  completedProducts.unshift(product);
}

// 批量添加采集完成的商品
export function addCompletedProducts(products: CollectedProduct[]) {
  completedProducts.unshift(...products);
}

// 获取采集完成的商品
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since'); // 获取指定时间之后的商品
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredProducts = completedProducts;

    // 如果指定了时间，只返回该时间之后的商品
    if (since) {
      const sinceDate = new Date(since);
      filteredProducts = completedProducts.filter(
        product => new Date(product.collectedAt) > sinceDate
      );
    }

    // 限制返回数量
    const products = filteredProducts.slice(0, limit);

    return NextResponse.json({
      success: true,
      products,
      total: filteredProducts.length
    });

  } catch (error) {
    console.error('获取采集完成商品失败:', error);
    return NextResponse.json({
      success: false,
      message: '获取采集完成商品失败'
    }, { status: 500 });
  }
}

// 清空已获取的商品（前端获取后可以清空，避免重复）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productIds = searchParams.get('ids')?.split(',') || [];

    if (productIds.length > 0) {
      // 删除指定的商品
      completedProducts = completedProducts.filter(
        product => !productIds.includes(product.id)
      );
    } else {
      // 清空所有商品
      completedProducts = [];
    }

    return NextResponse.json({
      success: true,
      message: '清空成功'
    });

  } catch (error) {
    console.error('清空采集完成商品失败:', error);
    return NextResponse.json({
      success: false,
      message: '清空失败'
    }, { status: 500 });
  }
}
