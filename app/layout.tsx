import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 人生重开手帐',
  description: 'AI 驱动的文字人生模拟游戏 - 选择你的世界，创造属于你的故事',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans">
        {children}
      </body>
    </html>
  )
}
