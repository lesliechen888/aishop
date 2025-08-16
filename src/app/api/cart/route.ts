import { NextRequest, NextResponse } from 'next/server';
import { addToCart, getProductById } from '@/lib/productDatabase';

// 购物车项目接口
interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

// 内存购物车存储（实际项目中应该使用数据库或会话存储）
let cartItems: CartItem[] = [];

export async function GET(request: NextRequest) {
  try {
    // 获取购物车详细信息
    const cartDetails = await Promise.all(
      cartItems.map(async (item) => {
        const product = await getProductById(item.productId);
        return {
          ...item,
          product
        };
      })
    );

    const total = cartDetails.reduce((sum, item) => {
      return sum + (item.product ? item.product.price * item.quantity : 0);
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        items: cartDetails,
        total,
        count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error('Cart GET API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch cart'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    // 验证产品存在且有库存
    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    if (!product.inStock) {
      return NextResponse.json({
        success: false,
        error: 'Product is out of stock'
      }, { status: 400 });
    }

    // 检查是否已在购物车中
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // 更新数量
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // 添加新项目
      cartItems.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Product added to cart successfully',
      data: {
        productId,
        quantity: existingItemIndex >= 0 
          ? cartItems[existingItemIndex].quantity 
          : quantity
      }
    });

  } catch (error) {
    console.error('Cart POST API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add product to cart'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    if (!productId || quantity < 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid parameters'
      }, { status: 400 });
    }

    const itemIndex = cartItems.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Item not found in cart'
      }, { status: 404 });
    }

    if (quantity === 0) {
      // 移除项目
      cartItems.splice(itemIndex, 1);
    } else {
      // 更新数量
      cartItems[itemIndex].quantity = quantity;
    }

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully'
    });

  } catch (error) {
    console.error('Cart PUT API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update cart'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      // 删除特定商品
      const itemIndex = cartItems.findIndex(item => item.productId === productId);
      if (itemIndex >= 0) {
        cartItems.splice(itemIndex, 1);
      }
    } else {
      // 清空购物车
      cartItems = [];
    }

    return NextResponse.json({
      success: true,
      message: 'Cart item(s) removed successfully'
    });

  } catch (error) {
    console.error('Cart DELETE API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove cart item'
    }, { status: 500 });
  }
}
