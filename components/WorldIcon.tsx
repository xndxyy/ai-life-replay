// 世界图标组件 - 当有图片时使用图片，否则回退到 emoji
import type { World } from '@/data/worlds'

export function WorldIcon({
  world,
  className = '',
  imgClassName = '',
}: {
  world?: World | null
  className?: string
  imgClassName?: string
}) {
  if (!world) return null

  if (world.imageIcon) {
    return (
      <img
        src={world.imageIcon}
        alt={world.name}
        className={imgClassName || `inline-block w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ${className}`}
      />
    )
  }

  return <span className={`${className}`}>{world.icon}</span>
}
