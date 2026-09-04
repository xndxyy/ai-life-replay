'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { generateBackground, generateEvents } from '@/lib/api'
import type { YearEvent } from '@/store/gameStore'
import type { ChoiceHistoryEntry } from '@/app/api/game/api'
import { WorldIcon } from '@/components/WorldIcon'

export default function GamePlay({
  onReview,
}: {
  onReview: () => void
}) {
  const selectedWorld = useGameStore((s) => s.selectedWorld)
  const selectedProfession = useGameStore((s) => s.selectedProfession)
  const selectedPowerFantasy = useGameStore((s) => s.selectedPowerFantasy)
  const selectedPoliticalPath = useGameStore((s) => s.selectedPoliticalPath)
  const selectedRomance = useGameStore((s) => s.selectedRomance)
  const gender = useGameStore((s) => s.gender)
  const race = useGameStore((s) => s.race)
  const customInfo = useGameStore((s) => s.customInfo)
  const attributes = useGameStore((s) => s.attributes)
  const selectedTalents = useGameStore((s) => s.selectedTalents)
  const acquiredAttributes = useGameStore((s) => s.acquiredAttributes)
  const setBackground = useGameStore((s) => s.setBackground)
  const background = useGameStore((s) => s.background)
  const customWorldDescription = useGameStore((s) => s.customWorldDescription)
  const currentAge = useGameStore((s) => s.currentAge)
  const setAge = useGameStore((s) => s.setAge)
  const maxAge = useGameStore((s) => s.maxAge)
  const yearEvents = useGameStore((s) => s.yearEvents)
  const addYearEvents = useGameStore((s) => s.addYearEvents)
  const setDead = useGameStore((s) => s.setDead)
  const isDead = useGameStore((s) => s.isDead)
  const setIsGenerating = useGameStore((s) => s.setIsGenerating)
  const isGenerating = useGameStore((s) => s.isGenerating)
  const setEnding = useGameStore((s) => s.setEnding)
  const saveToLocalStorage = useGameStore((s) => s.saveToLocalStorage)

  const [displayBg, setDisplayBg] = useState('')
  const [isGeneratingBg, setIsGeneratingBg] = useState(true)
  const [currentDisplay, setCurrentDisplay] = useState('')
  const [, setCurrentEventIdx] = useState(0)
  const [choiceHistory, setChoiceHistory] = useState<ChoiceHistoryEntry[]>([])
  const [lastClickedEventIdx, setLastClickedEventIdx] = useState(-1)

  const abortRef = useRef<AbortController | null>(null)
  const displayRef = useRef('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  // 生成背景故事
  useEffect(() => {
    if (background) {
      setIsGeneratingBg(false)
      return
    }

    const controller = new AbortController()
    abortRef.current = controller

    const attrMap: Record<string, number> = {}
    attributes.forEach((a) => { attrMap[a.key] = a.value })

    generateBackground(
      {
        worldLine: selectedWorld?.id || 'modern',
        talents: selectedTalents.map((t) => t.name),
        attributes: attrMap,
        gender,
        race,
        customInfo: customInfo || undefined,
        customWorldDescription: customWorldDescription || undefined,
        professionName: selectedProfession?.name || undefined,
        biographySummary: (selectedProfession?.biographySummary || selectedPoliticalPath?.biographySummary) || undefined,
        powerFantasyStyle: selectedPowerFantasy?.name || undefined,
        goldenFinger: selectedPowerFantasy?.goldenFinger || undefined,
        coreTropes: selectedPowerFantasy?.coreTropes || undefined,
        politicalPathName: selectedPoliticalPath?.name || undefined,
        politicalCorePhilosophy: selectedPoliticalPath?.corePhilosophy || undefined,
        romancePartnerName: selectedRomance?.name || undefined,
        romancePersonality: selectedRomance?.personality || undefined,
        romanceStyle: selectedRomance?.romanceStyle || undefined,
      },
      (chunk) => {
        displayRef.current += chunk
        setDisplayBg(displayRef.current)
      },
      (fullText) => {
        setBackground(fullText)
        setDisplayBg(fullText)
        setIsGeneratingBg(false)
        setAge(0)
        handleGenerateEvents(0, controller.signal)
      },
      (err) => {
        console.error('背景生成失败:', err)
        setIsGeneratingBg(false)
        setAge(0)
        handleGenerateEvents(0)
      },
      controller.signal
    )

    return () => controller.abort()
  }, [])

  // 生成游戏事件
  const handleGenerateEvents = useCallback(
    async (fromAge: number, signal?: AbortSignal) => {
      if (!signal) {
        abortRef.current = new AbortController()
        signal = abortRef.current?.signal
      }

      setIsGenerating(true)
      setCurrentDisplay('')

      const attrMap: Record<string, number> = {}
      attributes.forEach((a) => { attrMap[a.key] = a.value })

      const historyText = yearEvents.map((e) => {
        const choiceInfo = e.chosenIndex !== undefined && e.choices
          ? ` [选择了: ${e.choices[e.chosenIndex].text}]`
          : ''
        return `[${e.age}岁] ${e.text}${choiceInfo}`
      })

      generateEvents(
        {
          worldLine: selectedWorld?.id || 'modern',
          currentAge: fromAge,
          maxYears: 10,
          attributes: attrMap,
          talents: selectedTalents.map((t) => t.name),
          acquiredAttributes,
          eventHistory: historyText,
          gender,
          race,
          background,
          choiceHistory: choiceHistory,
          customWorldDescription: customWorldDescription || undefined,
          professionName: selectedProfession?.name || undefined,
          biographySummary: (selectedProfession?.biographySummary || selectedPoliticalPath?.biographySummary) || undefined,
          powerFantasyStyle: selectedPowerFantasy?.name || undefined,
          goldenFinger: selectedPowerFantasy?.goldenFinger || undefined,
          coreTropes: selectedPowerFantasy?.coreTropes || undefined,
          summaryMode: selectedPowerFantasy ? fromAge >= selectedPowerFantasy.summaryStartAge : undefined,
          summaryYearSpan: selectedPowerFantasy?.summaryYearSpan || undefined,
          politicalPathName: selectedPoliticalPath?.name || undefined,
          politicalCorePhilosophy: selectedPoliticalPath?.corePhilosophy || undefined,
          romancePartnerName: selectedRomance?.name || undefined,
          romancePersonality: selectedRomance?.personality || undefined,
          romanceStyle: selectedRomance?.romanceStyle || undefined,
        },
        (chunk) => {
          setCurrentDisplay((prev) => prev + chunk)
        },
        (fullText) => {
          setCurrentDisplay('')
          setIsGenerating(false)
          try {
            const cleaned = fullText
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim()
            const parsed = JSON.parse(cleaned)
            if (parsed.events && Array.isArray(parsed.events)) {
              const events: YearEvent[] = parsed.events.map((ev: any) => ({
                age: ev.age || fromAge,
                text: ev.text || '',
                choices: ev.choices && ev.choices.length > 0
                  ? ev.choices.map((c: any) => ({
                      text: typeof c === 'string' ? c : c.text || '',
                      effect: c.effect || '',
                    }))
                  : undefined,
              }))
              addYearEvents(events)
              const lastAge = events[events.length - 1]?.age || fromAge
              setAge(lastAge)
              setLastClickedEventIdx(-1)
              scrollToBottom()
            }
          } catch {
            const fallback: YearEvent = {
              age: fromAge,
              text: fullText,
            }
            addYearEvents([fallback])
            setAge(fromAge + 5)
            setLastClickedEventIdx(-1)
            scrollToBottom()
          }
        },
        (err) => {
          console.error('事件生成失败:', err)
          setIsGenerating(false)
          setAge(fromAge + 5)
          setLastClickedEventIdx(-1)
        },
        signal
      )
    },
    [
      selectedWorld,
      attributes,
      selectedTalents,
      acquiredAttributes,
      gender,
      race,
      background,
      yearEvents,
      choiceHistory,
      setAge,
      setIsGenerating,
      addYearEvents,
      scrollToBottom,
    ]
  )

  // 处理选择
  const handleChoice = (eventIndex: number, choiceIndex: number) => {
    const store = useGameStore.getState()
    store.makeChoice(eventIndex, choiceIndex)

    const event = yearEvents[eventIndex]
    if (event && event.choices) {
      const choice = event.choices[choiceIndex]
      setChoiceHistory((prev) => [
        ...prev,
        {
          age: event.age,
          eventText: event.text,
          chosenText: choice.text,
          effect: choice.effect || '',
        },
      ])
    }

    saveToLocalStorage()
    scrollToBottom()

    // 选择后自动推进到下一岁
    const nextAge = currentAge + 1
    if (nextAge >= maxAge) {
      setAge(maxAge)
      setDead(true)
      setEnding('寿终正寝')
      saveToLocalStorage()
      setTimeout(() => onReview(), 1500)
      return
    }

    setLastClickedEventIdx(eventIndex)
    handleGenerateEvents(nextAge)
  }

  // 点击事件卡片推进到下一个故事
  const handleEventClick = (eventIndex: number) => {
    // 如果正在生成中，忽略点击
    if (isGenerating || isGeneratingBg) return

    // 只能点击最新的事件卡片
    if (eventIndex !== yearEvents.length - 1) return

    const event = yearEvents[eventIndex]

    // 如果有选择且还没选，不能推进
    if (event.choices && event.chosenIndex === undefined) return

    // 防止重复点击同一个已经触发过生成的事件
    if (lastClickedEventIdx === eventIndex) return

    const nextAge = currentAge + 1
    if (nextAge >= maxAge) {
      // 到达最大年龄
      setAge(maxAge)
      setDead(true)
      setEnding('寿终正寝')
      saveToLocalStorage()
      setTimeout(() => onReview(), 1500)
      return
    }

    setLastClickedEventIdx(eventIndex)
    handleGenerateEvents(nextAge)
    scrollToBottom()
  }

  // 死亡事件
  const handleDeath = () => {
    setDead(true)
    const deathEvent: YearEvent = {
      age: currentAge,
      text: `在 ${currentAge} 岁时，你的人生走到了终点。`,
    }
    addYearEvents([deathEvent])
    saveToLocalStorage()

    setTimeout(() => {
      onReview()
    }, 2000)
  }

  // 判断事件卡片是否可点击
  const isEventClickable = (eventIndex: number) => {
    if (isGenerating || isGeneratingBg) return false
    if (eventIndex !== yearEvents.length - 1) return false
    const event = yearEvents[eventIndex]
    if (event.choices && event.chosenIndex === undefined) return false
    if (lastClickedEventIdx === eventIndex) return false
    return true
  }

  const getAttrColor = (val: number) => {
    if (val >= 7) return '#f59e0b'
    if (val >= 4) return '#4ade80'
    return '#8888aa'
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
      {/* 角色信息头 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 p-3 card"
        style={{ borderColor: 'var(--border-accent)' }}
      >
        <div className="flex items-center gap-3">
          <WorldIcon world={selectedWorld} imgClassName="inline-block w-8 h-8 rounded-lg object-cover" />
          <div>
            <span className="font-semibold">{selectedPowerFantasy ? selectedPowerFantasy.name : selectedPoliticalPath ? selectedPoliticalPath.name : selectedProfession ? selectedProfession.name : selectedRomance ? `与「${selectedRomance.name}」的恋爱` : selectedWorld?.name}</span>
            {selectedProfession && (
              <div className="text-[10px] text-[#666688]">基于 · 现代都市</div>
            )}
            {selectedPowerFantasy && (
              <div className="text-[10px] text-[#ff6f00]">🔥 爽文 · {selectedPowerFantasy.goldenFinger.slice(0, 20)}...</div>
            )}
            {selectedPoliticalPath && (
              <div className="text-[10px] text-[#1565c0]">🏛️ {selectedPoliticalPath.corePhilosophy.slice(0, 24)}...</div>
            )}
            {selectedRomance && (
              <div className="text-[10px] text-[#ec407a]">💕 {selectedRomance.name} · {selectedRomance.personality.slice(0, 20)}...</div>
            )}
            <div className="text-xs text-[#666688]">
              {gender} · {race} · {currentAge}岁 / {maxAge}岁
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-xs">
          {attributes.map((attr) => {
            const def = selectedWorld?.attributes.find((a) => a.key === attr.key)
            return (
              <span key={attr.key} style={{ color: getAttrColor(attr.value) }}>
                {def?.icon}{attr.value}
              </span>
            )
          })}
        </div>
      </motion.div>

      {/* 背景故事展示 */}
      {displayBg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 card"
          style={{
            borderColor: 'rgba(167, 139, 250, 0.3)',
            background: 'rgba(167, 139, 250, 0.05)',
            fontFamily: "'Noto Serif SC', serif",
          }}
        >
          <div className="text-xs text-[#a78bfa] mb-2">📜 背景故事</div>
          <div className="text-sm leading-relaxed">
            {displayBg}
            {isGeneratingBg && <span className="typewriter" />}
          </div>
        </motion.div>
      )}

      {/* 事件流 */}
      <div className="space-y-3">
        {yearEvents.map((event, idx) => {
          const clickable = isEventClickable(idx)
          const isLast = idx === yearEvents.length - 1
          const hasChoicePending = event.choices && event.chosenIndex === undefined

          return (
            <motion.div
              key={`${event.age}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`event-card ${clickable ? 'cursor-pointer hover:border-[#a78bfa] hover:shadow-lg hover:shadow-purple-900/20' : ''} ${isLast && !hasChoicePending && !isGenerating ? 'ring-1 ring-purple-500/30' : ''}`}
              onClick={() => clickable && handleEventClick(idx)}
              style={{
                transition: 'all 0.2s ease',
                ...(clickable ? { borderColor: 'rgba(167, 139, 250, 0.3)' } : {}),
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(124, 92, 191, 0.2)',
                    color: '#a78bfa',
                  }}
                >
                  {event.age} 岁
                </span>
                {event.chosenIndex !== undefined && (
                  <span className="text-xs text-green-400">✓ 已选择</span>
                )}
                {clickable && (
                  <span className="text-xs text-purple-400 ml-auto animate-pulse">点击继续 ▶</span>
                )}
              </div>

              <p className="text-sm leading-relaxed mb-3">{event.text}</p>

              {/* 选择的后果展示 */}
              {event.chosenIndex !== undefined && event.choices && (
                <div className="mt-2 p-2 rounded-lg bg-green-900/10 border border-green-900/20">
                  <span className="text-xs text-green-400">
                    你选择了：{event.choices[event.chosenIndex].text}
                  </span>
                  {event.choices[event.chosenIndex].effect && (
                    <span className="block text-xs text-green-300/70 mt-0.5">
                      ↳ {event.choices[event.chosenIndex].effect}
                    </span>
                  )}
                </div>
              )}

              {/* 选择分支 */}
              {event.choices && event.chosenIndex === undefined && isLast && (
                <div className="space-y-2 mt-3 pt-3 border-t border-[#2a2a4a]">
                  <p className="text-xs text-[#8888aa] mb-2">你该怎么做？</p>
                  {event.choices.map((choice, ci) => (
                    <button
                      key={ci}
                      className="choice-btn w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleChoice(idx, ci)
                      }}
                    >
                      <span className="text-[#a78bfa] mr-2">{['A', 'B', 'C'][ci]}.</span>
                      {choice.text}
                      {choice.effect && (
                        <span className="block text-xs text-[#666688] mt-0.5 ml-5">
                          {choice.effect}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}

        {/* SSE 流式生成中的占位 */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="event-card"
          >
            {currentDisplay ? (
              <p className="text-sm leading-relaxed">{currentDisplay}</p>
            ) : (
              <div className="flex items-center gap-2 text-[#8888aa]">
                <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" style={{ animationDelay: '0.4s' }} />
                <span className="text-xs ml-1">命运正在编织...</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 底部操作区 - 精简后只保留保存和结束 */}
      {!isGenerating && !isGeneratingBg && !isDead && yearEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 space-y-3"
        >
          {/* 提示文本 - 告知用户点击卡片继续 */}
          <div className="text-center text-xs text-[#555577] mb-2">
            💡 点击最新的事件卡片继续下一段人生
          </div>

          {currentAge + 1 >= maxAge && !isDead && (
            <button
              className="btn-primary w-full text-lg py-4"
              onClick={() => {
                setAge(maxAge)
                setDead(true)
                setEnding('寿终正寝')
                saveToLocalStorage()
                setTimeout(() => onReview(), 1500)
              }}
            >
              ⏳ 度过余生...
            </button>
          )}

          <div className="flex gap-3">
            <button
              className="btn-ghost flex-1 btn-sm"
              onClick={() => {
                saveToLocalStorage()
                alert('游戏已保存！')
              }}
            >
              💾 保存
            </button>
            <button
              className="btn-ghost flex-1 btn-sm"
              style={{ borderColor: 'rgba(248, 113, 113, 0.3)', color: '#f87171' }}
              onClick={() => {
                if (confirm('确定要结束角色的人生吗？')) {
                  setEnding('主动选择结束')
                  setDead(true)
                  handleDeath()
                }
              }}
            >
              ✖ 结束人生
            </button>
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
