import { NextRequest, NextResponse } from 'next/server'
// 生成 session token
function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// POST /api/game/session
// 创建新的游戏 session
export async function POST(request: NextRequest) {
  const body = await request.json()
  const worldLine = body.worldLine

  if (!worldLine) {
    return NextResponse.json(
      { error: 'worldLine is required' },
      { status: 400 }
    )
  }

  const token = generateToken()
  const expiresAt = Date.now() + 3600 * 1000 // 1 hour

  return NextResponse.json({
    token,
    expiresAt,
  })
}
