'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { genderOptions, raceOptions, customWorldRaceOptions } from '@/data/config'

export default function GenderRaceSelection({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const selectedWorld = useGameStore((s) => s.selectedWorld)
  const gender = useGameStore((s) => s.gender)
  const race = useGameStore((s) => s.race)
  const customInfo = useGameStore((s) => s.customInfo)
  const setGender = useGameStore((s) => s.setGender)
  const setRace = useGameStore((s) => s.setRace)
  const setCustomInfo = useGameStore((s) => s.setCustomInfo)

  const worldId = selectedWorld?.id || ''
  const races = raceOptions[worldId] || customWorldRaceOptions

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold mb-2">定制角色</h1>
        <p className="text-[#8888aa]">
          {selectedWorld?.icon} {selectedWorld?.name}
        </p>
      </motion.div>

      {/* 性别选择 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-3">选择性别</h2>
        <div className="grid grid-cols-3 gap-3">
          {genderOptions.map((opt) => (
            <motion.div
              key={opt.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`card cursor-pointer text-center transition-all ${
                gender === opt.label ? 'selected' : ''
              }`}
              style={{
                borderColor: gender === opt.label ? 'var(--primary)' : undefined,
                boxShadow: gender === opt.label ? '0 0 0 1px var(--primary)' : undefined,
              }}
              onClick={() => setGender(opt.label)}
            >
              <div className="text-3xl mb-1">{opt.icon}</div>
              <div className="font-semibold">{opt.label}</div>
              <div className="text-xs text-[#666688] mt-1">{opt.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 种族选择 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-3">选择种族 / 出身</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {races.map((opt) => (
            <motion.div
              key={opt.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`card cursor-pointer text-center transition-all ${
                race === opt.label ? 'selected' : ''
              }`}
              style={{
                borderColor: race === opt.label ? 'var(--primary)' : undefined,
                boxShadow: race === opt.label ? '0 0 0 1px var(--primary)' : undefined,
              }}
              onClick={() => setRace(opt.label)}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="font-semibold text-sm">{opt.label}</div>
              <div className="text-xs text-[#666688] mt-0.5">{opt.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 自定义信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold mb-2">自定义信息（可选）</h2>
        <textarea
          className="w-full h-20 rounded-xl p-3 text-sm resize-none"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-body)',
            outline: 'none',
          }}
          placeholder="你想让 AI 知道什么？(如：姓甚名谁、想要的人设等)"
          value={customInfo}
          onChange={(e) => setCustomInfo(e.target.value)}
        />
      </motion.div>

      {/* 操作按钮 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        <button className="btn-ghost flex-1" onClick={onBack}>
          ← 返回
        </button>
        <button
          className="btn-primary flex-1"
          onClick={onNext}
          disabled={!gender || !race}
          style={{ opacity: !gender || !race ? 0.5 : 1 }}
        >
          开始游戏 →
        </button>
      </motion.div>
    </div>
  )
}
