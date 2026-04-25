'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { talents } from '@/data/talents'
import type { Talent } from '@/data/talents'

export default function TalentSelection({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const drawnTalents = useGameStore((s) => s.drawnTalents)
  const selectedTalents = useGameStore((s) => s.selectedTalents)
  const drawTalents = useGameStore((s) => s.drawTalents)
  const toggleTalent = useGameStore((s) => s.toggleTalent)
  const redrawTalents = useGameStore((s) => s.redrawTalents)

  const [drawAnimation, setDrawAnimation] = useState(false)
  const [remainingDraws, setRemainingDraws] = useState(3)
  const [showAllTalents, setShowAllTalents] = useState(false)

  // 初始抽卡
  useEffect(() => {
    if (drawnTalents.length === 0) {
      handleDraw()
    }
  }, [])

  const handleDraw = useCallback(() => {
    if (remainingDraws <= 0) return
    setDrawAnimation(true)
    drawTalents()
    setRemainingDraws((r) => r - 1)
    setTimeout(() => setDrawAnimation(false), 500)
  }, [remainingDraws, drawTalents])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'orange': return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b', label: '传说' }
      case 'purple': return { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', text: '#a855f7', label: '史诗' }
      case 'blue': return { bg: 'rgba(80, 144, 240, 0.15)', border: 'rgba(80, 144, 240, 0.4)', text: '#5090f0', label: '稀有' }
      default: return { bg: 'rgba(192, 192, 208, 0.1)', border: 'rgba(192, 192, 208, 0.2)', text: '#c0c0d0', label: '普通' }
    }
  }

  const isSelected = (talent: Talent) => selectedTalents.some((t) => t.id === talent.id)
  const canSelect = selectedTalents.length < 3
  const hasMutexConflict = (talent: Talent) => {
    if (!talent.mutexGroup) return false
    return selectedTalents.some((t) => t.mutexGroup && t.mutexGroup === talent.mutexGroup)
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold mb-2">选择天赋</h1>
        <p className="text-[#8888aa] text-sm">
          已选 {selectedTalents.length}/3 &nbsp;|&nbsp; 剩余抽卡次数：{remainingDraws}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={drawnTalents.map((t) => t.id).join(',')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-3"
        >
          {drawnTalents.map((talent, idx) => {
            const colors = getRarityColor(talent.rarity)
            const selected = isSelected(talent)
            const conflict = hasMutexConflict(talent)

            return (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`talent-card ${selected ? 'selected' : ''}`}
                style={{
                  borderColor: selected ? colors.border : undefined,
                  background: selected ? colors.bg : undefined,
                }}
                onClick={() => {
                  if (conflict) return
                  if (selected) {
                    toggleTalent(talent)
                  } else if (canSelect) {
                    toggleTalent(talent)
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{talent.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {colors.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#8888aa]">{talent.description}</p>
                    {talent.effects && talent.effects.length > 0 && (
                      <div className="mt-2 space-y-0.5">
                        {talent.effects.map((eff, i) => (
                          <p key={i} className="text-xs text-[#666688]">
                            {eff.type === 'passive' ? '被动' : '主动'}: {eff.description}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    {selected ? (
                      <span className="text-green-400 text-xl">✓</span>
                    ) : (
                      <span className={`text-lg ${canSelect && !conflict ? 'text-[#555577]' : 'text-[#333355]'}`}>
                        +
                      </span>
                    )}
                  </div>
                </div>
                {conflict && (
                  <p className="text-xs text-red-400 mt-1">此天赋与已选天赋互斥</p>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 space-y-3">
        <div className="flex gap-3">
          <button
            className="btn-ghost flex-1"
            onClick={handleDraw}
            disabled={remainingDraws <= 0 || drawAnimation}
            style={{ opacity: remainingDraws <= 0 ? 0.4 : 1 }}
          >
            🎲 重抽 ({remainingDraws} 次)
          </button>
          <button
            className="btn-primary flex-1"
            onClick={onNext}
            disabled={selectedTalents.length === 0}
            style={{ opacity: selectedTalents.length === 0 ? 0.5 : 1 }}
          >
            确认选择 →
          </button>
        </div>

        <div className="text-center">
          <button className="btn-ghost btn-sm text-xs" onClick={onBack}>
            ← 返回重新选择世界
          </button>
        </div>

        {/* 已选天赋展示 */}
        {selectedTalents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 card"
            style={{ borderColor: 'var(--border-accent)' }}
          >
            <h3 className="text-sm font-semibold text-[#a78bfa] mb-2">已选择的天赋</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTalents.map((t) => {
                const colors = getRarityColor(t.rarity)
                return (
                  <span
                    key={t.id}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {t.name}
                    <button
                      className="ml-1.5 opacity-60 hover:opacity-100"
                      onClick={() => toggleTalent(t)}
                    >
                      ×
                    </button>
                  </span>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
