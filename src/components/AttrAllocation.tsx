'use client'

import { motion } from 'framer-motion'
import { useGameStore, useRemainingPoints } from '@/store/gameStore'
import { GAME_CONFIG } from '@/data/config'

export default function AttrAllocation({
  onNext,
}: {
  onNext: () => void
}) {
  const selectedWorld = useGameStore((s) => s.selectedWorld)
  const attributes = useGameStore((s) => s.attributes)
  const updateAttribute = useGameStore((s) => s.updateAttribute)
  const remainingPoints = useRemainingPoints()

  if (!selectedWorld) return null

  // 获取世界的属性定义（包含 icon，name，description）
  const attrDefs = selectedWorld.attributes

  const handleNext = () => {
    // 检查是否所有属性都分配了（至少 1 点？还是允许 0 点？按原始设计，可以全 0，用随机）
    onNext()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold mb-2">分配初始属性</h1>
        <p className="text-[#8888aa] mb-1">{selectedWorld.icon} {selectedWorld.name}</p>
        <p className="text-sm text-[#666688]">
          剩余属性点：
          <span className={`font-bold text-lg ml-1 ${remainingPoints === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
            {remainingPoints}
          </span>
          <span className="text-xs ml-1">/ {GAME_CONFIG.totalAttributePoints}</span>
        </p>
        <div className="mt-2" style={{
          height: '3px',
          borderRadius: '2px',
          background: 'var(--bg-surface)',
          maxWidth: '400px',
          margin: '0 auto',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${((GAME_CONFIG.totalAttributePoints - remainingPoints) / GAME_CONFIG.totalAttributePoints) * 100}%`,
            background: remainingPoints === 0 ? 'var(--accent-green)' : 'var(--primary)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {attributes.map((attr) => {
          const def = attrDefs.find((d) => d.key === attr.key)
          if (!def) return null
          const maxVal = GAME_CONFIG.maxBaseAttribute

          return (
            <motion.div key={attr.key} variants={itemVariants} className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{def.icon}</span>
                  <div>
                    <span className="font-semibold">{def.name}</span>
                    <span className="text-xs text-[#666688] ml-2">{def.description}</span>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${attr.value >= 7 ? 'text-yellow-400' : attr.value >= 4 ? 'text-green-400' : 'text-[#8888aa]'}`}>
                  {attr.value}
                </span>
              </div>

              <div className="attr-bar mb-2">
                <div
                  className="attr-bar-fill"
                  style={{
                    width: `${(attr.value / maxVal) * 100}%`,
                    background: attr.value >= 7
                      ? 'linear-gradient(90deg, #f59e0b, #f0c040)'
                      : attr.value >= 4
                      ? 'linear-gradient(90deg, #4ade80, #22d3ee)'
                      : 'linear-gradient(90deg, #7c5cbf, #a78bfa)',
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  className="btn-ghost btn-sm min-w-[40px]"
                  onClick={() => updateAttribute(attr.key, -1)}
                  disabled={attr.value <= 0}
                  style={{ opacity: attr.value <= 0 ? 0.3 : 1 }}
                >
                  −
                </button>
                <button
                  className="btn-primary btn-sm flex-1"
                  onClick={() => updateAttribute(attr.key, 1)}
                  disabled={remainingPoints <= 0 || attr.value >= maxVal}
                  style={{ opacity: remainingPoints <= 0 || attr.value >= maxVal ? 0.5 : 1 }}
                >
                  +
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="text-xs text-[#555577] mb-4">
          {remainingPoints > 0
            ? `还有 ${remainingPoints} 点未分配，可以继续分配或直接开始`
            : '属性点已分配完毕'}
        </div>
        <button
          className="btn-primary text-lg px-10 py-4"
          onClick={handleNext}
        >
          {remainingPoints > 0 ? `继续（${remainingPoints} 点未分配）` : '确认分配 →'}
        </button>
        <div className="mt-2">
          <button
            className="btn-ghost btn-sm text-xs"
            onClick={() => {
              // 随机分配
              const attrs = useGameStore.getState().attributes
              let remaining = GAME_CONFIG.totalAttributePoints
              const newAttrs = attrs.map((a) => ({ ...a, value: 0 }))
              while (remaining > 0) {
                const idx = Math.floor(Math.random() * newAttrs.length)
                if (newAttrs[idx].value < GAME_CONFIG.maxBaseAttribute) {
                  newAttrs[idx].value++
                  remaining--
                }
              }
              useGameStore.getState().setAttributes(newAttrs)
            }}
          >
            🎲 随机分配
          </button>
        </div>
      </motion.div>
    </div>
  )
}
