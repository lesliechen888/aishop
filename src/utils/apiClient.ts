// 统一API客户端

import { AppError, handleApiError, withRetry } from './errorHandler'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  cache?: boolean
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(baseURL: string = '', timeout: number = 10000) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // 设置认证token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  // 移除认证token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization']
  }

  // 设置默认头部
  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders[key] = value
  }

  // 构建完整URL
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint
    }
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  }

  // 处理请求体
  private processBody(body: any, headers: Record<string, string>): string | FormData | null {
    if (!body) return null

    if (body instanceof FormData) {
      // 移除Content-Type，让浏览器自动设置
      delete headers['Content-Type']
      return body
    }

    if (typeof body === 'object') {
      return JSON.stringify(body)
    }

    return body
  }

  // 核心请求方法
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      retries = 0,
      cache = false
    } = config

    const url = this.buildURL(endpoint)
    const requestHeaders = { ...this.defaultHeaders, ...headers }
    const processedBody = this.processBody(body, requestHeaders)

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      body: processedBody,
      cache: cache ? 'default' : 'no-cache',
    }

    const executeRequest = async (): Promise<T> => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new AppError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            errorData.code || 'HTTP_ERROR',
            response.status,
            errorData
          )
        }

        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          return await response.json()
        }

        return await response.text() as any
      } catch (error) {
        clearTimeout(timeoutId)
        
        if (error.name === 'AbortError') {
          throw new AppError('请求超时', 'TIMEOUT_ERROR', 408)
        }

        throw error
      }
    }

    if (retries > 0) {
      return withRetry(executeRequest, retries)
    }

    return executeRequest()
  }

  // GET请求
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  // POST请求
  async post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  // PUT请求
  async put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  // DELETE请求
  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  // PATCH请求
  async patch<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }

  // 上传文件
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key])
      })
    }

    return this.post<T>(endpoint, formData)
  }

  // 批量请求
  async batch<T>(requests: Array<{ endpoint: string; config?: RequestConfig }>): Promise<T[]> {
    const promises = requests.map(({ endpoint, config }) => 
      this.request<T>(endpoint, config).catch(error => ({ error: handleApiError(error) }))
    )

    return Promise.all(promises)
  }
}

// 创建默认实例
export const apiClient = new ApiClient()

// 管理员API客户端
export const adminApiClient = new ApiClient('/api/admin')

// 用户API客户端
export const userApiClient = new ApiClient('/api')

// 导出类型和工具
export { ApiClient }
export default apiClient
