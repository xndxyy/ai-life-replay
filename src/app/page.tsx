'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export default function Home() {
  const router = useRouter()
  const resetGame = useGameStore((s) => s.resetGame)
  const loadFromLocalStorage = useGameStore((s) => s.loadFromLocalStorage)
  const [hasSave, setHasSave] = useState(false)

  useEffect(() => {
    const save = localStorage.getItem('ai-life-save')
    setHasSave(!!save)
  }, [])

  const handleStartNew = () => {
    resetGame()
    router.push('/game')
  }

  const handleContinue = () => {
    if (loadFromLocalStorage()) {
      router.push('/game')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl" />

      <motion.div
        className="relative z-10 text-center max-w-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-2">
          <span className="text-6xl">📖</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl font-black mb-2"
          style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            AI 人生重开手帐
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-[#8888aa] mb-8"
        >
          选择你的世界，由 AI 编织你的人生故事
        </motion.p>

        <motion.div variants={itemVariants} className="space-y-3">
          <button
            onClick={handleStartNew}
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #7c5cbf, #b8862e)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(124, 92, 191, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(124, 92, 191, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 92, 191, 0.3)'
            }}
          >
            ✨ 开启新的人生
          </button>

          {hasSave && (
            <div>
              <button
                onClick={handleContinue}
                className="px-8 py-3 rounded-2xl font-semibold transition-all duration-300 text-[#a78bfa] bg-[#1a1a2e] border border-[#2a2a4a] hover:bg-[#252540] hover:border-[#4a4a7a]"
              >
                📂 继续游戏
              </button>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 text-sm text-[#666688]">
          <p>AI 驱动的人生模拟游戏</p>
          <p className="mt-1">每个选择都会影响你的人生轨迹</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 flex justify-center gap-4 text-xs text-[#555577]">
          <a href="https://re.maa-ai.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#a78bfa] transition-colors">
            原始版本 ↗
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}
