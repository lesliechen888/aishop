import { NextRequest, NextResponse } from 'next/server'
import { BatchEditRule, RuleCondition, RuleAction } from '@/types/collection'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds, rules } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: '请选择要编辑的商品' },
        { status: 400 }
      )
    }

    if (!rules || !Array.isArray(rules) || rules.length === 0) {
      return NextResponse.json(
        { success: false, message: '请选择要应用的规则' },
        { status: 400 }
      )
    }

    // 这里应该从数据库获取商品并应用规则
    console.log('批量编辑商品:', productIds)
    console.log('应用规则:', rules)

    // 模拟批量编辑过程
    const editResults = []
    
    for (const productId of productIds) {
      // 模拟获取商品数据
      const product = {
        id: productId,
        title: '示例商品标题',
        description: '示例商品描述',
        price: 99.99,
        tags: ['标签1', '标签2']
      }

      // 应用每个规则
      let editedProduct = { ...product }
      
      for (const rule of rules) {
        if (!rule.enabled) continue

        // 检查条件
        const conditionsMet = checkConditions(editedProduct, rule.conditions)
        if (rule.conditions.length > 0 && !conditionsMet) continue

        // 应用动作
        editedProduct = applyActions(editedProduct, rule.actions)
      }

      editResults.push({
        productId,
        originalProduct: product,
        editedProduct,
        appliedRules: rules.filter(r => r.enabled).map(r => r.name)
      })
    }

    return NextResponse.json({
      success: true,
      editedCount: editResults.length,
      editResults,
      message: `成功编辑 ${editResults.length} 个商品`
    })
  } catch (error) {
    console.error('批量编辑商品失败:', error)
    return NextResponse.json(
      { success: false, message: '批量编辑商品失败' },
      { status: 500 }
    )
  }
}

// 检查条件是否满足
function checkConditions(product: any, conditions: RuleCondition[]): boolean {
  if (conditions.length === 0) return true

  return conditions.every(condition => {
    const fieldValue = product[condition.field]
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value
      
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase())
      
      case 'startsWith':
        return String(fieldValue).toLowerCase().startsWith(String(condition.value).toLowerCase())
      
      case 'endsWith':
        return String(fieldValue).toLowerCase().endsWith(String(condition.value).toLowerCase())
      
      case 'regex':
        try {
          const regex = new RegExp(condition.value, condition.caseSensitive ? 'g' : 'gi')
          return regex.test(String(fieldValue))
        } catch {
          return false
        }
      
      case 'range':
        const numValue = Number(fieldValue)
        const range = condition.value
        return numValue >= range.min && numValue <= range.max
      
      default:
        return false
    }
  })
}

// 应用动作
function applyActions(product: any, actions: RuleAction[]): any {
  let result = { ...product }

  for (const action of actions) {
    const currentValue = result[action.field]

    switch (action.type) {
      case 'replace':
        if (action.field === 'title' || action.field === 'description') {
          // 对于文本字段，进行字符串替换
          result[action.field] = String(currentValue).replace(new RegExp(action.value, 'gi'), action.value || '')
        } else {
          result[action.field] = action.value
        }
        break

      case 'append':
        if (Array.isArray(currentValue)) {
          result[action.field] = [...currentValue, action.value]
        } else {
          result[action.field] = String(currentValue) + String(action.value)
        }
        break

      case 'prepend':
        if (Array.isArray(currentValue)) {
          result[action.field] = [action.value, ...currentValue]
        } else {
          result[action.field] = String(action.value) + String(currentValue)
        }
        break

      case 'remove':
        if (Array.isArray(currentValue)) {
          result[action.field] = currentValue.filter(item => item !== action.value)
        } else {
          result[action.field] = String(currentValue).replace(new RegExp(action.value, 'gi'), '')
        }
        break

      case 'calculate':
        if (action.formula && action.field === 'price') {
          try {
            // 简单的价格计算公式解析
            const formula = action.formula.replace(/price/g, String(currentValue))
            const newValue = eval(formula) // 注意：生产环境中应使用更安全的表达式解析器
            result[action.field] = Math.round(newValue * 100) / 100 // 保留两位小数
          } catch (error) {
            console.error('计算公式错误:', error)
          }
        }
        break

      default:
        break
    }
  }

  return result
}

// 安全的数学表达式计算器（替代eval）
function safeCalculate(expression: string, variables: Record<string, number>): number {
  // 这里应该实现一个安全的数学表达式解析器
  // 为了演示，这里使用简化版本
  let result = expression
  
  // 替换变量
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), String(value))
  })

  // 简单的数学运算
  try {
    // 只允许基本的数学运算
    if (!/^[\d\s+\-*/().]+$/.test(result)) {
      throw new Error('不安全的表达式')
    }
    return eval(result)
  } catch {
    return 0
  }
}
