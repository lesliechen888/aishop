# 采集任务列表Bug修复

## 发现的Bug

### 问题描述
在商品列表页面的采集任务列表中，当任务状态为"completed"时，点击"查看结果"按钮会尝试打开 `/admin/collection-box?taskId=${task.id}`，但这会导致错误，因为：

1. **页面架构变更**：采集箱现在是在AdminLayout内部切换的Tab，不是独立页面
2. **跳转错误**：`window.open()` 会尝试打开一个不存在的独立页面
3. **用户体验问题**：用户点击后无法正确查看采集结果

### Bug位置
`src/components/admin/ProductCollection.tsx` 第699行：
```typescript
onClick={() => window.open(`/admin/collection-box?taskId=${task.id}`, '_blank')}
```

## 修复方案

### 1. 修改任务列表中的"查看结果"按钮

**修复前**：
```typescript
{task.status === 'completed' && (
  <button
    onClick={() => window.open(`/admin/collection-box?taskId=${task.id}`, '_blank')}
    className="text-blue-600 hover:text-blue-900"
  >
    查看结果
  </button>
)}
```

**修复后**：
```typescript
{task.status === 'completed' && (
  <button
    onClick={() => {
      // 触发切换到采集箱Tab的事件
      window.dispatchEvent(new CustomEvent('switchToCollectionBox', { 
        detail: { taskId: task.id } 
      }));
    }}
    className="text-blue-600 hover:text-blue-900"
  >
    查看结果
  </button>
)}
```

### 2. 在AdminLayout中监听切换事件

在 `src/components/admin/AdminLayout.tsx` 中添加事件监听：
```typescript
useEffect(() => {
  const userData = localStorage.getItem('adminUser');
  if (userData) {
    setUser(JSON.parse(userData));
  }

  // 监听切换到采集箱的事件
  const handleSwitchToCollectionBox = (event: CustomEvent) => {
    setCurrentView('collection-box');
    setActiveSubmenu('products');
  };

  window.addEventListener('switchToCollectionBox', handleSwitchToCollectionBox as EventListener);

  return () => {
    window.removeEventListener('switchToCollectionBox', handleSwitchToCollectionBox as EventListener);
  };
}, []);
```

## 修复效果

### 修复前的问题
- ❌ 点击"查看结果"会尝试打开错误的URL
- ❌ 用户无法正确查看采集结果
- ❌ 可能出现404错误或页面加载失败

### 修复后的效果
- ✅ 点击"查看结果"会切换到采集箱Tab
- ✅ 保持在同一页面内，用户体验流畅
- ✅ 可以传递taskId参数给采集箱组件（如需要）
- ✅ 自动展开商品管理子菜单并高亮采集箱

## 技术实现

### 事件驱动的组件通信
- 使用 `CustomEvent` 实现组件间通信
- 避免了直接的组件依赖关系
- 支持传递额外的数据（taskId）

### 状态管理
- 正确设置 `currentView` 为 'collection-box'
- 正确设置 `activeSubmenu` 为 'products'
- 确保UI状态与实际显示内容一致

## 测试验证

### 测试步骤
1. 访问 `/admin/dashboard`
2. 点击"商品管理" → "商品列表"
3. 查看采集任务列表
4. 找到状态为"completed"的任务
5. 点击"查看结果"按钮

### 预期结果
- ✅ 页面应该切换到采集箱Tab
- ✅ 商品管理子菜单应该展开
- ✅ 采集箱Tab应该高亮显示
- ✅ 不应该出现页面跳转或错误

## 其他潜在问题

### API相关
- 任务列表API (`/api/admin/collection/tasks`) 正常工作
- 返回模拟数据，包含完整的任务信息
- 支持分页、过滤和排序功能

### Hook错误
- 开发服务器日志中显示Hook错误
- 这可能影响组件的正常渲染
- 建议重启开发服务器清除缓存

## 总结
修复了采集任务列表中"查看结果"按钮的跳转错误，现在用户可以正确地从任务列表切换到采集箱查看结果，提供了更好的用户体验。
