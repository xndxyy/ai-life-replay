'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { worlds } from '@/data/worlds'
import { useGameStore } from '@/store/gameStore'

export default function WorldSelection() {
  const selectWorld = useGameStore((s) => s.selectWorld)
  const setCustomWorldDescription = useGameStore((s) => s.setCustomWorldDescription)
  const customWorldDescription = useGameStore((s) => s.customWorldDescription)
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleSelect = (worldId: string) => {
    if (worldId === 'custom') {
      setShowCustomInput(true)
      return
    }
    selectWorld(worldId)
  }

  const handleCustomConfirm = () => {
    if (customWorldDescription.trim()) {
      selectWorld('custom')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          选择你的世界
        </h1>
        <p className="text-[#8888aa]">每个世界都是一段全新的人生</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {worlds.map((world) => (
          <motion.div
            key={world.id}
            variants={cardVariants}
            className="world-card"
            style={{ '--theme-color': world.themeColor } as React.CSSProperties}
            onClick={() => handleSelect(world.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{world.icon}</span>
              <div>
                <h3 className="font-bold text-lg">{world.name}</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: `${world.themeColor}20`,
                    color: world.themeColor,
                    border: `1px solid ${world.themeColor}40`,
                  }}
                >
                  {world.era}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#8888aa] mb-3 line-clamp-2">
              {world.description}
            </p>

            <p className="text-xs text-[#666688] mb-3">
              <span className="text-[#a78bfa]">⏱ {world.maxAge}</span> 年寿命上限
            </p>

            <div className="flex flex-wrap gap-1.5">
              {world.attributes.map((attr) => (
                <span
                  key={attr.key}
                  className="text-xs px-2 py-0.5 rounded-full bg-[#16213e] text-[#8888aa] border border-[#2a2a4a]"
                >
                  {attr.icon} {attr.name}
                </span>
              ))}
            </div>

            {world.specialEndings.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#2a2a4a]">
                <div className="flex flex-wrap gap-1">
                  {world.specialEndings.slice(0, 3).map((ending) => (
                    <span
                      key={ending}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: `${world.themeColor}15`,
                        color: world.themeColor,
                      }}
                    >
                      {ending}
                    </span>
                  ))}
                  {world.specialEndings.length > 3 && (
                    <span className="text-xs text-[#666688]">
                      +{world.specialEndings.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* 自定义世界卡片 */}
        <motion.div
          variants={cardVariants}
          className="world-card"
          style={{ '--theme-color': '#a78bfa' } as React.CSSProperties}
          onClick={() => handleSelect('custom')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🌍</span>
            <div>
              <h3 className="font-bold text-lg">自定义世界</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/20 text-purple-400 border border-purple-800/40">
                自由创作
              </span>
            </div>
          </div>
          <p className="text-sm text-[#8888aa] mb-3">
            自己描述一个世界，让 AI 为你创造全新的人生体验
          </p>
          <p className="text-xs text-[#666688]">
            ✏️ 自定义世界观和设定
          </p>
        </motion.div>
      </motion.div>

      {/* 自定义世界输入弹窗 */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowCustomInput(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">🌍 描述你的世界</h2>
              <textarea
                className="w-full h-32 rounded-xl p-3 text-sm resize-none mb-4"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-body)',
                  outline: 'none',
                }}
                placeholder="描述你想象中的世界...&#10;例如：一个以音乐为魔法的奇幻世界，每个人都能通过演奏乐器释放力量..."
                value={customWorldDescription}
                onChange={(e) => setCustomWorldDescription(e.target.value)}
              />
              <div className="flex gap-3 justify-end">
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => setShowCustomInput(false)}
                >
                  取消
                </button>
                <button
                  className="btn-primary btn-sm"
                  onClick={handleCustomConfirm}
                  disabled={!customWorldDescription.trim()}
                >
                  开始游戏
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
