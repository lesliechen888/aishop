import { NextRequest, NextResponse } from 'next/server';
import { CollectionTask, Platform, CollectionSettings, CollectedProduct } from '@/types/collection';

// 模拟店铺商品列表
const mockShopProducts = [
  'https://detail.1688.com/offer/123456789.html',
  'https://detail.1688.com/offer/123456790.html',
  'https://detail.1688.com/offer/123456791.html',
  'https://detail.1688.com/offer/123456792.html',
  'https://detail.1688.com/offer/123456793.html',
  'https://detail.1688.com/offer/123456794.html',
  'https://detail.1688.com/offer/123456795.html',
  'https://detail.1688.com/offer/123456796.html',
  'https://detail.1688.com/offer/123456797.html',
  'https://detail.1688.com/offer/123456798.html',
];

// 模拟关键词搜索结果
const mockKeywordResults: Record<string, string[]> = {
  '服装': [
    'https://detail.1688.com/offer/clothing001.html',
    'https://item.taobao.com/item.htm?id=clothing002',
    'https://haohuo.jinritemai.com/views/product/detail?id=clothing003',
    'https://item.jd.com/clothing004.html',
    'https://detail.1688.com/offer/clothing005.html',
  ],
  '电子产品': [
    'https://item.jd.com/electronics001.html',
    'https://detail.1688.com/offer/electronics002.html',
    'https://item.taobao.com/item.htm?id=electronics003',
    'https://haohuo.jinritemai.com/views/product/detail?id=electronics004',
  ],
  '家居用品': [
    'https://detail.1688.com/offer/home001.html',
    'https://item.jd.com/home002.html',
    'https://haohuo.jinritemai.com/views/product/detail?id=home003',
  ],
  '美妆': [
    'https://haohuo.jinritemai.com/views/product/detail?id=beauty001',
    'https://item.jd.com/beauty002.html',
    'https://item.taobao.com/item.htm?id=beauty003',
  ],
  '数码配件': [
    'https://item.jd.com/digital001.html',
    'https://item.jd.com/digital002.html',
    'https://haohuo.jinritemai.com/views/product/detail?id=digital003',
  ]
};

// 解析店铺URL获取商品列表
async function getShopProducts(shopUrl: string, maxProducts: number): Promise<string[]> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 实际实现中，这里会爬取店铺页面获取商品链接
  const products = [...mockShopProducts];
  
  // 随机打乱并限制数量
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(maxProducts, products.length));
}

// 根据关键词搜索商品
async function searchProductsByKeywords(keywords: string[], maxProducts: number): Promise<string[]> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const allResults: string[] = [];
  
  for (const keyword of keywords) {
    const results = mockKeywordResults[keyword.trim()] || [];
    allResults.push(...results);
  }
  
  // 去重并限制数量
  const uniqueResults = [...new Set(allResults)];
  return uniqueResults.slice(0, Math.min(maxProducts, uniqueResults.length));
}

// 批量采集商品信息
async function batchCollectProducts(
  urls: string[], 
  settings: CollectionSettings,
  onProgress?: (progress: { collected: number; failed: number; total: number }) => void
): Promise<CollectedProduct[]> {
  const results: CollectedProduct[] = [];
  let collected = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    
    try {
      // 模拟采集延迟
      await new Promise(resolve => setTimeout(resolve, settings.delay || 1000));
      
      // 模拟采集成功率
      if (Math.random() < 0.85) { // 85% 成功率
        const product: CollectedProduct = {
          id: `auto_${Date.now()}_${i}`,
          taskId: `task_${Date.now()}`,
          platform: '1688',
          originalUrl: url,
          title: `自动采集商品 ${i + 1}`,
          description: `这是通过自动采集获取的商品描述 ${i + 1}`,
          price: Math.round((Math.random() * 500 + 10) * 100) / 100,
          currency: 'CNY',
          images: [
            `https://images.unsplash.com/photo-${1500000000000 + i}?w=400`,
            `https://images.unsplash.com/photo-${1500000000001 + i}?w=400`
          ],
          specifications: {
            '材质': '优质材料',
            '产地': '中国',
            '品牌': '知名品牌'
          },
          variants: [
            {
              id: `${i}_1`,
              name: '默认规格',
              price: Math.round((Math.random() * 500 + 10) * 100) / 100,
              stock: Math.floor(Math.random() * 1000 + 50),
              sku: `AUTO_${i}_001`,
              attributes: { '颜色': '默认', '尺寸': '标准' }
            }
          ],
          shopName: '自动采集店铺',
          shopUrl: 'https://shop123456.1688.com',
          shopRating: 4.5 + Math.random() * 0.5,
          sales: Math.floor(Math.random() * 10000),
          rating: 4.0 + Math.random() * 1.0,
          reviewCount: Math.floor(Math.random() * 1000),
          rawData: { source: 'auto_collection' },
          status: 'draft',
          filterResults: [],
          collectedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        results.push(product);
        collected++;
      } else {
        failed++;
      }
      
      // 报告进度
      if (onProgress) {
        onProgress({ collected, failed, total: urls.length });
      }
      
    } catch (error) {
      console.error(`Failed to collect product from ${url}:`, error);
      failed++;
    }
  }

  return results;
}

