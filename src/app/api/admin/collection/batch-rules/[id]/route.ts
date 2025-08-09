import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 这里应该从数据库删除规则
    console.log('删除批量编辑规则:', id)

    return NextResponse.json({
      success: true,
      message: '规则删除成功'
    })
  } catch (error) {
    console.error('删除批量编辑规则失败:', error)
    return NextResponse.json(
      { success: false, message: '删除批量编辑规则失败' },
      { status: 500 }
    )
  }
}
