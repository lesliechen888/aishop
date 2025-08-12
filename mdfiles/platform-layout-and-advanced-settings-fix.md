# 商品列表页面布局和高级设置修复

## 修复内容

### 1. 支持的平台布局优化 ✅

**问题**：6个平台Tab太宽，占用过多空间

**修复前**：
```typescript
<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
  {supportedPlatforms.map(platform => (
    <div key={platform.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <PlatformIconCSSWithName platform={platform.id} size={24} />
    </div>
  ))}
```

**修复后**：
```typescript
<div className="flex flex-wrap gap-3">
  {supportedPlatforms.map(platform => (
    <div key={platform.id} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <PlatformIconCSSWithName platform={platform.id} size={20} />
    </div>
  ))}
```

**改进效果**：
- 从网格布局改为弹性布局，一行展示
- 减少内边距：从 `p-4` 改为 `px-3 py-2`
- 减少图标大小：从 `size={24}` 改为 `size={20}`
- 减少间距：从 `space-x-3` 改为 `space-x-2`
- 使用 `flex-wrap` 确保在小屏幕上自动换行

### 2. 高级设置输入框字体修复 ✅

**问题**：高级设置中的数字输入框文字看不清

**修复的输入框**：
1. **价格范围**：
   - 最低价格输入框
   - 最高价格输入框

2. **图片设置**：
   - 最大图片数量输入框

3. **采集设置**：
   - 请求延迟(毫秒)输入框
   - 重试次数输入框
   - 超时时间(秒)输入框

**修复方案**：
为每个输入框添加字体颜色样式：
```typescript
className="原有样式 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
style={{ color: '#1f2937' }}
```

### 具体修复示例

#### 最低价格输入框
```typescript
<input
  type="number"
  value={settings.priceRange.min}
  onChange={(e) => setSettings(prev => ({
    ...prev,
    priceRange: { ...prev.priceRange, min: Number(e.target.value) }
  }))}
  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
/>
```

#### 请求延迟输入框
```typescript
<input
  type="number"
  value={settings.delay}
  onChange={(e) => setSettings(prev => ({ ...prev, delay: Number(e.target.value) }))}
  min="500"
  max="10000"
  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
/>
```

## 测试验证

### 支持的平台布局测试
1. 访问 `/admin/dashboard`
2. 点击"商品管理" → "商品列表"
3. 查看"支持的平台"区域
4. **预期结果**：
   - 6个平台图标在一行显示（大屏幕）
   - 图标更紧凑，不占用过多空间
   - 小屏幕时自动换行

### 高级设置输入框测试
1. 在商品列表页面点击"显示高级设置"
2. 测试以下输入框的文字输入：
   - 价格范围：最低价格、最高价格
   - 图片设置：最大图片数量
   - 采集设置：请求延迟、重试次数、超时时间
3. **预期结果**：
   - 所有输入框的数字文字清晰可读
   - 文字颜色为深灰色 `#1f2937`
   - 暗色模式下适配良好

## 修复效果

### 布局优化
- ✅ **空间利用**：支持的平台区域更紧凑
- ✅ **视觉效果**：一行展示更整洁
- ✅ **响应式**：小屏幕自动换行

### 字体修复
- ✅ **可读性**：所有高级设置输入框文字清晰
- ✅ **一致性**：与其他输入框字体效果统一
- ✅ **兼容性**：亮色和暗色模式都适配

## 总结
现在商品列表页面的布局更加紧凑合理，所有输入框的文字都清晰可读，提供了更好的用户体验。
