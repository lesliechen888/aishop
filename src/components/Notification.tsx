'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

export interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: NotificationItem[]
  addNotification: (notification: Omit<NotificationItem, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
  maxNotifications?: number
}

export const NotificationProvider = ({ children, maxNotifications = 5 }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: NotificationItem = {
      ...notification,
      id,
      duration: notification.duration ?? 5000
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      return updated.slice(0, maxNotifications)
    })

    // 自动移除通知
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: NotificationItem
  onClose: () => void
}

const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 延迟显示动画
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )
      case 'error':
        return (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )
      case 'warning':
        return (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        )
      case 'info':
      default:
        return (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )
    }
  }

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return 'border-green-200'
      case 'error': return 'border-red-200'
      case 'warning': return 'border-yellow-200'
      case 'info': return 'border-blue-200'
      default: return 'border-gray-200'
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        bg-white rounded-lg shadow-lg border ${getBorderColor()} p-4 min-w-0 max-w-sm
      `}
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {notification.title}
          </h4>
          {notification.message && (
            <p className="text-sm text-gray-600 mt-1 break-words">
              {notification.message}
            </p>
          )}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// 便捷方法
export const useNotificationHelpers = () => {
  const { addNotification } = useNotification()

  return {
    success: (title: string, message?: string, options?: Partial<NotificationItem>) =>
      addNotification({ type: 'success', title, message, ...options }),
    
    error: (title: string, message?: string, options?: Partial<NotificationItem>) =>
      addNotification({ type: 'error', title, message, ...options }),
    
    warning: (title: string, message?: string, options?: Partial<NotificationItem>) =>
      addNotification({ type: 'warning', title, message, ...options }),
    
    info: (title: string, message?: string, options?: Partial<NotificationItem>) =>
      addNotification({ type: 'info', title, message, ...options }),
  }
}
