'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { worlds } from '@/data/worlds'
import { professions } from '@/data/professions'
import { powerFantasyTemplates } from '@/data/powerfantasy'
import { politicalPaths } from '@/data/politics'
import { romancePartners } from '@/data/romances'
import { useGameStore } from '@/store/gameStore'
import { WorldIcon } from '@/components/WorldIcon'

// 世界体验（奇幻/设定世界）
const worldExperienceIds = ['xianxia', 'isekai', 'palace', 'magic', 'medieval', 'cyberpunk', 'space', 'wasteland']
// 人生体验（现实/自定义世界）
const lifeExperienceIds = ['modern', 'custom']

export default function WorldSelection() {
  const selectWorld = useGameStore((s) => s.selectWorld)
  const selectProfession = useGameStore((s) => s.selectProfession)
  const selectPowerFantasy = useGameStore((s) => s.selectPowerFantasy)
  const selectPoliticalPath = useGameStore((s) => s.selectPoliticalPath)
  const selectRomance = useGameStore((s) => s.selectRomance)
  const setCustomWorldDescription = useGameStore((s) => s.setCustomWorldDescription)
  const customWorldDescription = useGameStore((s) => s.customWorldDescription)
  const [showCustomInput, setShowCustomInput] = useState(false)

  const worldExperienceWorlds = worlds.filter((w) => worldExperienceIds.includes(w.id))
  const lifeExperienceWorlds = worlds.filter((w) => lifeExperienceIds.includes(w.id))

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
      transition: { staggerChildren: 0.05 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  }

  const SectionCard = ({ world }: { world: (typeof worlds)[0] }) => (
    <motion.div
      key={world.id}
      variants={cardVariants}
      className="world-card !p-3 sm:!p-4 cursor-pointer"
      style={{ '--theme-color': world.themeColor } as React.CSSProperties}
      onClick={() => handleSelect(world.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <WorldIcon world={world} imgClassName="inline-block w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover" />
        <div className="min-w-0">
          <h3 className="font-bold text-sm sm:text-base truncate">{world.name}</h3>
          <span
            className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full inline-block"
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

      <p className="text-[11px] sm:text-sm text-[#8888aa] mb-2 line-clamp-2">
        {world.description}
      </p>

      <p className="text-[10px] sm:text-xs text-[#666688] mb-2">
        <span className="text-[#a78bfa]">⏱ {world.maxAge}</span> 年
      </p>

      <div className="flex flex-wrap gap-1">
        {world.attributes.map((attr) => (
          <span
            key={attr.key}
            className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-[#16213e] text-[#8888aa] border border-[#2a2a4a]"
          >
            {attr.icon} {attr.name}
          </span>
        ))}
      </div>

      {world.specialEndings.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[#2a2a4a]">
          <div className="flex flex-wrap gap-1">
            {world.specialEndings.slice(0, 3).map((ending) => (
              <span
                key={ending}
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: `${world.themeColor}15`,
                  color: world.themeColor,
                }}
              >
                {ending}
              </span>
            ))}
            {world.specialEndings.length > 3 && (
              <span className="text-[10px] text-[#666688]">
                +{world.specialEndings.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-8 max-w-5xl mx-auto">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
          选择你的人生
        </h1>
        <p className="text-xs sm:text-sm text-[#8888aa]">每个世界都是一段全新的旅程</p>
      </motion.div>

      {/* 第一组：世界体验 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 sm:mb-8"
      >
        <motion.h2
          className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2"
        >
          <span className="text-lg sm:text-xl">🌌</span>
          <span>世界体验</span>
          <span className="text-[11px] sm:text-xs text-[#666688] font-normal ml-auto">
            {worldExperienceWorlds.length} 个世界
          </span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {worldExperienceWorlds.map((world) => (
            <SectionCard key={world.id} world={world} />
          ))}
        </motion.div>
      </motion.div>

      {/* 第二组：人生体验 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h2
          className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2"
        >
          <span className="text-lg sm:text-xl">🌟</span>
          <span>人生体验</span>
          <span className="text-[11px] sm:text-xs text-[#666688] font-normal ml-auto">
            {lifeExperienceWorlds.length} 个世界
          </span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {lifeExperienceWorlds.map((world) => (
            <SectionCard key={world.id} world={world} />
          ))}
        </motion.div>
      </motion.div>

      {/* 第三组：职业体验 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 sm:mb-8"
      >
        <motion.h2
          className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2"
        >
          <span className="text-lg sm:text-xl">💼</span>
          <span>职业体验</span>
          <span className="text-[11px] sm:text-xs text-[#666688] font-normal ml-auto">
            {professions.length} 种职业
          </span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {professions.map((prof) => (
            <motion.div
              key={prof.id}
              variants={cardVariants}
              className="world-card !p-3 sm:!p-4 cursor-pointer"
              style={{ '--theme-color': prof.color } as React.CSSProperties}
              onClick={() => selectProfession(prof.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <span className="text-xl sm:text-2xl">{prof.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base truncate">{prof.name}</h3>
                  <span
                    className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full inline-block"
                    style={{
                      background: `${prof.color}20`,
                      color: prof.color,
                      border: `1px solid ${prof.color}40`,
                    }}
                  >
                    现代 · 职业
                  </span>
                </div>
              </div>

              <p className="text-[11px] sm:text-sm text-[#8888aa] mb-2 line-clamp-2">
                {prof.description}
              </p>

              <p className="text-[10px] sm:text-xs text-[#666688] mb-2">
                <span className="text-[#a78bfa]">⏱ {prof.maxAge}</span> 年
              </p>

              <div className="flex flex-wrap gap-1">
                {prof.lifeStages.slice(0, 4).map((stage) => (
                  <span
                    key={stage.stage}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#16213e] text-[#8888aa] border border-[#2a2a4a]"
                  >
                    {stage.stage}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* 第四组：爽文体验 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 sm:mb-8"
      >
        <motion.h2
          className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2"
        >
          <span className="text-lg sm:text-xl">🔥</span>
          <span>爽文体验</span>
          <span className="text-[11px] sm:text-xs text-[#666688] font-normal ml-auto">
            {powerFantasyTemplates.length} 种爽文模板
          </span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {powerFantasyTemplates.map((tmpl) => (
            <motion.div
              key={tmpl.id}
              variants={cardVariants}
              className="world-card !p-3 sm:!p-4 cursor-pointer"
              style={{ '--theme-color': tmpl.color } as React.CSSProperties}
              onClick={() => selectPowerFantasy(tmpl.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <span className="text-xl sm:text-2xl">{tmpl.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base truncate">{tmpl.name}</h3>
                  <span
                    className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full inline-block"
                    style={{
                      background: `${tmpl.color}20`,
                      color: tmpl.color,
                      border: `1px solid ${tmpl.color}40`,
                    }}
                  >
                    爽文 · 主角模板
                  </span>
                </div>
              </div>

              <p className="text-[11px] sm:text-sm text-[#8888aa] mb-2 line-clamp-2">
                {tmpl.description}
              </p>

              <p className="text-[10px] sm:text-xs text-[#666688] mb-2">
                <span className="text-[#a78bfa]">⏱ {tmpl.maxAge}</span> 年
                <span className="ml-2 text-[#ff6f00]">⚡ {tmpl.goldenFinger.slice(0, 8)}...</span>
              </p>

              <div className="flex flex-wrap gap-1">
                {tmpl.coreTropes.slice(0, 3).map((trope, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#16213e] text-[#8888aa] border border-[#2a2a4a]"
                  >
                    {trope.slice(0, 12)}...
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* 第五组：政治的人生 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 sm:mb-8"
      >
        <motion.h2
          className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2"
        >
          <span className="text-lg sm:text-xl">🏛️</span>
          <span>政治的人生</span>
          <span className="text-[11px] sm:text-xs text-[#666688] font-normal ml-auto">
            {politicalPaths.length} 条政治路线
          </span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {politicalPaths.map((path) => (
            <motion.div
              key={path.id}
              variants={cardVariants}
              className="world-card !p-3 sm:!p-4 cursor-pointer"
              style={{ '--theme-color': path.color } as React.CSSProperties}
              onClick={() => selectPoliticalPath(path.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <span className="text-xl sm:text-2xl">{path.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base truncate">{path.name}</h3>
                  <span
                    className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full inline-block"
                    style={{
                      background: `${path.color}20`,
                      color: path.color,
                      border: `1px solid ${path.color}40`,
                    }}
                  >
                    现代 · 政治
                  </span>
                </div>
              </div>

              <p className="text-[11px] sm:text-sm text-[#8888aa] mb-2 line-clamp-2">
                {path.description}
              </p>

              <p className="text-[10px] sm:text-xs text-[#666688] mb-2">
                <span className="text-[#a78bfa]">⏱ {path.maxAge}</span> 年
              </p>

              <div className="flex flex-wrap gap-1">
                {path.lifeStages.slice(0, 4).map((stage) => (
                  <span
                    key={stage.stage}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#16213e] text-[#8888aa] border border-[#2a2a4a]"
                  >
                    {stage.stage}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* 第六组：恋爱体验 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 sm:mb-8"
      >
        <motion.h2
          className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2"
        >
          <span className="text-lg sm:text-xl">💕</span>
          <span>恋爱体验</span>
          <span className="text-[11px] sm:text-xs text-[#666688] font-normal ml-auto">
            {romancePartners.length} 种恋爱对象
          </span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {romancePartners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={cardVariants}
              className="world-card !p-3 sm:!p-4 cursor-pointer"
              style={{ '--theme-color': partner.color } as React.CSSProperties}
              onClick={() => selectRomance(partner.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <span className="text-xl sm:text-2xl">{partner.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base truncate">{partner.name}</h3>
                  <span
                    className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full inline-block"
                    style={{
                      background: `${partner.color}20`,
                      color: partner.color,
                      border: `1px solid ${partner.color}40`,
                    }}
                  >
                    现代 · 恋爱
                  </span>
                </div>
              </div>

              <p className="text-[11px] sm:text-sm text-[#8888aa] mb-2 line-clamp-2">
                {partner.description}
              </p>

              <p className="text-[10px] sm:text-xs text-[#666688] mb-2">
                <span className="text-[#a78bfa]">⏱ {partner.maxAge}</span> 年
              </p>

              <div className="flex flex-wrap gap-1">
                {partner.romanceStages.slice(0, 4).map((stage) => (
                  <span
                    key={stage.stage}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#16213e] text-[#8888aa] border border-[#2a2a4a]"
                  >
                    {stage.stage}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
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
