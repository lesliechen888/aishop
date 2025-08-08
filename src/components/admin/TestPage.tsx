'use client'

export default function TestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">测试页面</h1>
        <p className="mt-1 text-sm text-gray-500">这是一个测试页面，用于验证布局是否正常</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">功能测试</h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">✅ 布局正常显示</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">ℹ️ 二级菜单功能已实现</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">⚠️ 右侧内容区域正常显示</p>
          </div>
        </div>
      </div>
    </div>
  )
}
