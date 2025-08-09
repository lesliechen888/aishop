// 统一错误处理工具

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export class AppError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly details?: any

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500, details?: any) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
  }
}

// 网络请求错误处理
export const handleApiError = (error: any): ApiError => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details
    }
  }

  if (error.response) {
    // 服务器响应错误
    return {
      message: error.response.data?.message || '服务器错误',
      code: error.response.data?.code || 'SERVER_ERROR',
      status: error.response.status,
      details: error.response.data
    }
  }

  if (error.request) {
    // 网络连接错误
    return {
      message: '网络连接失败，请检查网络设置',
      code: 'NETWORK_ERROR',
      status: 0
    }
  }

  // 其他错误
  return {
    message: error.message || '未知错误',
    code: 'UNKNOWN_ERROR',
    status: 500
  }
}

// 图片加载错误处理
export const getImageFallback = (name: string, width: number = 100, height: number = 100): string => {
  const initials = name.slice(0, 2).toUpperCase()
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/9ca3af?text=${encodeURIComponent(initials)}`
}

// 表单验证错误处理
export const validateForm = (data: Record<string, any>, rules: Record<string, any>): string[] => {
  const errors: string[] = []

  Object.keys(rules).forEach(field => {
    const rule = rules[field]
    const value = data[field]

    if (rule.required && (!value || value.toString().trim() === '')) {
      errors.push(`${rule.label || field}不能为空`)
    }

    if (value && rule.minLength && value.toString().length < rule.minLength) {
      errors.push(`${rule.label || field}长度不能少于${rule.minLength}个字符`)
    }

    if (value && rule.maxLength && value.toString().length > rule.maxLength) {
      errors.push(`${rule.label || field}长度不能超过${rule.maxLength}个字符`)
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors.push(`${rule.label || field}格式不正确`)
    }

    if (value && rule.min && Number(value) < rule.min) {
      errors.push(`${rule.label || field}不能小于${rule.min}`)
    }

    if (value && rule.max && Number(value) > rule.max) {
      errors.push(`${rule.label || field}不能大于${rule.max}`)
    }
  })

  return errors
}

// 通用异步操作错误处理
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = '操作失败'
): Promise<{ data?: T; error?: ApiError }> => {
  try {
    const data = await operation()
    return { data }
  } catch (error) {
    console.error(errorMessage, error)
    return { error: handleApiError(error) }
  }
}

// 重试机制
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 格式化错误消息
export const formatErrorMessage = (error: ApiError): string => {
  if (error.code === 'VALIDATION_ERROR' && error.details) {
    return Array.isArray(error.details) ? error.details.join(', ') : error.message
  }
  return error.message
}

// 日志记录
export const logError = (error: any, context?: string) => {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    context,
    message: error.message,
    stack: error.stack,
    ...(error instanceof AppError && {
      code: error.code,
      status: error.status,
      details: error.details
    })
  }
  
  console.error('Error logged:', errorInfo)
  
  // 在生产环境中，这里可以发送到错误监控服务
  if (process.env.NODE_ENV === 'production') {
    // 发送到错误监控服务，如 Sentry
  }
}
