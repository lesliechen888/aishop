import { NextRequest, NextResponse } from 'next/server';
import { CollectedProduct, Platform, PlatformDetection } from '@/types/collection';

// 模拟的商品数据
const mockProductData: Record<Platform, any> = {
  '1688': {
    title: '高品质纯棉T恤 夏季新款 男女同款',
    description: '采用优质纯棉面料，透气舒适，版型修身，适合日常穿着。多种颜色可选，支持定制LOGO。',
    price: 25.80,
    currency: 'CNY',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400'
    ],
    category: '服装',
    subcategory: 'T恤',
    specifications: {
      '面料': '100%纯棉',
      '克重': '180g',
      '工艺': '丝网印花',
      '产地': '广东'
    },
    variants: [
      { id: '1', sku: 'T001-S-RED', attributes: { '尺寸': 'S', '颜色': '红色' }, price: 25.80, stock: 100 },
      { id: '2', sku: 'T001-M-RED', attributes: { '尺寸': 'M', '颜色': '红色' }, price: 25.80, stock: 150 },
      { id: '3', sku: 'T001-L-RED', attributes: { '尺寸': 'L', '颜色': '红色' }, price: 25.80, stock: 120 },
      { id: '4', sku: 'T001-S-BLUE', attributes: { '尺寸': 'S', '颜色': '蓝色' }, price: 25.80, stock: 80 },
    ],
    supplier: {
      id: 'sup_001',
      name: '广州优质服装厂',
      rating: 4.8,
      location: '广东广州',
      responseRate: 98,
      minOrderQuantity: 50,
      deliveryTime: '3-7天'
    }
  },
  'taobao': {
    title: '韩版修身牛仔裤 弹力小脚裤 显瘦百搭',
    description: '韩版设计，修身版型，弹力面料，舒适贴身。经典蓝色，百搭时尚，适合各种场合。',
    price: 89.90,
    currency: 'CNY',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400'
    ],
    category: '服装',
    subcategory: '牛仔裤',
    specifications: {
      '面料': '棉+氨纶',
      '版型': '修身',
      '风格': '韩版',
      '适用季节': '四季'
    },
    variants: [
      { id: '1', sku: 'J001-26', attributes: { '尺寸': '26' }, price: 89.90, stock: 50 },
      { id: '2', sku: 'J001-27', attributes: { '尺寸': '27' }, price: 89.90, stock: 60 },
      { id: '3', sku: 'J001-28', attributes: { '尺寸': '28' }, price: 89.90, stock: 45 },
    ],
    supplier: {
      id: 'sup_002',
      name: '时尚牛仔专营店',
      rating: 4.6,
      location: '浙江杭州',
      responseRate: 95,
      minOrderQuantity: 1,
      deliveryTime: '1-3天'
    }
  },
  'pdd': {
    title: '儿童连帽卫衣 加绒保暖 卡通印花',
    description: '加厚加绒设计，保暖舒适。可爱卡通印花，孩子喜欢。优质面料，安全环保。',
    price: 39.90,
    currency: 'CNY',
    images: [
      'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=400',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400'
    ],
    category: '童装',
    subcategory: '卫衣',
    specifications: {
      '面料': '棉+聚酯纤维',
      '厚度': '加绒',
      '适用年龄': '3-12岁',
      '印花工艺': '数码印花'
    },
    variants: [
      { id: '1', sku: 'K001-100-BEAR', attributes: { '尺寸': '100cm', '图案': '小熊' }, price: 39.90, stock: 200 },
      { id: '2', sku: 'K001-110-BEAR', attributes: { '尺寸': '110cm', '图案': '小熊' }, price: 39.90, stock: 180 },
      { id: '3', sku: 'K001-120-CAT', attributes: { '尺寸': '120cm', '图案': '小猫' }, price: 39.90, stock: 150 },
    ],
    supplier: {
      id: 'sup_003',
      name: '童趣服装工厂',
      rating: 4.5,
      location: '江苏苏州',
      responseRate: 92,
      minOrderQuantity: 20,
      deliveryTime: '2-5天'
    }
  },
  'jd': {
    title: '京东自营 无线蓝牙耳机 降噪运动耳机',
    description: '京东自营正品保证，无线蓝牙5.0技术，主动降噪，IPX7防水，超长续航，适合运动健身使用。',
    price: 199.00,
    currency: 'CNY',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'
    ],
    category: '数码配件',
    subcategory: '耳机',
    specifications: {
      '品牌': '京东自营',
      '连接方式': '蓝牙5.0',
      '防水等级': 'IPX7',
      '续航时间': '24小时',
      '充电时间': '2小时',
      '降噪技术': '主动降噪'
    },
    variants: [
      { id: '1', sku: 'BT001-BLACK', attributes: { '颜色': '黑色' }, price: 199.00, stock: 500 },
      { id: '2', sku: 'BT001-WHITE', attributes: { '颜色': '白色' }, price: 199.00, stock: 300 },
      { id: '3', sku: 'BT001-BLUE', attributes: { '颜色': '蓝色' }, price: 199.00, stock: 200 },
    ],
    supplier: {
      id: 'jd_official',
      name: '京东自营',
      rating: 4.8,
      location: '北京',
      responseRate: 99,
      minOrderQuantity: 1,
      deliveryTime: '当日达/次日达'
    }
  },
  'douyin': {
    title: '抖音爆款 网红同款连衣裙 显瘦修身',
    description: '抖音千万播放爆款！网红博主同款连衣裙，显瘦修身设计，优质面料，多色可选。限时特价！',
    price: 89.90,
    currency: 'CNY',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
    ],
    category: '女装',
    subcategory: '连衣裙',
    specifications: {
      '面料': '雪纺',
      '版型': '修身',
      '袖长': '短袖',
      '风格': '甜美',
      '适用场合': '日常/约会'
    },
    variants: [
      { id: '1', sku: 'DR001-S-PINK', attributes: { '尺寸': 'S', '颜色': '粉色' }, price: 89.90, stock: 100 },
      { id: '2', sku: 'DR001-M-PINK', attributes: { '尺寸': 'M', '颜色': '粉色' }, price: 89.90, stock: 120 },
      { id: '3', sku: 'DR001-L-WHITE', attributes: { '尺寸': 'L', '颜色': '白色' }, price: 89.90, stock: 80 },
    ],
    supplier: {
      id: 'dy_fashion',
      name: '抖音时尚小店',
      rating: 4.7,
      location: '广东深圳',
      responseRate: 88,
      minOrderQuantity: 1,
      deliveryTime: '2-3天'
    }
  },
  'temu': {
    title: 'Wireless Bluetooth Earbuds - Premium Sound Quality',
    description: 'High-quality wireless earbuds with noise cancellation, long battery life, and premium sound quality.',
    price: 29.99,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'
    ],
    category: 'Electronics',
    subcategory: 'Earbuds',
    specifications: {
      'Brand': 'Temu',
      'Connectivity': 'Bluetooth 5.0',
      'Battery Life': '6 hours',
      'Water Resistance': 'IPX4',
      'Noise Cancellation': 'Yes'
    },
    variants: [
      { id: '1', sku: 'TE001-BLACK', attributes: { 'Color': 'Black' }, price: 29.99, stock: 1000 },
      { id: '2', sku: 'TE001-WHITE', attributes: { 'Color': 'White' }, price: 29.99, stock: 800 },
    ],
    supplier: {
      id: 'temu_global',
      name: 'Temu Global Store',
      rating: 4.4,
      location: 'Global',
      responseRate: 85,
      minOrderQuantity: 1,
      deliveryTime: '7-15 days'
    }
  }
};

