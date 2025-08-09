'use client'

import { useState, useEffect } from 'react'
import { BatchEditRule, RuleCondition, RuleAction } from '@/types/collection'

interface BatchEditRulesProps {
  selectedProducts: string[]
  onClose: () => void
  onApply: (rules: BatchEditRule[]) => void
}

export default function BatchEditRules({ selectedProducts, onClose, onApply }: BatchEditRulesProps) {
  const [rules, setRules] = useState<BatchEditRule[]>([])
  const [newRule, setNewRule] = useState<Partial<BatchEditRule>>({
    name: '',
    description: '',
    enabled: true,
    conditions: [],
    actions: []
  })
  const [showNewRuleForm, setShowNewRuleForm] = useState(false)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/admin/collection/batch-rules')
      const data = await response.json()
      if (data.success) {
        setRules(data.rules)
      }
    } catch (error) {
      console.error('获取批量编辑规则失败:', error)
    }
  }

  const saveRule = async () => {
    if (!newRule.name || !newRule.actions?.length) {
      alert('请填写规则名称和至少一个动作')
      return
    }

    try {
      const response = await fetch('/api/admin/collection/batch-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRule,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      })

      const result = await response.json()
      if (result.success) {
        fetchRules()
        setNewRule({
          name: '',
          description: '',
          enabled: true,
          conditions: [],
          actions: []
        })
        setShowNewRuleForm(false)
      } else {
        alert(result.message || '保存规则失败')
      }
    } catch (error) {
      console.error('保存规则失败:', error)
      alert('保存规则失败')
    }
  }

  const deleteRule = async (ruleId: string) => {
    if (!confirm('确定要删除这个规则吗？')) return

    try {
      const response = await fetch(`/api/admin/collection/batch-rules/${ruleId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        fetchRules()
      } else {
        alert(result.message || '删除规则失败')
      }
    } catch (error) {
      console.error('删除规则失败:', error)
      alert('删除规则失败')
    }
  }

  const applyRules = () => {
    const enabledRules = rules.filter(rule => rule.enabled)
    if (enabledRules.length === 0) {
      alert('请至少启用一个规则')
      return
    }
    onApply(enabledRules)
  }

  const addCondition = () => {
    setNewRule(prev => ({
      ...prev,
      conditions: [
        ...(prev.conditions || []),
        {
          field: 'title',
          operator: 'contains',
          value: ''
        }
      ]
    }))
  }

  const updateCondition = (index: number, condition: Partial<RuleCondition>) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions?.map((c, i) => i === index ? { ...c, ...condition } : c) || []
    }))
  }

  const removeCondition = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index) || []
    }))
  }

  const addAction = () => {
    setNewRule(prev => ({
      ...prev,
      actions: [
        ...(prev.actions || []),
        {
          type: 'replace',
          field: 'title',
          value: ''
        }
      ]
    }))
  }

  const updateAction = (index: number, action: Partial<RuleAction>) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions?.map((a, i) => i === index ? { ...a, ...action } : a) || []
    }))
  }

  const removeAction = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== index) || []
    }))
  }

  const fieldOptions = [
    { value: 'title', label: '商品标题' },
    { value: 'description', label: '商品描述' },
    { value: 'price', label: '价格' },
    { value: 'tags', label: '标签' }
  ]

  const operatorOptions = [
    { value: 'equals', label: '等于' },
    { value: 'contains', label: '包含' },
    { value: 'startsWith', label: '开始于' },
    { value: 'endsWith', label: '结束于' },
    { value: 'regex', label: '正则表达式' },
    { value: 'range', label: '范围' }
  ]

  const actionTypeOptions = [
    { value: 'replace', label: '替换' },
    { value: 'append', label: '追加' },
    { value: 'prepend', label: '前置' },
    { value: 'remove', label: '移除' },
    { value: 'calculate', label: '计算' }
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            批量编辑规则 - {selectedProducts.length} 个商品
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 现有规则列表 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">现有规则</h4>
            <button
              onClick={() => setShowNewRuleForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              + 新建规则
            </button>
          </div>

          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => {
                        const updatedRules = rules.map(r => 
                          r.id === rule.id ? { ...r, enabled: e.target.checked } : r
                        )
                        setRules(updatedRules)
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">{rule.name}</h5>
                      {rule.description && (
                        <p className="text-sm text-gray-500">{rule.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {rule.conditions.length} 条件, {rule.actions.length} 动作
                    </span>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 新建规则表单 */}
        {showNewRuleForm && (
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">新建规则</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规则名称</label>
                <input
                  type="text"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="输入规则名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <input
                  type="text"
                  value={newRule.description || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="可选"
                />
              </div>
            </div>

            {/* 条件设置 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">条件 (可选)</label>
                <button
                  onClick={addCondition}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + 添加条件
                </button>
              </div>
              {newRule.conditions?.map((condition, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={condition.field}
                    onChange={(e) => updateCondition(index, { field: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {fieldOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(index, { operator: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {operatorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => updateCondition(index, { value: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="条件值"
                  />
                  <button
                    onClick={() => removeCondition(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>

            {/* 动作设置 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">动作</label>
                <button
                  onClick={addAction}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + 添加动作
                </button>
              </div>
              {newRule.actions?.map((action, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={action.type}
                    onChange={(e) => updateAction(index, { type: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {actionTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={action.field}
                    onChange={(e) => updateAction(index, { field: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {fieldOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={action.value || ''}
                    onChange={(e) => updateAction(index, { value: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder={action.type === 'calculate' ? '公式 (如: price * 1.2)' : '动作值'}
                  />
                  <button
                    onClick={() => removeAction(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewRuleForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={saveRule}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                保存规则
              </button>
            </div>
          </div>
        )}

        {/* 底部操作 */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={applyRules}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            应用规则
          </button>
        </div>
      </div>
    </div>
  )
}
