import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const COUNTER_FILE = path.join(process.cwd(), 'data', 'visit-count.json')

function getCount(): number {
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      const raw = fs.readFileSync(COUNTER_FILE, 'utf-8')
      return JSON.parse(raw).count || 0
    }
  } catch {}
  return 0
}

function incrementCount(): number {
  const current = getCount()
  const next = current + 1
  try {
    const dir = path.dirname(COUNTER_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: next }))
  } catch {}
  return next
}

export async function GET() {
  const count = incrementCount()
  return NextResponse.json({ count })
}
