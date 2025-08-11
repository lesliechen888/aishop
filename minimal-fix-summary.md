# 最小化修复总结

## 问题
用户反馈我把太多页面搞坏了，需要回滚到最小化修改。

## 解决方案
我已经回滚了所有复杂的修改，现在只做了一个最小化的修复：

### 唯一修改
在 `src/components/admin/AdminLayout.tsx` 的 `handleMenuClick` 函数中，只为 `product-list` 添加了特殊处理：

```typescript
const handleMenuClick = (item: any, child?: any) => {
  if (item.type === 'single') {
    setCurrentView(item.key);
    setActiveSubmenu(null);
  } else if (item.type === 'group') {
    if (child) {
      // 只对商品列表做特殊处理，跳转到product-collection页面
      if (child.key === 'product-list') {
        router.push('/admin/product-collection');
        return;
      }
      // 其他所有子菜单都使用原来的内部视图切换
      setCurrentView(child.key);
      setActiveSubmenu(item.key);
    } else {
      setActiveSubmenu(activeSubmenu === item.key ? null : item.key);
    }
  }
};
```

## 影响范围
- **只影响**：商品管理 → 商品列表 的跳转行为
- **不影响**：其他所有页面和菜单项都保持原来的行为

## 测试验证
1. 访问 `/admin` 或 `/admin/dashboard` - 应该正常工作
2. 点击其他菜单项（订单管理、数据分析等）- 应该正常工作
3. 点击商品管理 → 智能采集 - 应该正常工作（内部视图切换）
4. 点击商品管理 → 采集箱 - 应该正常工作（内部视图切换）
5. **唯一变化**：点击商品管理 → 商品列表 - 跳转到 `/admin/product-collection`

## 回滚说明
我移除了之前添加的所有复杂路由映射，恢复了AdminLayout的原始行为：
- 单页面菜单项：使用内部视图切换（setCurrentView）
- 子菜单项：使用内部视图切换（setCurrentView + setActiveSubmenu）
- 唯一例外：product-list 跳转到独立页面

这样确保了最小的影响范围，不会破坏其他页面的正常功能。
