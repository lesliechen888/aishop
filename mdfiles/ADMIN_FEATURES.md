# 管理后台新功能说明

## 1. 权限管理系统

### 功能概述
- 完整的管理员用户权限管理系统
- 支持角色分配和细粒度权限控制
- 权限模板功能，快速分配常用权限组合

### 访问路径
- 页面路径: `/admin/users`
- 导航菜单: "权限管理"

### 主要功能

#### 用户管理
- ✅ 查看所有管理员用户列表
- ✅ 添加新的管理员用户
- ✅ 编辑用户信息和权限
- ✅ 删除用户（超级管理员除外）
- ✅ 启用/禁用用户账户

#### 权限系统
支持以下权限类型：
- `products` - 商品管理
- `orders` - 订单管理  
- `users` - 用户管理
- `analytics` - 数据分析
- `settings` - 系统设置
- `content` - 内容管理
- `countries` - 国家管理
- `product_collection` - 商品采集
- `image_processing` - 图片处理

#### 权限模板
预设的权限模板：
- **商品管理员**: 商品相关的所有操作
- **订单管理员**: 订单处理和客户服务
- **内容管理员**: 内容和营销相关工作
- **系统管理员**: 系统配置和维护

### 测试账户
- **超级管理员**: admin / admin123 (拥有所有权限)
- **普通管理员**: manager / manager123 (部分权限)

## 2. API配置管理

### 功能概述
- 集中管理第三方API配置
- 支持API连接测试
- 安全的API密钥存储

### 访问路径
- 页面路径: `/admin/settings`
- 导航菜单: "系统设置"

### 支持的API

#### SerpApi
- **用途**: 搜索引擎结果API，用于获取搜索数据
- **配置项**: API Key
- **测试功能**: 验证账户信息和剩余查询次数

#### DeepSeek
- **用途**: DeepSeek AI模型API，用于智能对话和内容生成
- **配置项**: API Key, Base URL (可选)
- **测试功能**: 验证连接并获取可用模型列表

#### 豆包 (Doubao)
- **用途**: 字节跳动豆包AI模型API
- **配置项**: API Key, Base URL (可选)
- **测试功能**: 验证API连接状态

### 主要功能
- ✅ 配置API密钥和基础URL
- ✅ 测试API连接状态
- ✅ 查看测试结果和响应数据
- ✅ 启用/禁用API服务
- ✅ 安全存储API配置信息

## 3. 数据库设计

### 数据表结构

#### admin_users (管理员用户表)
- `id` - 用户ID
- `username` - 用户名（唯一）
- `name` - 显示名称
- `password` - 加密密码
- `role` - 角色 (super_admin/admin)
- `permissions` - 权限列表 (JSON)
- `status` - 状态 (active/inactive)
- `created_at` - 创建时间
- `updated_at` - 更新时间
- `last_login` - 最后登录时间

#### api_configs (API配置表)
- `id` - 配置ID
- `name` - API名称 (serpapi/deepseek/doubao)
- `api_key` - API密钥
- `base_url` - 基础URL (可选)
- `is_active` - 是否激活
- `test_result` - 测试结果 (JSON)
- `created_at` - 创建时间
- `updated_at` - 更新时间

#### permission_templates (权限模板表)
- `id` - 模板ID
- `name` - 模板名称
- `description` - 描述
- `permissions` - 权限列表 (JSON)
- `created_at` - 创建时间
- `updated_at` - 更新时间

#### system_logs (系统日志表)
- `id` - 日志ID
- `user_id` - 用户ID
- `action` - 操作类型
- `details` - 详细信息 (JSON)
- `ip_address` - IP地址
- `user_agent` - 用户代理
- `created_at` - 创建时间

## 4. 技术实现

### 后端技术栈
- **数据库**: SQLite (开发环境) / PostgreSQL (生产环境)
- **ORM**: Prisma
- **认证**: JWT Token
- **密码加密**: bcryptjs
- **API框架**: Next.js API Routes

### 前端技术栈
- **框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS
- **图标**: Heroicons
- **状态管理**: React Hooks

### 安全特性
- ✅ 密码加密存储
- ✅ JWT Token认证
- ✅ 权限验证中间件
- ✅ API密钥安全存储
- ✅ 输入验证和错误处理

## 5. 部署说明

### 环境变量配置
```env
DATABASE_URL="file:./dev.db"  # 开发环境使用SQLite
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

### 数据库初始化
```bash
# 生成Prisma客户端
npx prisma generate

# 创建数据库表
npx prisma db push

# 初始化数据（创建默认管理员账户）
npx tsx prisma/seed.ts
```

### 生产环境部署
1. 更换为PostgreSQL数据库
2. 设置强密码的JWT_SECRET
3. 配置HTTPS
4. 设置适当的CORS策略
5. 启用日志记录和监控

## 6. 使用指南

### 首次使用
1. 访问 `/admin/login` 登录管理后台
2. 使用默认账户 `admin/admin123` 登录
3. 进入"权限管理"创建其他管理员账户
4. 进入"系统设置"配置所需的API服务

### 权限管理最佳实践
1. 为不同职能创建专门的管理员账户
2. 使用权限模板快速分配常用权限
3. 定期审查和更新用户权限
4. 及时禁用离职员工的账户

### API配置最佳实践
1. 定期测试API连接状态
2. 妥善保管API密钥
3. 根据需要启用/禁用API服务
4. 监控API使用量和费用

## 7. 故障排除

### 常见问题
1. **登录失败**: 检查用户名密码，确认账户状态为活跃
2. **权限不足**: 确认用户具有相应的权限
3. **API测试失败**: 检查API密钥和网络连接
4. **数据库错误**: 确认数据库连接和表结构

### 技术支持
如遇到技术问题，请检查：
1. 控制台错误信息
2. 服务器日志
3. 数据库连接状态
4. 环境变量配置
