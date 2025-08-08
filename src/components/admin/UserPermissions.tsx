'use client'

import { useState, useEffect } from 'react'

interface AdminUser {
  id: string
  username: string
  name: string
  role: 'super_admin' | 'admin'
  permissions: string[]
  status: 'active' | 'inactive'
  lastLogin?: string
  createdAt: string
}

interface PermissionTemplate {
  id: string
  name: string
  description: string
  permissions: string[]
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
}

export default function UserPermissions() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [templates, setTemplates] = useState<PermissionTemplate[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'templates'>('users')
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddRole, setShowAddRole] = useState(false)
  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<PermissionTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const [userFormData, setUserFormData] = useState({
    username: '',
    name: '',
    password: '',
    role: 'admin' as 'super_admin' | 'admin',
    permissions: [] as string[],
    status: 'active' as 'active' | 'inactive'
  })

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  // 可用权限列表
  const availablePermissions = [
    { 
      id: 'user_management', 
      name: '用户管理', 
      description: '管理系统用户和权限',
      category: '用户权限'
    },
    { 
      id: 'order_management', 
      name: '订单管理', 
      description: '查看和处理订单',
      category: '业务管理'
    },
    { 
      id: 'product_management', 
      name: '商品管理', 
      description: '管理商品信息',
      category: '业务管理'
    },
    { 
      id: 'content_management', 
      name: '内容管理', 
      description: '管理网站内容',
      category: '内容管理'
    },
    { 
      id: 'data_analysis', 
      name: '数据分析', 
      description: '查看经营数据',
      category: '数据分析'
    },
    { 
      id: 'system_settings', 
      name: '系统设置', 
      description: '修改系统配置',
      category: '系统管理'
    },
    { 
      id: 'api_management', 
      name: 'API管理', 
      description: '管理第三方API配置',
      category: '系统管理'
    },
    { 
      id: 'financial_management', 
      name: '财务管理', 
      description: '管理财务数据和报表',
      category: '财务管理'
    },
    { 
      id: 'marketing_management', 
      name: '营销管理', 
      description: '管理营销活动和推广',
      category: '营销管理'
    },
    { 
      id: 'customer_service', 
      name: '客服管理', 
      description: '处理客户服务和支持',
      category: '客户服务'
    }
  ]

  // 按类别分组权限
  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, typeof availablePermissions>)

  useEffect(() => {
    fetchUsers()
    fetchTemplates()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/permission-templates')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('获取权限模板失败:', error)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles')
      const data = await response.json()
      if (data.success) {
        setRoles(data.roles)
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
    }
  }

  // 过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || user.role === filterRole
    const matchesStatus = !filterStatus || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和标签页 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">权限管理</h1>
        <p className="mt-1 text-sm text-gray-500">管理系统用户、角色和权限分配</p>
        
        {/* 标签页导航 */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'users', label: '用户管理', count: users.length },
              { key: 'roles', label: '角色管理', count: roles.length },
              { key: 'templates', label: '权限模板', count: templates.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 用户管理标签页 */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* 搜索和过滤 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索用户名或姓名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">所有角色</option>
                <option value="super_admin">超级管理员</option>
                <option value="admin">管理员</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">所有状态</option>
                <option value="active">活跃</option>
                <option value="inactive">禁用</option>
              </select>
              <button
                onClick={() => setShowAddUser(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ➕ 添加用户
              </button>
            </div>
          </div>

          {/* 用户列表 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <li key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? '活跃' : '禁用'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                        <p className="text-sm text-gray-500">
                          角色: {user.role === 'super_admin' ? '超级管理员' : '管理员'}
                        </p>
                        <p className="text-sm text-gray-500">
                          权限: {user.permissions.includes('*') ? '全部权限' : `${user.permissions.length}个权限`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setUserFormData({
                            username: user.username,
                            name: user.name,
                            password: '',
                            role: user.role,
                            permissions: user.permissions,
                            status: user.status
                          })
                          setEditingUser(user)
                          setShowAddUser(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        ✏️ 编辑
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm('确定要删除这个用户吗？')) return
                          try {
                            const response = await fetch(`/api/admin/users/${user.id}`, {
                              method: 'DELETE',
                            })
                            const result = await response.json()
                            if (result.success) {
                              fetchUsers()
                              alert('用户删除成功')
                            } else {
                              alert(result.message)
                            }
                          } catch (error) {
                            console.error('删除失败:', error)
                            alert('删除失败')
                          }
                        }}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        🗑️ 删除
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 添加/编辑用户表单 */}
      {showAddUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? '编辑用户' : '添加用户'}
              </h3>

              <form onSubmit={async (e) => {
                e.preventDefault()
                try {
                  const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users'
                  const method = editingUser ? 'PUT' : 'POST'

                  const response = await fetch(url, {
                    method,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userFormData),
                  })

                  const result = await response.json()
                  if (result.success) {
                    fetchUsers()
                    setUserFormData({
                      username: '',
                      name: '',
                      password: '',
                      role: 'admin',
                      permissions: [],
                      status: 'active'
                    })
                    setEditingUser(null)
                    setShowAddUser(false)
                    alert(editingUser ? '用户更新成功' : '用户创建成功')
                  } else {
                    alert(result.message)
                  }
                } catch (error) {
                  console.error('操作失败:', error)
                  alert('操作失败')
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">用户名</label>
                    <input
                      type="text"
                      value={userFormData.username}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">姓名</label>
                    <input
                      type="text"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">密码</label>
                  <input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required={!editingUser}
                    placeholder={editingUser ? '留空则不修改密码' : ''}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">角色</label>
                    <select
                      value={userFormData.role}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, role: e.target.value as 'super_admin' | 'admin' }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="admin">管理员</option>
                      <option value="super_admin">超级管理员</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">状态</label>
                    <select
                      value={userFormData.status}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">活跃</option>
                      <option value="inactive">禁用</option>
                    </select>
                  </div>
                </div>

                {/* 权限模板 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">权限模板</label>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setUserFormData(prev => ({ ...prev, permissions: template.permissions }))}
                        className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 hover:bg-gray-50"
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 权限选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">权限设置</label>
                  <div className="space-y-4">
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">{category}</h4>
                        <div className="space-y-2 pl-4">
                          {permissions.map((permission) => (
                            <label key={permission.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={userFormData.permissions.includes(permission.id)}
                                onChange={() => {
                                  setUserFormData(prev => ({
                                    ...prev,
                                    permissions: prev.permissions.includes(permission.id)
                                      ? prev.permissions.filter(p => p !== permission.id)
                                      : [...prev.permissions, permission.id]
                                  }))
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-900">{permission.name}</span>
                              <span className="ml-2 text-xs text-gray-500">({permission.description})</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUserFormData({
                        username: '',
                        name: '',
                        password: '',
                        role: 'admin',
                        permissions: [],
                        status: 'active'
                      })
                      setEditingUser(null)
                      setShowAddUser(false)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingUser ? '更新' : '创建'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