// 检测平台类型
function detectPlatform(url: string): PlatformDetection {
  const platforms: Array<{ platform: Platform; patterns: string[] }> = [
    { platform: '1688', patterns: ['1688.com', 'detail.1688.com'] },
    { platform: 'taobao', patterns: ['taobao.com', 'item.taobao.com'] },
    { platform: 'pdd', patterns: ['pinduoduo.com', 'pdd.com', 'mobile.pinduoduo.com'] },
    { platform: 'jd', patterns: ['jd.com', 'item.jd.com'] },
    { platform: 'douyin', patterns: ['douyin.com', 'haohuo.jinritemai.com', 'jinritemai.com'] },
    { platform: 'temu', patterns: ['temu.com'] },
  ];

  for (const { platform, patterns } of platforms) {
    for (const pattern of patterns) {
      if (url.includes(pattern)) {
        return {
          platform,
          confidence: 0.95,
          url,
          isValid: true,
          productId: extractProductId(url, platform)
        };
      }
    }
  }

  return {
    platform: null,
    confidence: 0,
    url,
    isValid: false
  };
}

// 提取商品ID
function extractProductId(url: string, platform: Platform): string {
  // 简化的ID提取逻辑
  const match = url.match(/(?:id=|offer\/|goods_id=)(\d+)/);
  return match ? match[1] : Math.random().toString(36).substring(2, 9);
}

// 检查是否重复采集
async function checkDuplicate(url: string): Promise<boolean> {
  // TODO: 实际实现中应该查询数据库
  // 这里模拟检查逻辑
  return false;
}

// 采集商品信息
async function collectProductInfo(url: string, platform: Platform): Promise<CollectedProduct> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const mockData = mockProductData[platform];
  const productId = extractProductId(url, platform);
  
  const product: CollectedProduct = {
    id: `collected_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    taskId: `task_${Date.now()}`,
    platform,
    originalUrl: url,
    title: mockData.title,
    description: mockData.description,
    price: mockData.price,
    currency: mockData.currency,
    images: mockData.images,
    specifications: mockData.specifications,
    variants: mockData.variants,
    shopName: mockData.supplier.name,
    shopUrl: `https://${platform}.com/shop/${mockData.supplier.id}`,
    shopRating: mockData.supplier.rating,
    rawData: mockData,
    status: 'draft',
    filterResults: [],
    collectedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return product;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log('API收到采集请求:', { url });

    if (!url || typeof url !== 'string') {
      console.log('URL验证失败:', { url, type: typeof url });
      return NextResponse.json({
        success: false,
        error: 'Invalid URL provided'
      }, { status: 400 });
    }

    // 检测平台
    const detection = detectPlatform(url);
    console.log('API平台检测结果:', detection);

    if (!detection.isValid || !detection.platform) {
      console.log('平台检测失败:', { detection, isValid: detection.isValid, platform: detection.platform });
      return NextResponse.json({
        success: false,
        error: 'Unsupported platform or invalid URL',
        debug: { detection }
      }, { status: 400 });
    }

    // 检查重复
    const isDuplicate = await checkDuplicate(url);
    if (isDuplicate) {
      return NextResponse.json({
        success: false,
        error: 'Product already exists in collection',
        isDuplicate: true
      }, { status: 409 });
    }

    // 采集商品信息
    const product = await collectProductInfo(url, detection.platform);

    console.log('Collected product:', product);

    return NextResponse.json({
      success: true,
      data: product,
      message: '商品采集成功'
    });

  } catch (error) {
    console.error('Collection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to collect product'
    }, { status: 500 });
  }
}
