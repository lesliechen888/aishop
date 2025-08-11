import { Platform } from '@/types/collection'

interface PlatformIconCSSProps {
  platform: Platform
  size?: number
  className?: string
  showName?: boolean
}

// 平台配置
const platformConfigs: Record<Platform, { name: string; bgColor: string; textColor: string; text: string; gradient?: string }> = {
  '1688': {
    name: '1688',
    bgColor: '#FF6A00',
    textColor: '#FFFFFF',
    text: '1688',
    gradient: 'linear-gradient(135deg, #FF6A00 0%, #FF8533 100%)'
  },
  'pdd': {
    name: '拼多多',
    bgColor: '#E02E24',
    textColor: '#FFFFFF',
    text: 'PDD',
    gradient: 'linear-gradient(135deg, #E02E24 0%, #FF4444 100%)'
  },
  'douyin': {
    name: '抖音小店',
    bgColor: '#000000',
    textColor: '#FFFFFF',
    text: '抖音',
    gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)'
  },
  'taobao': {
    name: '淘宝',
    bgColor: '#FF4400',
    textColor: '#FFFFFF',
    text: '淘宝',
    gradient: 'linear-gradient(135deg, #FF4400 0%, #FF6633 100%)'
  },
  'jd': {
    name: '京东',
    bgColor: '#E1251B',
    textColor: '#FFFFFF',
    text: '京东',
    gradient: 'linear-gradient(135deg, #E1251B 0%, #FF4444 100%)'
  },
  'temu': {
    name: 'Temu',
    bgColor: '#1976D2',
    textColor: '#FFFFFF',
    text: 'TEMU',
    gradient: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)'
  }
}

export default function PlatformIconCSS({ platform, size = 24, className = '', showName = false }: PlatformIconCSSProps) {
  const config = platformConfigs[platform]

  if (!config) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div 
          className="flex items-center justify-center rounded-lg bg-gray-200 text-gray-500"
          style={{ width: size + 8, height: size + 8, fontSize: size * 0.5 }}
        >
          ?
        </div>
        {showName && <span className="ml-2 text-sm text-gray-600">未知平台</span>}
      </div>
    )
  }

  const fontSize = platform === '1688' ? size * 0.25 : size * 0.35

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        className="flex items-center justify-center rounded-lg shadow-sm font-bold transition-transform hover:scale-105"
        style={{
          width: size + 8,
          height: size + 8,
          background: config.gradient || config.bgColor,
          color: config.textColor,
          fontSize: fontSize,
          lineHeight: 1,
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {config.text}
      </div>
      {showName && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {config.name}
        </span>
      )}
    </div>
  )
}

// 简化版本，只显示图标
export function PlatformIconCSSSimple({ platform, size = 20 }: { platform: Platform; size?: number }) {
  return <PlatformIconCSS platform={platform} size={size} />
}

// 带名称版本
export function PlatformIconCSSWithName({ platform, size = 20 }: { platform: Platform; size?: number }) {
  return <PlatformIconCSS platform={platform} size={size} showName />
}
