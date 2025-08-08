'use client'

import { useState, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon, PlayIcon, CogIcon } from '@heroicons/react/24/outline'

interface ApiConfig {
  id: string
  name: string
  apiKey: string
  baseUrl?: string
  isActive: boolean
  testResult?: {
    success: boolean
    message: string
    data?: any
    timestamp: string
  }
  createdAt: string
  updatedAt: string
}

const API_CONFIGS = [
  {
    name: 'serpapi',
    displayName: 'SerpApi',
    description: '搜索引擎结果API，用于获取搜索数据',
    defaultBaseUrl: 'https://serpapi.com',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
    ]
  },
  {
    name: 'deepseek',
    displayName: 'DeepSeek',
    description: 'DeepSeek AI模型API，用于智能对话和内容生成',
    defaultBaseUrl: 'https://api.deepseek.com',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
      { key: 'baseUrl', label: 'Base URL', type: 'url', required: false },
    ]
  },
  {
    name: 'doubao',
    displayName: '豆包',
    description: '字节跳动豆包AI模型API',
    defaultBaseUrl: 'https://ark.cn-beijing.volces.com',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
      { key: 'baseUrl', label: 'Base URL', type: 'url', required: false },
    ]
  },
]

export default function ApiSettings() {
  const [configs, setConfigs] = useState<ApiConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<string | null>(null)
  const [editingConfig, setEditingConfig] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/admin/api-configs')
      const result = await response.json()
      if (result.success) {
        setConfigs(result.data)
      }
    } catch (error) {
      console.error('获取API配置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async (configName: string) => {
    try {
      const response = await fetch('/api/admin/api-configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: configName,
          ...formData,
        }),
      })

      const result = await response.json()
      if (result.success) {
        fetchConfigs()
        setEditingConfig(null)
        setFormData({})
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('保存配置失败:', error)
      alert('保存配置失败')
    }
  }

  const handleTestApi = async (config: ApiConfig) => {
    setTesting(config.name)
    try {
      const response = await fetch('/api/admin/api-configs/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.name,
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
        }),
      })

      const result = await response.json()
      if (result.success) {
        fetchConfigs() // 重新获取配置以更新测试结果
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('测试API失败:', error)
      alert('测试API失败')
    } finally {
      setTesting(null)
    }
  }

  const handleTestApiWithFormData = async (configName: string) => {
    setTesting(configName)
    try {
      const response = await fetch('/api/admin/api-configs/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: configName,
          apiKey: formData.apiKey,
          baseUrl: formData.baseUrl,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert(`测试成功: ${result.data.message}`)
      } else {
        alert(`测试失败: ${result.message}`)
      }
    } catch (error) {
      console.error('测试API失败:', error)
      alert('测试API失败')
    } finally {
      setTesting(null)
    }
  }

  const startEditing = (configName: string) => {
    const existingConfig = configs.find(c => c.name === configName)
    setEditingConfig(configName)
    setFormData({
      apiKey: existingConfig?.apiKey || '',
      baseUrl: existingConfig?.baseUrl || API_CONFIGS.find(c => c.name === configName)?.defaultBaseUrl || '',
      isActive: existingConfig?.isActive || false,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API配置</h1>
        <p className="mt-1 text-sm text-gray-500">配置和测试第三方API服务</p>
      </div>

      {/* API配置列表 */}
      <div className="space-y-6">
        {API_CONFIGS.map((apiConfig) => {
          const existingConfig = configs.find(c => c.name === apiConfig.name)
          const isEditing = editingConfig === apiConfig.name
          const isConfigured = !!existingConfig?.apiKey
          const testResult = existingConfig?.testResult

          return (
            <div key={apiConfig.name} className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CogIcon className="h-6 w-6 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{apiConfig.displayName}</h3>
                      <p className="text-sm text-gray-500">{apiConfig.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* 配置状态 */}
                    {isConfigured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        已配置
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        未配置
                      </span>
                    )}
                    
                    {/* 激活状态 */}
                    {existingConfig?.isActive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        已激活
                      </span>
                    )}

                    {/* 测试结果 */}
                    {testResult && (
                      <div className="flex items-center">
                        {testResult.success ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                {isEditing ? (
                  <div className="space-y-4">
                    {apiConfig.fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                          type={field.type}
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required={field.required}
                          placeholder={field.key === 'baseUrl' ? apiConfig.defaultBaseUrl : ''}
                        />
                      </div>
                    ))}
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`active-${apiConfig.name}`}
                        checked={formData.isActive || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`active-${apiConfig.name}`} className="ml-2 block text-sm text-gray-900">
                        激活此API
                      </label>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => handleTestApiWithFormData(apiConfig.name)}
                        disabled={testing === apiConfig.name || !formData.apiKey}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        <PlayIcon className="h-4 w-4 mr-2" />
                        {testing === apiConfig.name ? '测试中...' : '测试配置'}
                      </button>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setEditingConfig(null)
                            setFormData({})
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleSaveConfig(apiConfig.name)}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {isConfigured ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <p><strong>API Key:</strong> ••••••••{existingConfig.apiKey.slice(-4)}</p>
                          {existingConfig.baseUrl && (
                            <p><strong>Base URL:</strong> {existingConfig.baseUrl}</p>
                          )}
                        </div>
                        
                        {testResult && (
                          <div className={`p-3 rounded-md ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                            <div className="flex">
                              <div className="flex-shrink-0">
                                {testResult.success ? (
                                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                ) : (
                                  <XCircleIcon className="h-5 w-5 text-red-400" />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className={`text-sm font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                                  {testResult.message}
                                </p>
                                {testResult.data && (
                                  <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                                    {JSON.stringify(testResult.data, null, 2)}
                                  </pre>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                  测试时间: {new Date(testResult.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <button
                            onClick={() => startEditing(apiConfig.name)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            编辑配置
                          </button>
                          <button
                            onClick={() => handleTestApi(existingConfig)}
                            disabled={testing === apiConfig.name}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            <PlayIcon className="h-4 w-4 mr-2" />
                            {testing === apiConfig.name ? '测试中...' : '测试连接'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500 mb-4">尚未配置此API</p>
                        <button
                          onClick={() => startEditing(apiConfig.name)}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          立即配置
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
