# 单链接采集问题排查

## 问题描述
用户输入京东链接 `https://item.jd.com/10125422576234.html` 后，单链接采集没有效果。

## 可能的原因分析

### 1. 平台检测问题
**检查点**：前端平台检测是否正确识别京东链接

**京东URL模式**：
```typescript
'jd': [
  /item\.jd\.com\/(\d+)\.html/,
  /item\.m\.jd\.com\/product\/(\d+)\.html/,
  /item\.jd\.hk\/(\d+)\.html/,
  /pro\.jd\.com\/mall\/active\/.*\/(\d+)\.html/
]
```

**用户链接**：`https://item.jd.com/10125422576234.html`
**应该匹配**：`/item\.jd\.com\/(\d+)\.html/` ✅

### 2. 按钮禁用条件
**禁用条件**：`loading || !singleUrl || !detectedPlatform`

如果 `detectedPlatform` 为 null，按钮会被禁用。

### 3. Hook错误影响
开发服务器显示Hook错误，可能影响组件正常渲染：
```
Invalid hook call. Hooks can only be called inside of the body of a function component.
```

## 调试修复

### 1. 添加平台检测调试信息
```typescript
// 检测单链接平台
useEffect(() => {
  if (singleUrl) {
    const detection = platformDetector.detectPlatform(singleUrl)
    console.log('平台检测结果:', detection) // 新增调试信息
    setDetectedPlatform(detection.platform)
  } else {
    setDetectedPlatform(null)
  }
}, [singleUrl])
```

### 2. 添加UI反馈
```typescript
{detectedPlatform && (
  <p className="text-sm text-green-600 mt-1">
    ✓ 检测到平台: {supportedPlatforms.find(p => p.id === detectedPlatform)?.name}
  </p>
)}
{singleUrl && !detectedPlatform && (
  <p className="text-sm text-red-600 mt-1">
    ✗ 未能识别平台，请检查链接格式
  </p>
)}
```

## 测试步骤

### 1. 基础功能测试
1. 访问 `/admin/dashboard`
2. 点击"商品管理" → "商品列表"
3. 在单链接采集输入框中输入：`https://item.jd.com/10125422576234.html`
4. 观察页面反馈：
   - 是否显示"✓ 检测到平台: 京东"
   - 或显示"✗ 未能识别平台，请检查链接格式"
   - 按钮是否可点击（不是灰色）

### 2. 控制台调试
1. 打开浏览器开发者工具（F12）
2. 切换到Console标签
3. 输入京东链接
4. 查看控制台输出的"平台检测结果"
5. 检查detection对象的内容：
   ```javascript
   {
     platform: 'jd',
     confidence: 0.9,
     url: 'https://item.jd.com/10125422576234.html',
     isValid: true,
     productId: '10125422576234'
   }
   ```

### 3. API测试
如果平台检测正常，但采集仍然无效，可以直接测试API：
```javascript
// 在浏览器控制台执行
fetch('/api/admin/collection/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    method: 'single',
    platform: 'jd',
    urls: ['https://item.jd.com/10125422576234.html'],
    settings: {
      maxProducts: 100,
      timeout: 30000,
      retryCount: 3,
      delay: 1000
    }
  })
}).then(res => res.json()).then(console.log)
```

## 预期结果

### 正常情况
1. **平台检测**：应该显示"✓ 检测到平台: 京东"
2. **按钮状态**：按钮应该可点击（蓝色）
3. **点击效果**：点击后显示"采集任务已启动"
4. **任务列表**：在采集任务列表中看到新创建的任务

### 异常情况排查
1. **平台未识别**：检查URL格式，确认是否为标准京东商品链接
2. **按钮禁用**：检查控制台错误，可能是Hook错误影响
3. **API错误**：检查网络请求，查看API响应

## 可能的解决方案

### 1. 重启开发服务器
Hook错误可能需要重启服务器解决：
```bash
npm run dev
```

### 2. 检查平台配置
确认京东平台在supportedPlatforms中正确配置：
```typescript
{
  id: 'jd',
  name: '京东',
  icon: '/images/platforms/jd.png',
  enabled: true
}
```

### 3. 简化测试
尝试其他平台的链接，如淘宝：
```
https://item.taobao.com/item.htm?id=123456789
```

## 修复状态
- ✅ 添加了平台检测调试信息
- ✅ 添加了UI状态反馈
- ✅ 提供了详细的测试步骤
- ⏳ 等待用户测试反馈

请按照测试步骤进行验证，并查看控制台输出的调试信息。
