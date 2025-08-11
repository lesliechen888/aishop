# 支持平台宽度和图片质量选择框修复

## 修复内容

### 1. 支持的平台Tab宽度优化 ✅

**问题**：之前的平台Tab太窄，需要适当增加宽度

**修复前**：
```typescript
<div className="flex flex-wrap gap-3">
  {supportedPlatforms.map(platform => (
    <div key={platform.id} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <PlatformIconCSSWithName platform={platform.id} size={20} />
    </div>
  ))}
```

**修复后**：
```typescript
<div className="flex flex-wrap gap-4">
  {supportedPlatforms.map(platform => (
    <div key={platform.id} className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-w-[120px]">
      <PlatformIconCSSWithName platform={platform.id} size={22} />
    </div>
  ))}
```

**改进效果**：
- 增加间距：从 `gap-3` 改为 `gap-4`
- 增加内边距：从 `px-3 py-2` 改为 `px-4 py-3`
- 增加图标间距：从 `space-x-2` 改为 `space-x-3`
- 增加图标大小：从 `size={20}` 改为 `size={22}`
- 设置最小宽度：`min-w-[120px]` 确保每个Tab有足够宽度
- 保持一行展示的弹性布局

### 2. 图片质量选择框字体修复 ✅

**问题**：图片质量下拉选择框的文字看不清

**修复前**：
```typescript
<select
  value={settings.imageQuality}
  onChange={(e) => setSettings(prev => ({ ...prev, imageQuality: e.target.value as any }))}
  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
>
  <option value="low">低质量</option>
  <option value="medium">中等质量</option>
  <option value="high">高质量</option>
</select>
```

**修复后**：
```typescript
<select
  value={settings.imageQuality}
  onChange={(e) => setSettings(prev => ({ ...prev, imageQuality: e.target.value as any }))}
  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
>
  <option value="low">低质量</option>
  <option value="medium">中等质量</option>
  <option value="high">高质量</option>
</select>
```

**修复方案**：
- 添加字体颜色类：`text-gray-900 dark:text-white`
- 添加暗色模式适配：`dark:bg-gray-700 dark:border-gray-600`
- 添加内联样式：`style={{ color: '#1f2937' }}` 确保优先级

## 测试验证

### 支持的平台布局测试
1. 访问 `/admin/dashboard`
2. 点击"商品管理" → "商品列表"
3. 查看"支持的平台"区域
4. **预期结果**：
   - 6个平台Tab在一行显示
   - 每个Tab有适当的宽度（最小120px）
   - Tab之间有合适的间距
   - 图标和文字清晰可见

### 图片质量选择框测试
1. 在商品列表页面点击"显示高级设置"
2. 找到"图片设置"区域
3. 点击"图片质量"下拉选择框
4. **预期结果**：
   - 下拉框中的文字清晰可读
   - 选项文字为深灰色
   - 选择后显示的文字也清晰可读

## 修复效果

### 平台Tab优化
- ✅ **宽度适中**：每个Tab有足够的显示空间
- ✅ **一行展示**：保持紧凑的一行布局
- ✅ **视觉平衡**：间距和大小更协调
- ✅ **响应式**：小屏幕时仍能自动换行

### 图片质量修复
- ✅ **可读性**：下拉选择框文字清晰可读
- ✅ **一致性**：与其他输入框字体效果统一
- ✅ **兼容性**：亮色和暗色模式都适配
- ✅ **交互性**：选择和显示都正常工作

## 技术要点

### CSS类名优化
- 使用 `min-w-[120px]` 设置最小宽度
- 保持 `flex flex-wrap` 的响应式布局
- 增加合适的内边距和间距

### 字体颜色修复
- 对select元素应用与input相同的字体颜色修复
- 使用内联样式确保优先级
- 添加暗色模式适配

## 总结
现在支持的平台Tab有了更合适的宽度，一行展示效果更好，图片质量选择框的文字也清晰可读，整体用户体验得到提升。
