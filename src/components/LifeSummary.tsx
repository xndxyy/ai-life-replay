'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { generateReview } from '@/lib/api'
import type { GameReview } from '@/store/gameStore'

export default function LifeSummary({
  onRestart,
}: {
  onRestart: () => void
}) {
  const selectedWorld = useGameStore((s) => s.selectedWorld)
  const currentAge = useGameStore((s) => s.currentAge)
  const lifespan = useGameStore((s) => s.lifespan)
  const ending = useGameStore((s) => s.ending)
  const yearEvents = useGameStore((s) => s.yearEvents)
  const attributes = useGameStore((s) => s.attributes)
  const selectedTalents = useGameStore((s) => s.selectedTalents)
  const gender = useGameStore((s) => s.gender)
  const race = useGameStore((s) => s.race)
  const background = useGameStore((s) => s.background)
  const review = useGameStore((s) => s.review)
  const setReview = useGameStore((s) => s.setReview)
  const saveToLocalStorage = useGameStore((s) => s.saveToLocalStorage)

  const [isGenerating, setIsGenerating] = useState(!review)
  const [summaryText, setSummaryText] = useState('')
  const [highlights, setHighlights] = useState<string[]>([])
  const [scores, setScores] = useState({ drama: 0, achievement: 0, impact: 0 })
  const [rating, setRating] = useState('')
  const [tagline, setTagline] = useState('')
  const [scoreAnim, setScoreAnim] = useState(false)

  const displayRef = useRef('')

  // 生成人生总结
  useEffect(() => {
    if (review) {
      setHighlights(review.highlights)
      setScores(review.scores)
      setRating(review.rating)
      setTagline(review.tagline)
      setIsGenerating(false)
      return
    }

    const attrMap: Record<string, number> = {}
    attributes.forEach((a) => { attrMap[a.key] = a.value })

    const lifeEvents = yearEvents.map((e) => `[${e.age}岁] ${e.text}`)
    const lifeSummary = yearEvents.map((e) => e.text).join('\n')

    const finalAge = lifespan || currentAge

    generateReview(
      {
        worldLine: selectedWorld?.id || 'modern',
        lifespan: finalAge,
        ending: ending || '普通结局',
        scores: { drama: 0, achievement: 0, impact: 0 },
        lifeSummary,
        yearEvents: lifeEvents,
        attributes: attrMap,
        talents: selectedTalents.map((t) => t.name),
        gender,
        race,
      },
      (chunk) => {
        displayRef.current += chunk
        setSummaryText(displayRef.current)
      },
      (fullText) => {
        setIsGenerating(false)
        // 尝试解析 JSON
        try {
          const cleaned = fullText
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()
          const parsed = JSON.parse(cleaned)
          const newReview: GameReview = {
            highlights: parsed.highlights || [],
            scores: parsed.scores || { drama: 0, achievement: 0, impact: 0 },
            rating: parsed.rating || 'B',
            tagline: parsed.tagline || '平凡的一生',
          }
          setReview(newReview)
          setHighlights(newReview.highlights)
          setScores(newReview.scores)
          setRating(newReview.rating)
          setTagline(newReview.tagline)

          // 自动保存
          saveToLocalStorage()

          // 动画触发
          setTimeout(() => setScoreAnim(true), 300)
        } catch {
          // 如果解析失败，直接用全文
          setSummaryText(fullText)
          setTimeout(() => setScoreAnim(true), 300)
        }
      },
      (err) => {
        console.error('总结生成失败:', err)
        setIsGenerating(false)
        setRating('B')
        setTagline('平凡的一生')
        setTimeout(() => setScoreAnim(true), 300)
      }
    )
  }, [])

  const getRatingColor = (r: string) => {
    if (r.startsWith('S')) return '#f59e0b'
    if (r === 'A+' || r === 'A') return '#a855f7'
    if (r === 'A-') return '#5090f0'
    if (r === 'B+') return '#4ade80'
    if (r === 'B') return '#8888aa'
    return '#666688'
  }

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'linear-gradient(90deg, #f59e0b, #f0c040)'
    if (val >= 60) return 'linear-gradient(90deg, #a855f7, #7c5cbf)'
    if (val >= 40) return 'linear-gradient(90deg, #5090f0, #60a5fa)'
    if (val >= 20) return 'linear-gradient(90deg, #4ade80, #22d3ee)'
    return '#8888aa'
  }

  const getScoreEmoji = (label: string) => {
    switch (label) {
      case 'drama': return '🎭'
      case 'achievement': return '🏆'
      case 'impact': return '🌟'
      default: return '📊'
    }
  }

  const getScoreLabel = (label: string) => {
    switch (label) {
      case 'drama': return '戏剧性'
      case 'achievement': return '成就'
      case 'impact': return '影响力'
      default: return label
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">人生总结</h1>
        <p className="text-[#8888aa]">
          {selectedWorld?.icon} {selectedWorld?.name}
        </p>
      </motion.div>

      {/* 评分等级 */}
      {rating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: `${getRatingColor(rating)}15`,
              border: `1px solid ${getRatingColor(rating)}40`,
            }}
          >
            <span
              className="text-4xl font-black"
              style={{ color: getRatingColor(rating) }}
            >
              {rating}
            </span>
            {tagline && (
              <span className="text-sm text-[#8888aa] max-w-[200px]">
                {tagline}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* 角色信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-semibold">{gender} · {race}</span>
            <div className="text-xs text-[#666688] mt-0.5">
              享年 {lifespan || currentAge} 岁 · 结局：{ending || '未知'}
            </div>
          </div>
          <span className="text-2xl">{selectedWorld?.icon}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {attributes.map((attr) => {
            const def = selectedWorld?.attributes.find((a) => a.key === attr.key)
            return (
              <span key={attr.key} className="text-xs px-2 py-1 rounded-full bg-[#16213e] border border-[#2a2a4a]">
                {def?.icon} {def?.name}: {attr.value}
              </span>
            )
          })}
        </div>
        {selectedTalents.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedTalents.map((t) => (
              <span key={t.id} className="text-xs px-2 py-0.5 rounded-full" style={{
                background: t.rarity === 'orange' ? 'rgba(245,158,11,0.15)' : t.rarity === 'purple' ? 'rgba(168,85,247,0.15)' : 'rgba(80,144,240,0.15)',
                color: t.rarity === 'orange' ? '#f59e0b' : t.rarity === 'purple' ? '#a855f7' : '#5090f0',
                border: `1px solid ${t.rarity === 'orange' ? 'rgba(245,158,11,0.3)' : t.rarity === 'purple' ? 'rgba(168,85,247,0.3)' : 'rgba(80,144,240,0.3)'}`,
              }}>
                {t.name}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* 评分条 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-4 mb-6"
      >
        {['drama', 'achievement', 'impact'].map((key, idx) => {
          const val = scores[key as keyof typeof scores]
          return (
            <div key={key} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <span>{getScoreEmoji(key)}</span>
                  {getScoreLabel(key)}
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: val >= 80 ? '#f59e0b' : val >= 60 ? '#a855f7' : '#8888aa' }}
                >
                  {scoreAnim ? val : 0}
                </span>
              </div>
              <div className="score-bar">
                <motion.div
                  className="score-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: scoreAnim ? `${val}%` : 0 }}
                  transition={{ duration: 1.5, delay: 1 + idx * 0.3, ease: 'easeOut' }}
                  style={{ background: getScoreColor(val) }}
                />
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* 高光时刻 */}
      {highlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold mb-3">✨ 人生高光时刻</h2>
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + i * 0.2 }}
                className="card flex items-start gap-3"
              >
                <span className="text-lg mt-0.5">🌟</span>
                <p className="text-sm text-[#c0c0d0]">{h}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 背景故事回顾 */}
      {background && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold mb-3">📜 完整人生回顾</h2>
          <div
            className="card text-sm leading-relaxed"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <p className="mb-3">{background}</p>
            {yearEvents.map((event, i) => (
              <p key={i} className="mb-2">
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: 'rgba(124, 92, 191, 0.2)',
                    color: '#a78bfa',
                  }}
                >
                  {event.age}岁
                </span>{' '}
                {event.text}
                {event.chosenIndex !== undefined && event.choices && (
                  <span className="text-xs text-green-400 ml-1">
                    (选择了「{event.choices[event.chosenIndex]?.text}」)
                  </span>
                )}
              </p>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI 生成中的占位 */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#a78bfa] animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-[#a78bfa] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-3 h-3 rounded-full bg-[#a78bfa] animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-sm text-[#8888aa]">正在为你的人生撰写总结...</p>
          {summaryText && (
            <div className="mt-4 text-sm text-left card">
              {summaryText}
            </div>
          )}
        </motion.div>
      )}

      {/* 重新开始按钮 */}
      {!isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-center mt-8"
        >
          <button
            className="btn-primary text-lg px-10 py-4"
            onClick={onRestart}
          >
            🔄 开启新人生
          </button>
        </motion.div>
      )}
    </div>
  )
}
