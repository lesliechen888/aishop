'use client';

import { useLocalization } from '@/contexts/LocalizationContext';
import { Platform } from '@/types/collection';

interface PlatformInfoProps {
  selectedPlatform: Platform;
}

const PlatformInfo = ({ selectedPlatform }: PlatformInfoProps) => {
  const { t } = useLocalization();

  const platformDetails: Record<Platform, {
    name: string;
    description: string;
    features: string[];
    advantages: string[];
    tips: string[];
    urlExample: string;
  }> = {
    '1688': {
      name: '1688批发网',
      description: '阿里巴巴旗下批发采购平台，主要面向B2B批发市场',
      features: ['批发价格', '起订量要求', '厂家直供', '支持定制'],
      advantages: ['价格优势明显', '货源稳定', '支持大批量采购', '质量相对可控'],
      tips: ['注意起订量限制', '联系供应商确认库存', '可申请样品确认质量'],
      urlExample: 'https://detail.1688.com/offer/123456789.html'
    },
    'taobao': {
      name: '淘宝网',
      description: '中国最大的C2C电商平台，商品种类丰富',
      features: ['零售价格', '单件起售', '评价系统', '退换货保障'],
      advantages: ['商品种类最全', '价格透明', '用户评价真实', '物流快速'],
      tips: ['关注店铺信誉', '查看买家评价', '注意商品描述详情'],
      urlExample: 'https://item.taobao.com/item.htm?id=123456789'
    },
    'pdd': {
      name: '拼多多',
      description: '社交电商平台，以拼团模式和低价著称',
      features: ['拼团价格', '限时特价', '百亿补贴', '农产品直供'],
      advantages: ['价格极具竞争力', '新品牌机会多', '下沉市场覆盖好'],
      tips: ['注意商品质量', '确认发货时间', '关注平台补贴活动'],
      urlExample: 'https://mobile.pinduoduo.com/goods.html?goods_id=123456789'
    },
    'jd': {
      name: '京东商城',
      description: '中国领先的B2C电商平台，以正品和物流著称',
      features: ['正品保障', '自营商品', '当日达配送', '售后服务'],
      advantages: ['商品质量有保障', '物流速度快', '售后服务好', '品牌授权正规'],
      tips: ['优先选择自营商品', '关注京东活动价格', '注意商品规格参数'],
      urlExample: 'https://item.jd.com/123456789.html'
    },
    'douyin': {
      name: '抖音电商',
      description: '短视频+电商模式，网红带货和直播销售为主',
      features: ['网红带货', '直播销售', '短视频营销', '社交传播'],
      advantages: ['流量红利大', '转化率高', '年轻用户多', '传播速度快'],
      tips: ['关注网红信誉', '确认商品真实性', '注意售后政策'],
      urlExample: 'https://haohuo.jinritemai.com/views/product/detail?id=123456789'
    },
    'temu': {
      name: 'Temu',
      description: '拼多多海外版，面向全球市场的跨境电商平台',
      features: ['全球配送', '多币种支付', '海外仓储', '本地化服务'],
      advantages: ['国际市场机会', '价格竞争力强', '平台扶持力度大'],
      tips: ['注意国际物流时间', '了解目标市场法规', '准备多语言描述'],
      urlExample: 'https://www.temu.com/goods.html?goods_id=123456789'
    }
  };

  const platform = platformDetails[selectedPlatform];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
          {platform.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {platform.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {platform.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* 平台特色 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            🎯 平台特色
          </h4>
          <ul className="space-y-1">
            {platform.features.map((feature, index) => (
              <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* 采集优势 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            ✨ 采集优势
          </h4>
          <ul className="space-y-1">
            {platform.advantages.map((advantage, index) => (
              <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                {advantage}
              </li>
            ))}
          </ul>
        </div>

        {/* 采集建议 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            💡 采集建议
          </h4>
          <ul className="space-y-1">
            {platform.tips.map((tip, index) => (
              <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                <span className="w-1 h-1 bg-yellow-500 rounded-full mr-2"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* URL示例 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          链接格式示例：
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 font-mono break-all">
          {platform.urlExample}
        </div>
      </div>
    </div>
  );
};

export default PlatformInfo;
