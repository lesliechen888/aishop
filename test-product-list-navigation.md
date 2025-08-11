# 商品管理导航修复验证

## 修复内容

### 问题描述
商品管理下的"商品列表"菜单项应该跳转到 `/admin/product-collection` 页面，但之前没有正确的跳转逻辑。

### 解决方案
修改了 `src/components/admin/AdminLayout.tsx` 中的 `handleMenuClick` 函数，为 `product-list` 添加特殊的路由跳转逻辑。

### 修改内容
```typescript
const handleMenuClick = (item: any, child?: any) => {
  if (item.type === 'single') {
    setCurrentView(item.key);
    setActiveSubmenu(null);
  } else if (item.type === 'group') {
    if (child) {
      // 特殊处理：商品列表跳转到独立页面
      if (child.key === 'product-list') {
        router.push('/admin/product-collection');
        return;
      }
      setCurrentView(child.key);
      setActiveSubmenu(item.key);
    } else {
      setActiveSubmenu(activeSubmenu === item.key ? null : item.key);
    }
  }
};
```

## 测试步骤

### 1. 访问后台管理
- 访问：http://localhost:3000/admin
- 使用管理员账号登录

### 2. 测试商品管理导航
1. 点击左侧菜单的"商品管理"
2. 展开子菜单，应该看到：
   - 商品列表
   - 智能采集
   - 采集箱
3. 点击"商品列表"
4. **预期结果**：页面应该跳转到 `/admin/product-collection`

### 3. 验证页面功能
在 product-collection 页面应该能看到：
- 产品采集功能
- 商品管理界面
- 完整的产品管理工具

## 相关页面结构

### 商品管理菜单结构
```
商品管理 (products)
├── 商品列表 (product-list) → 跳转到 /admin/product-collection
├── 智能采集 (smart-collection) → 在AdminLayout内部渲染
└── 采集箱 (collection-box) → 在AdminLayout内部渲染
```

### 页面对应关系
- `product-list` → `/admin/product-collection/page.tsx`
- `smart-collection` → `AdminLayout` 内部组件
- `collection-box` → `AdminLayout` 内部组件

## 技术实现

### 路由跳转逻辑
- 使用 `router.push('/admin/product-collection')` 进行页面跳转
- 只有 `product-list` 使用独立页面，其他子菜单在AdminLayout内部切换

### 组件架构
- `AdminLayout` 负责大部分后台页面的布局和导航
- `product-collection` 是独立的页面，有自己的布局
- 两种方式并存，提供灵活的页面组织方式

## 预期效果

1. **导航一致性**：商品列表正确跳转到产品采集页面
2. **用户体验**：清晰的页面层级和导航逻辑
3. **功能完整性**：所有商品管理功能都能正常访问

## 注意事项

- 确保用户已登录管理员账号
- 检查 `/admin/product-collection` 页面是否正常加载
- 验证页面间的导航是否流畅

## 相关文件

- `src/components/admin/AdminLayout.tsx` - 主要修改文件
- `src/app/admin/product-collection/page.tsx` - 目标页面
- `src/components/admin/ProductCollection.tsx` - 产品采集组件