// 创建自动采集任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      mode, 
      shopUrl, 
      keywords, 
      maxProducts = 100, 
      settings 
    } = body;

    if (!mode || !['shop', 'keyword', 'scheduled'].includes(mode)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid collection mode'
      }, { status: 400 });
    }

    // 创建任务
    const task: CollectionTask = {
      id: `task_${Date.now()}`,
      name: mode === 'shop' ? `店铺采集: ${shopUrl}` : `关键词采集: ${keywords}`,
      platform: '1688',
      method: mode === 'shop' ? 'shop' : 'batch',
      status: 'processing',
      urls: [],
      shopUrl: mode === 'shop' ? shopUrl : undefined,
      totalProducts: 0,
      collectedProducts: 0,
      failedProducts: 0,
      progress: 0,
      startTime: new Date().toISOString(),
      settings: {
        maxProducts,
        timeout: 30000,
        retryCount: 3,
        delay: 1000,
        enableContentFilter: true,
        filterKeywords: [],
        filterRegions: true,
        filterPlatforms: true,
        filterShipping: true,
        priceRange: { min: 0, max: 10000 },
        downloadImages: true,
        maxImages: 10,
        imageQuality: 'medium',
        includeVariants: true,
        includeReviews: false,
        includeShipping: true,
        ...settings
      },
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 获取商品URL列表
    let productUrls: string[] = [];
    
    if (mode === 'shop') {
      if (!shopUrl) {
        return NextResponse.json({
          success: false,
          error: 'Shop URL is required for shop collection'
        }, { status: 400 });
      }
      productUrls = await getShopProducts(shopUrl, maxProducts);
    } else if (mode === 'keyword') {
      if (!keywords) {
        return NextResponse.json({
          success: false,
          error: 'Keywords are required for keyword collection'
        }, { status: 400 });
      }
      const keywordList = keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
      productUrls = await searchProductsByKeywords(keywordList, maxProducts);
    }

    task.urls = productUrls;
    task.totalProducts = productUrls.length;

    // 开始批量采集
    const collectedProducts = await batchCollectProducts(productUrls, task.settings);
    
    // 更新任务状态
    task.status = 'completed';
    task.endTime = new Date().toISOString();
    task.collectedProducts = collectedProducts.length;
    task.failedProducts = productUrls.length - collectedProducts.length;
    task.progress = 100;

    // TODO: 保存任务和采集的商品到数据库
    console.log('Auto collection completed:', {
      task,
      collectedProducts: collectedProducts.length
    });

    return NextResponse.json({
      success: true,
      data: {
        task,
        products: collectedProducts,
        summary: {
          total: productUrls.length,
          collected: collectedProducts.length,
          failed: productUrls.length - collectedProducts.length
        }
      }
    });

  } catch (error) {
    console.error('Auto collection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Auto collection failed'
    }, { status: 500 });
  }
}

// 获取采集任务状态
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({
      success: false,
      error: 'Task ID is required'
    }, { status: 400 });
  }

  // TODO: 从数据库获取任务状态
  // 这里返回模拟数据
  const mockTask: CollectionTask = {
    id: taskId,
    name: '模拟采集任务',
    platform: '1688',
    method: 'shop',
    status: 'completed',
    urls: mockShopProducts,
    totalProducts: 10,
    collectedProducts: 8,
    failedProducts: 2,
    progress: 100,
    startTime: new Date(Date.now() - 300000).toISOString(), // 5分钟前
    endTime: new Date().toISOString(),
    settings: {
      maxProducts: 100,
      timeout: 30000,
      retryCount: 3,
      delay: 1000,
      enableContentFilter: true,
      filterKeywords: [],
      filterRegions: true,
      filterPlatforms: true,
      filterShipping: true,
      priceRange: { min: 0, max: 10000 },
      downloadImages: true,
      maxImages: 10,
      imageQuality: 'medium',
      includeVariants: true,
      includeReviews: false,
      includeShipping: true
    },
    createdBy: 'admin',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json({
    success: true,
    data: mockTask
  });
}
