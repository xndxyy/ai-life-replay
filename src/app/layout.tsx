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
      <head>
        <link rel="preconnect" href="https://fonts.loli.net" />
        <link
          href="https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@300;400;500;600;700;900&family=Noto+Serif+SC:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
