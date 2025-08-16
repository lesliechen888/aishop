import { NextRequest, NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/productDatabase';

export async function POST(request: NextRequest) {
  try {
    // 重置数据库
    resetDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database reset successfully'
    });
  } catch (error) {
    console.error('Reset database error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset database'
    }, { status: 500 });
  }
}
