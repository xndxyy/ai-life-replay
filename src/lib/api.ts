// 前端 API 调用封装 - SSE 流式解析

// ============================================================
// 通用 SSE 流式请求
// ============================================================

export async function streamRequest(
  url: string,
  body: any,
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    })

    if (!response.ok) {
      const errText = await response.text()
      onError(`API 错误 (${response.status}): ${errText}`)
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      onError('无法读取响应流')
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const data = trimmed.slice(6).trim()
        if (data === '[DONE]') {
          onDone(fullText)
          return
        }

        try {
          const parsed = JSON.parse(data)
          if (parsed.text) {
            fullText += parsed.text
            onChunk(parsed.text)
          } else if (parsed.error) {
            onError(parsed.error)
            return
          }
        } catch {
          // skip malformed JSON lines in SSE
        }
      }
    }

    onDone(fullText)
  } catch (err: any) {
    if (err.name === 'AbortError') return
    onError(err.message || '网络请求失败')
  }
}

// ============================================================
// 游戏 API 调用
// ============================================================

export interface GameEventData {
  age: number
  text: string
  choices?: { text: string; effect: string }[]
}

export interface BackgroundData {
  text: string
}

export interface ReviewData {
  rating: string
  tagline: string
  scores: { drama: number; achievement: number; impact: number }
  highlights: string[]
}

export async function createSession(worldLine: string): Promise<{ token: string; expiresAt: number }> {
  const response = await fetch('/api/game/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ worldLine }),
  })
  if (!response.ok) throw new Error('创建 session 失败')
  return response.json()
}

export async function generateBackground(
  params: {
    worldLine: string
    talents: string[]
    attributes: Record<string, number>
    gender: string
    race: string
    customInfo?: string
  },
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  return streamRequest('/api/game/background', params, onChunk, onDone, onError, signal)
}

export async function generateEvents(
  params: {
    worldLine: string
    currentAge: number
    maxYears: number
    attributes: Record<string, number>
    talents: string[]
    acquiredAttributes: Record<string, number>
    eventHistory: string[]
    gender: string
    race: string
    background: string
  },
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  return streamRequest('/api/game/generate', params, onChunk, onDone, onError, signal)
}

export async function generateReview(
  params: {
    worldLine: string
    lifespan: number
    ending: string
    scores: { drama: number; achievement: number; impact: number }
    lifeSummary: string
    yearEvents: string[]
    attributes: Record<string, number>
    talents: string[]
    gender: string
    race: string
  },
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  return streamRequest('/api/game/review', params, onChunk, onDone, onError, signal)
}
