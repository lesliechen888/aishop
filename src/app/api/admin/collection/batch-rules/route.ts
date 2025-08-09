import { NextRequest, NextResponse } from 'next/server'
import { BatchEditRule } from '@/types/collection'

// 模拟批量编辑规则存储
let mockRules: BatchEditRule[] = [
  {
    id: 'rule-1',
    name: '价格调整规则',
    description: '将所有商品价格上调20%',
    enabled: true,
    conditions: [
      {
        field: 'price',
        operator: 'range',
        value: { min: 0, max: 1000 }
      }
    ],
    actions: [
      {
        type: 'calculate',
        field: 'price',
        formula: 'price * 1.2'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'rule-2',
    name: '标题优化规则',
    description: '移除标题中的特殊符号',
    enabled: true,
    conditions: [],
    actions: [
      {
        type: 'replace',
        field: 'title',
        value: ''
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'rule-3',
    name: '添加品牌标签',
    description: '为所有商品添加品牌标签',
    enabled: false,
    conditions: [
      {
        field: 'title',
        operator: 'contains',
        value: '优质'
      }
    ],
    actions: [
      {
        type: 'append',
        field: 'tags',
        value: '优质品牌'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enabled = searchParams.get('enabled')

    let filteredRules = mockRules

    if (enabled !== null) {
      const isEnabled = enabled === 'true'
      filteredRules = filteredRules.filter(rule => rule.enabled === isEnabled)
    }

    // 按创建时间倒序排列
    filteredRules.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      rules: filteredRules
    })
  } catch (error) {
    console.error('获取批量编辑规则失败:', error)
    return NextResponse.json(
      { success: false, message: '获取批量编辑规则失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, enabled, conditions, actions } = body

    if (!name || !actions || actions.length === 0) {
      return NextResponse.json(
        { success: false, message: '规则名称和动作不能为空' },
        { status: 400 }
      )
    }

    const newRule: BatchEditRule = {
      id: `rule-${Date.now()}`,
      name,
      description: description || '',
      enabled: enabled !== false,
      conditions: conditions || [],
      actions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockRules.unshift(newRule)

    return NextResponse.json({
      success: true,
      rule: newRule,
      message: '批量编辑规则创建成功'
    })
  } catch (error) {
    console.error('创建批量编辑规则失败:', error)
    return NextResponse.json(
      { success: false, message: '创建批量编辑规则失败' },
      { status: 500 }
    )
  }
}
