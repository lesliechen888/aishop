import { Platform } from '@/types/collection'
import Image from 'next/image'

interface PlatformIconProps {
  platform: Platform
  size?: number
  className?: string
  showName?: boolean
}

// 平台图标映射
const platformIcons: Record<Platform, { src: string; alt: string; name: string; bgColor: string }> = {
  '1688': {
    src: '/images/platforms/1688.svg',
    alt: '1688',
    name: '1688',
    bgColor: 'bg-white'
  },
  'pdd': {
    src: '/images/platforms/pinduoduo.svg',
    alt: '拼多多',
    name: '拼多多',
    bgColor: 'bg-white'
  },
  'douyin': {
    src: '/images/platforms/douyin.svg',
    alt: '抖音小店',
    name: '抖音小店',
    bgColor: 'bg-white'
  },
  'taobao': {
    src: '/images/platforms/taobao.svg',
    alt: '淘宝',
    name: '淘宝',
    bgColor: 'bg-white'
  },
  'temu': {
    src: '/images/platforms/temu.svg',
    alt: 'Temu',
    name: 'Temu',
    bgColor: 'bg-white'
  }
}

// 备用图标（当图片加载失败时使用）
const fallbackIcons: Record<Platform, string> = {
  '1688': '🏭',
  'pdd': '🛒',
  'douyin': '🎵',
  'taobao': '🛍️',
  'temu': '🌟'
}

export default function PlatformIcon({ platform, size = 24, className = '', showName = false }: PlatformIconProps) {
  const config = platformIcons[platform]
  const fallback = fallbackIcons[platform]

  if (!config) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span style={{ fontSize: size }} className="text-gray-400">
          ❓
        </span>
        {showName && <span className="ml-2 text-sm text-gray-600">未知平台</span>}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        className={`flex items-center justify-center rounded-lg shadow-sm border border-gray-200 ${config.bgColor} overflow-hidden`}
        style={{ width: size + 8, height: size + 8 }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={config.src}
            alt={config.alt}
            width={size}
            height={size}
            className="object-contain"
            onError={(e) => {
              // 图片加载失败时显示备用emoji
              const target = e.target as HTMLImageElement
              const container = target.parentElement
              if (container) {
                container.innerHTML = `<span style="font-size: ${size * 0.7}px; line-height: 1;">${fallback}</span>`
              }
            }}
            priority={false}
            unoptimized={true}
          />
        </div>
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
export function PlatformIconSimple({ platform, size = 20 }: { platform: Platform; size?: number }) {
  return <PlatformIcon platform={platform} size={size} />
}

// 带名称版本
export function PlatformIconWithName({ platform, size = 20 }: { platform: Platform; size?: number }) {
  return <PlatformIcon platform={platform} size={size} showName />
}
