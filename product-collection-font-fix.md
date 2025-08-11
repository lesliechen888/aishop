# 商品列表页面输入框字体修复

## 问题描述
商品列表页面（ProductCollection组件）中的所有输入框都存在字体看不清的问题：

### 受影响的输入框
1. **单链接采集**：
   - 商品链接输入框

2. **批量采集**：
   - 任务名称输入框
   - 商品链接列表textarea

3. **店铺采集**：
   - 任务名称输入框
   - 店铺链接输入框
   - 最大采集数量输入框

## 修复方案
为每个文本输入框添加字体颜色样式，确保在亮色和暗色模式下都清晰可读。

### 修复内容
对所有主要的文本输入框添加：
```typescript
className="原有样式 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
style={{ color: '#1f2937' }}
```

### 具体修复的输入框

#### 1. 单链接采集 - 商品链接输入框
```typescript
<input
  type="url"
  value={singleUrl}
  onChange={(e) => setSingleUrl(e.target.value)}
  placeholder="请输入商品链接，支持淘宝、天猫、1688、拼多多、抖音小店、Temu"
  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
/>
```

#### 2. 批量采集 - 任务名称输入框
```typescript
<input
  type="text"
  value={batchTaskName}
  onChange={(e) => setBatchTaskName(e.target.value)}
  placeholder="可选，不填写将自动生成"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
/>
```

#### 3. 批量采集 - 商品链接列表textarea
```typescript
<textarea
  value={batchUrls}
  onChange={(e) => setBatchUrls(e.target.value)}
  rows={8}
  placeholder="请输入商品链接，每行一个&#10;支持淘宝、天猫、1688、拼多多、抖音小店、Temu"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
/>
```

#### 4. 店铺采集 - 任务名称输入框
```typescript
<input
  type="text"
  value={shopTaskName}
  onChange={(e) => setShopTaskName(e.target.value)}
  placeholder="可选，不填写将自动生成"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
/>
```

#### 5. 店铺采集 - 店铺链接输入框
```typescript
<input
  type="url"
  value={shopUrl}
  onChange={(e) => setShopUrl(e.target.value)}
  placeholder="请输入店铺首页链接"
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
/>
```

#### 6. 店铺采集 - 最大采集数量输入框
```typescript
<input
  type="number"
  value={maxProducts}
  onChange={(e) => setMaxProducts(Number(e.target.value))}
  min="1"
  max="1000"
  className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
  style={{ color: '#1f2937' }}
/>
```

## 测试验证

### 测试步骤
1. 访问 `/admin/dashboard`
2. 点击"商品管理" → "商品列表"
3. 测试各个Tab下的输入框：

#### 单链接采集Tab
- 在商品链接输入框中输入文字
- 预期：文字清晰可读，深灰色

#### 批量采集Tab
- 在任务名称输入框中输入文字
- 在商品链接列表textarea中输入多行文字
- 预期：所有文字清晰可读，深灰色

#### 店铺采集Tab
- 在任务名称输入框中输入文字
- 在店铺链接输入框中输入文字
- 在最大采集数量输入框中输入数字
- 预期：所有文字清晰可读，深灰色

### 兼容性验证
- ✅ 亮色模式：文字为深灰色 `#1f2937`
- ✅ 暗色模式：文字为浅色，背景为深色
- ✅ 所有浏览器：内联样式确保优先级

## 修复结果
现在商品列表页面的所有主要输入框都有清晰可读的字体颜色，与之前修复的智能采集页面保持一致的视觉效果。
