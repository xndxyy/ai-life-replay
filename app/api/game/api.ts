// 游戏 API 路由定义
// 后端 API 逻辑 - 使用 OpenAI 兼容 API

import { NextRequest } from 'next/server'

// ============================================================
// 类型定义
// ============================================================

export interface CreateSessionRequest {
  worldLine: string
  gender?: string
  race?: string
}

export interface CreateSessionResponse {
  token: string
  expiresAt: number
}

export interface BackgroundRequest {
  worldLine: string
  talents: string[]
  attributes: Record<string, number>
  gender: string
  race: string
  customInfo?: string
  customWorldDescription?: string
  professionName?: string
  biographySummary?: string
  powerFantasyStyle?: string
  goldenFinger?: string
  coreTropes?: string[]
  politicalPathName?: string
  politicalCorePhilosophy?: string
  romancePartnerName?: string
  romancePersonality?: string
  romanceStyle?: string
}

export interface GenerateRequest {
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
  choiceHistory?: ChoiceHistoryEntry[]
  customWorldDescription?: string
  professionName?: string
  biographySummary?: string
  summaryMode?: boolean
  summaryYearSpan?: number
  powerFantasyStyle?: string
  goldenFinger?: string
  coreTropes?: string[]
  politicalPathName?: string
  politicalCorePhilosophy?: string
  romancePartnerName?: string
  romancePersonality?: string
  romanceStyle?: string
}

export interface ChoiceHistoryEntry {
  age: number
  eventText: string
  chosenText: string
  effect: string
}

export interface ReviewRequest {
  worldLine: string
  lifespan: number
  ending: string
  scores: {
    drama: number
    achievement: number
    impact: number
  }
  lifeSummary: string
  yearEvents: string[]
  attributes: Record<string, number>
  talents: string[]
  gender: string
  race: string
  customWorldDescription?: string
}

// ============================================================
// AI API 调用封装
// ============================================================

const AI_API_BASE = process.env.AI_API_BASE || 'https://ark.cn-beijing.volces.com/api/v3'
const AI_API_KEY = process.env.AI_API_KEY || ''
const AI_MODEL = process.env.AI_MODEL || 'doubao-seed-1-6-flash-250615'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIStreamOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
}

export async function* streamAI(options: AIStreamOptions): AsyncGenerator<string> {
  const response = await fetch(`${AI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: options.messages,
      temperature: options.temperature ?? 0.8,
      max_tokens: options.maxTokens ?? 4096,
      stream: true,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`AI API Error (${response.status}): ${errText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body from AI API')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') return
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ''
          if (content) yield content
        } catch {
          // skip malformed lines
        }
      }
    }
  }
}

// ============================================================
// Session 管理 (简单实现)
// ============================================================

const sessions = new Map<string, number>()

function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// ============================================================
// Prompt 模板
// ============================================================

// 属性 key 到中文名的映射（所有世界共用）
const ATTR_NAME_MAP: Record<string, string> = {
  face: '颜值', intelligence: '智力', physique: '体质', family: '家境',
  power: '力量', wisdom: '智慧', social: '社交', resource: '资源',
  rootbone: '根骨', perception: '悟性', luck: '气运', sect: '宗门底蕴',
  foresight: '先知', charm: '魅力', survival: '求生', influence: '影响力',
  appearance: '容貌', cunning: '心机', favor: '圣眷', lineage: '家世',
  mana: '魔力', wisdom2: '智慧', might: '体魄', bloodline: '血统',
  combat: '武力', strategy: '智谋', leadership: '魅力', domain: '领地',
  hacking: '黑客', cybernetic: '义体化', streetRep: '街头信誉', corporate: '企业关系',
  piloting: '驾驶', tech: '科技', diplomacy: '外交', fleet: '舰队',
}

function getAttrName(key: string): string {
  return ATTR_NAME_MAP[key] || key
}

function formatAttributes(attrs: Record<string, number>): string {
  return Object.entries(attrs)
    .map(([k, v]) => `${getAttrName(k)}: ${v}`)
    .join('，')
}

function getWorldConfig(worldLine: string): { name: string; style: string; endings: string[]; maxAge: number } {
  const worlds: Record<string, { name: string; style: string; endings: string[]; maxAge: number }> = {
    modern: {
      name: '现代都市',
      style: '现实主义基调，关注升学、就业、恋爱、家庭、事业成就、退休等现实话题。可涉及社会热点（房价、创业、AI 浪潮等），幽默感偏社会讽刺和自嘲。角色体质 3+ 时 55 岁前不应因健康原因死亡。中年期（35-55）聚焦事业和家庭，不要反复安排疾病剧情。',
      endings: ['学术巅峰', '商业帝国', '星际移民', '意识永生', '功成身退', '著书传世'],
      maxAge: 90,
    },
    xianxia: {
      name: '九州仙域',
      style: '仙侠小说风格，涉及修炼境界提升、宗门争斗、秘境探险、丹药炼器、心魔渡劫。用"你"的视角叙述。术语如灵气、金丹、元婴等需自然融入。',
      endings: ['飞升仙界', '羽化登仙', '大能转世', '开宗立派', '化身天道'],
      maxAge: 130,
    },
    isekai: {
      name: '墨海浮生',
      style: '穿书/重生风格，带有自我意识和剧情认知。角色清楚原著走向，需要在已知剧情和蝴蝶效应之间权衡。可包含搞笑吐槽、系统元素、剧情偏离等。',
      endings: ['回到现实', '成为新主角', '黑化 boss', '平行世界定居', '与原著和解'],
      maxAge: 80,
    },
    palace: {
      name: '朱门深宫',
      style: '古典宫斗风格，涉及选秀册封、后宫争宠、朝堂权谋、家族兴衰。用"你"的视角，注重心理描写和计谋博弈。',
      endings: ['垂帘听政', '远嫁和亲', '一代贤后', '凤临天下'],
      maxAge: 70,
    },
    magic: {
      name: '奥术大陆',
      style: '西方奇幻魔法风格，涉及魔法学习、法术对战、学院生活、秘境探索、种族纷争。用"你"的视角，充满魔法描述和奇幻色彩。',
      endings: ['龙骑士', '元素归一', '大贤者', '位面行者'],
      maxAge: 110,
    },
    medieval: {
      name: '铁与火的纪元',
      style: '中世纪战争史诗风格，关注军事征战、政治联姻、城堡围攻、骑士精神、瘟疫/饥荒、信仰冲突。用"你"的视角，叙事直接有力。',
      endings: ['十字军英雄', '传奇王者', '隐世农夫', '圣殿守护', '海外建国'],
      maxAge: 60,
    },
    cyberpunk: {
      name: '夜之城 2099',
      style: '赛博朋克黑色电影风格，关注义体改造、网络入侵、企业阴谋、街头火拼、身份认同。用"你"的视角，带有科技感和荒诞感。',
      endings: ['上传意识', '系统崩溃', '街头传奇', '机械飞升'],
      maxAge: 100,
    },
    space: {
      name: '银河纪元',
      style: '太空歌剧科幻风格，关注星际航行、外星文明接触、太空战斗、殖民开拓、科技奇点。用"你"的视角，宏大叙事。',
      endings: ['星际流浪者', '虫洞殉难', '太空隐士'],
      maxAge: 110,
    },
    wasteland: {
      name: '废土末世',
      style: '废土末世生存风格，关注资源争夺、变异生物、幸存者营地、道德抉择、文明重建。用"你"的视角，叙事残酷但有力，偶尔有黑暗幽默。',
      endings: ['变异觉醒', '新文明奠基', '绿洲守护者', '星际逃离', '废土传奇'],
      maxAge: 50,
    },
    custom: {
      name: '自定义世界',
      style: '', // 由 customWorldDescription 动态填充
      endings: ['传奇', '凡尘', '远方', '归隐', '觉醒'],
      maxAge: 100,
    },
  }

  const config = worlds[worldLine] || worlds.modern

  // 如果是自定义世界，使用用户描述作为叙事风格
  if (worldLine === 'custom') {
    return {
      ...config,
      style: '', // 使用传入的 customWorldDescription 替代
    }
  }

  return config
}

function getAttrInterpretation(attrs: Record<string, number>): string {
  const lines: string[] = []
  for (const [key, val] of Object.entries(attrs)) {
    const name = getAttrName(key)
    if (val >= 8) lines.push(`【${name}=${val}】顶尖/卓越水平——这个属性的优势将极大影响角色命运，故事必须重点体现。比如高智力意味着学业/科研优势，高家境意味着优渥的出身资源。`)
    else if (val >= 5) lines.push(`【${name}=${val}】良好水平——这是角色的优势，故事中应体现对应的便利或机会。`)
    else if (val >= 3) lines.push(`【${name}=${val}】普通水平——中庸，不出彩也不拖后腿，故事中适当提及。`)
    else lines.push(`【${name}=${val}】薄弱水平——这是角色的明显短板或缺陷，故事中应体现因此遇到的困难。一开始投入点数少的领域，角色在相应方面就会比较弱。`)
  }
  return lines.join('\n')
}

export function buildBackgroundPrompt(req: BackgroundRequest): ChatMessage[] {
  const world = getWorldConfig(req.worldLine)
  // 使用自定义世界描述（如果有的话）
  const worldStyle = req.customWorldDescription || world.style
  const worldDescription = req.customWorldDescription
    ? `\n世界设定：自定义世界\n【用户自定义世界描述】：${req.customWorldDescription}\n叙事风格：根据用户描述自行发挥，保持世界观一致。`
    : `\n世界设定：${world.name}\n叙事风格：${world.style}`
  const attrStr = formatAttributes(req.attributes)
  const attrInterpretation = getAttrInterpretation(req.attributes)

  const systemPrompt = `你是一个擅长撰写人生经历的叙事作家。你将以"你"（第二人称）的口吻，为用户生成一段角色背景故事。

${worldDescription}
最大寿命：${world.maxAge} 岁

角色属性：${attrStr}
属性含义解释（直接影响角色出身和童年经历）：
${attrInterpretation}

性别：${req.gender || '未指定'}
种族：${req.race || '未指定'}
天赋：${req.talents.join('、') || '无'}
${req.professionName ? `\n【职业模式】这个角色注定会成为 ${req.professionName}。\n该职业的人生轨迹知识：\n${req.biographySummary}\n背景故事应该体现角色早年与该职业的缘分或相关经历，为日后走上这条职业道路埋下伏笔。` : ''}
${req.powerFantasyStyle ? `\n【爽文模式】这是一个 ${req.powerFantasyStyle} 的故事。\n【金手指】：${req.goldenFinger || '无'}\n核心套路：${(req.coreTropes || []).join('、')}\n注意：背景故事要铺垫主角的"与众不同"——暗示他/她拥有特殊潜力或即将获得奇遇。出身可以是平凡甚至落魄（制造逆袭空间），但性格中要有不甘平庸的底色。` : ''}
${req.politicalPathName ? `\n【政治人生模式】这是一个走"${req.politicalPathName}"路线的政治人物的人生故事。\n核心理念：${req.politicalCorePhilosophy || '无'}\n参考真实政治人物的生涯轨迹（传记知识已嵌入 biographySummary）\n注意：背景故事要体现角色早年与社会/政治环境的接触——可能出身贫困让他理解民生疾苦，或在求学时期接触到进步思想，或是家族背景提供了政治启蒙。为日后走上政治道路埋下第一颗种子。` : ''}
${req.romancePartnerName ? `\n【恋爱体验模式】这是一个关于爱情的浪漫人生故事。\n【恋爱对象】：${req.romancePartnerName}\n【对方的性格】：${req.romancePersonality || '温柔体贴'}\n注意：背景故事应该体现角色早年的经历如何塑造了角色的性格和对爱情的态度。为日后与${req.romancePartnerName}的相遇埋下伏笔——比如因为童年经历而形成的性格特质、因为某个事件而对爱情产生的期待或恐惧。不需要在背景故事中就让对方出现，但要铺垫角色"准备好被爱"或"需要被爱"的状态。` : ''}

【因果链规则——必须严格遵守】：
1. 角色的出身背景必须与初始点数分配高度一致——某个属性投了多少点，故事中就应该有对应的体现
2. 投了高点的属性必须对应角色的优势出身或经历（如家境投满→富家子弟；智力投满→天资聪颖；体质投满→自幼健壮）
3. 没投点或低点的属性必须对应角色的短板或劣势（如体质 0→体弱多病；家境 0→出身贫寒；智力 0→学习困难）
4. 天赋必须直接影响角色的早年经历
5. 种族和性别必须影响角色的社会处境和早期经历
6. 背景故事的细节应该让玩家感觉"这个点数分配确实造就了这个角色"
7. 角色当前年龄为 0 岁，故事涵盖从出生到童年的关键经历
8. 字数约 150-200 字，用第二人称"你"，语言生动有代入感
9. **重要：不要在故事文字中出现属性值、属性名称或游戏机制相关的词汇**（如"颜值=6"、"智力属性"、"点数"等）。属性应该通过角色的实际经历和表现来自然体现，而不是直接说出来。`

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `请根据以上属性和设定，为这个角色生成背景故事。确保点数分配、天赋、性别、种族全部在故事中有具体体现，形成完整的因果逻辑。` },
  ]
}

export function buildGeneratePrompt(req: GenerateRequest): ChatMessage[] {
  const world = getWorldConfig(req.worldLine)
  // 使用自定义世界描述（如果有的话）
  const worldStyle = req.customWorldDescription || world.style
  const worldDescription = req.customWorldDescription
    ? `\n世界设定：自定义世界\n【用户自定义世界描述】：${req.customWorldDescription}\n叙事风格：根据用户描述自行发挥，保持世界观一致。`
    : `\n世界设定：${world.name}\n叙事风格：${world.style}`
  const attrStr = formatAttributes(req.attributes)
  const acqStr = formatAttributes(req.acquiredAttributes)
  const attrInterpretation = getAttrInterpretation(req.attributes)

  // 构建选择历史描述
  let choiceHistoryStr = ''
  if (req.choiceHistory && req.choiceHistory.length > 0) {
    choiceHistoryStr = '玩家之前做出的重要选择及其后果：\n' +
      req.choiceHistory.map((ch, i) =>
        `【第${i + 1}次选择，${ch.age}岁时】事件：${ch.eventText}\n  → 玩家选择了：${ch.chosenText}\n  → 后果：${ch.effect}`
      ).join('\n\n')
    choiceHistoryStr += '\n\n这些选择已经改变了角色的人生轨迹，后续事件必须基于这些已经做出的选择来推演，形成合理的因果链。'
  }

  const systemPrompt = `你是一个擅长叙事的人生模拟系统。你将以"你"（第二人称）的口吻，为用户生成接下来的人生事件。

${worldDescription}
最大寿命：${world.maxAge} 岁

角色初始属性：${attrStr}
属性含义解释（直接影响事件走向）：
${attrInterpretation}

后天属性：${acqStr}
性别：${req.gender || '未指定'}
种族：${req.race || '未指定'}
天赋：${req.talents.join('、') || '无'}
${req.professionName ? `\n【职业模式】这个角色的职业是 ${req.professionName}。\n该职业的人生轨迹知识（必须严格参考这些阶段来推进故事）：\n${req.biographySummary}\n注意：后续生成的事件必须围绕该角色在其职业道路上的人生展开，包括求学入行、职业发展、行业挑战、退休转型等阶段，让玩家体验这个职业的真实人生。` : ''}
${req.powerFantasyStyle ? `\n【爽文模式】这是一个 ${req.powerFantasyStyle} 的故事。\n【金手指】：${req.goldenFinger || '无'}\n核心套路：${(req.coreTropes || []).join('、')}` : ''}
${req.politicalPathName ? `\n【政治人生模式】这个角色走的是"${req.politicalPathName}"路线。\n核心理念：${req.politicalCorePhilosophy || '无'}\n注意：后续生成的事件必须围绕该角色在政治道路上的人生展开——包括仕途晋升、政策制定、危机应对、权力博弈、选举/任命等。让玩家体验真实的政治生涯轨迹。参考真实政治人物的生涯知识已嵌入 biographySummary。` : ''}
${req.romancePartnerName ? `\n【恋爱体验模式】这个角色正在和「${req.romancePartnerName}」谈一场甜甜的恋爱。\n【对方的性格】：${req.romancePersonality || '温柔体贴'}\n\n【恋爱叙事风格指南】：\n${req.romanceStyle || '这是一段浪漫的爱情故事。'}\n\n重要叙事规则：\n1. 这个故事的核心是"恋爱"——角色的人生经历必须围绕与「${req.romancePartnerName}」的感情发展展开。学业/事业/生活事件都是感情的背景板。\n2. 从相识到相知到相爱，每个阶段都要有细腻的情感描写——心动、暧昧、确认关系、热恋、磨合、相守。\n3. 对方的性格特征${req.romancePersonality ? '（' + req.romancePersonality + '）' : ''}必须贯穿始终——对方的言行举止要符合人物设定。\n4. 日常互动也要写出甜蜜感——一起吃饭、一起散步、一起面对生活的点点滴滴。\n5. 重要节点（表白/初吻/同居/见家长/求婚/婚礼/生子等）必须详细描写。\n6. 故事可以有波折和挑战，但整体基调应是温暖治愈的"甜甜的恋爱"。` : ''}

角色背景：
${req.background}

当前年龄：${req.currentAge} 岁
游戏已进行的人生事件摘要：
${req.eventHistory.slice(-5).join('\n')}

${choiceHistoryStr}

【因果链规则——必须严格遵守】：
1. 属性值直接影响事件的走向——高属性的领域角色更容易成功，低属性的领域更容易失败或遇到困难。点点分配必须影响故事。
2. 天赋必须在事件中发挥作用——比如"商业头脑"天赋应在涉及经商/事业的事件中体现。
3. 玩家的选择必须有可见的下游后果——如果之前选择了某个选项，后续事件必须合理延续该选择的结果。
4. 角色背景必须影响事件——角色出身寒门 vs 出身富贵，面临的挑战和社会关系应当不同。
5. 每个事件之间应该有逻辑连贯性，形成因果链条，而不是随机事件堆砌。
6. 避免出现和角色属性、背景、天赋矛盾的情节。
7. 如果角色有做出重要选择（职业、婚姻、居住地等），后续事件应延续该选择的结果。
8. **重要：不在事件文本中出现属性名称、属性值或任何游戏机制词汇**。不要写 "颜值=6"、"智力属性"、"力量值" 这类内容。属性影响应当通过角色的实际表现自然体现——聪明的人说话有条理，好看的人被人夸赞长相，但不要直接说出属性数值。

${req.summaryMode
  ? `请生成角色在 ${req.currentAge}-${req.currentAge + (req.summaryYearSpan || 3) - 1} 岁期间的${req.summaryYearSpan || 3}年人生事件。注意：
1. 这是多年度生成模式——你需要生成连续 ${req.summaryYearSpan || 3} 年的事件
2. 对于平淡/普通的年份（事业发展平稳、无敌期、日常修炼等），用 1-2 句话概括即可，且**不包含选择分支**
3. 对于重要节点（突破/升级、大战、关键社交、重大决策、行业变革），必须详细描写并给出选择分支（choices）
4. 使用第二人称"你"叙述
5. 不要提前结束游戏，按正常人生轨迹推进
6. 即使是在概括的年份里，也要保持故事感——不要变成干巴巴的年表
7. choices 是可选字段——只有重大抉择年份才需要，普通年份的 events 中省略 choices 或设为 null`
  : `请生成角色在 ${req.currentAge}${req.maxYears && req.maxYears > 1 ? `-${req.currentAge + req.maxYears - 1}` : ''} 岁${req.maxYears && req.maxYears > 1 ? '每年' : '这一年'}的人生事件。注意：
1. ${req.maxYears && req.maxYears > 1 ? `生成从 ${req.currentAge} 岁到 ${req.currentAge + req.maxYears - 1} 岁连续 ${req.maxYears} 年的故事，每年 1 条。` : ''}**这是一个人真实的人生**——每一年都要写这个年龄特有的人生经历。3岁学走路说话、6岁上小学、12岁上初中、15岁上高中、18岁高考、22岁大学毕业找工作...不能每一年都写同样的「跑步摔倒」之类的重复内容。
2. 使用第二人称"你"叙述，语言自然流畅，像在读一本人物传记
3. 事件**可以包含** 0-3 个选择分支（choices），**只有面对重大抉择时才给出选择**。普通年份（日常学习、平稳工作等）不需要选择分支，玩家点击直接继续即可
4. 每个年份的事件必须有新内容——不能和上一年重复相似的场景和动作。年龄增长，角色的人生阶段和面临的事物也在变化
5. 不要提前结束游戏，按正常人生轨迹推进
6. 如果有重要人生节点（上学、毕业、工作、结婚、生子、升职等），描述详细一些
7. 属性值影响角色在事件中的表现，但不是事件的核心——不要围绕「在某个地方爬/跑/跳」来写，而是写这个年龄真正会经历的人生事件
8. 每一年的事件描述**保持简洁**——约 40-80 字，一句话概括这一年最重要的事即可，不需要长篇大论。只有极少数关键年份可以稍长（如100字）。`}

输出格式（choices 为可选字段，没有重大抉择时设为 null 或省略）：
{
  "events": [
    {
      "age": 当前年龄,
      "text": "事件描述文本",
      "choices": [
        { "text": "选择A", "effect": "选择A的后果描述" },
        { "text": "选择B", "effect": "选择B的后果描述" },
        { "text": "选择C", "effect": "选择C的后果描述" }
      ]
    }
  ]
}
重要：choices 是可选字段。如果这一年没有重大抉择，直接省略 choices 或设为 null，玩家点击卡片自动进入下一年。只有遇到真正重要的人生抉择（升学选校、职业道路、婚姻对象、重大危机等）时才放入 choices。`

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `请生成 ${req.currentAge} 岁这一年的事件，确保与角色的属性值、天赋、背景和之前的选择构成合理的因果链。` },
  ]
}

export function buildReviewPrompt(req: ReviewRequest): ChatMessage[] {
  const world = getWorldConfig(req.worldLine)
  // 使用自定义世界描述（如果有的话）
  const worldStyle = req.customWorldDescription || world.style
  const worldDescription = req.customWorldDescription
    ? `\n世界设定：自定义世界\n【用户自定义世界描述】：${req.customWorldDescription}\n叙事风格：根据用户描述自行发挥，保持世界观一致。`
    : `\n世界设定：${world.name}\n叙事风格：${world.style}`

  const systemPrompt = `你是一个人生评价系统。请为角色的完整人生做出总结评价。

${worldDescription}

角色最终属性：${JSON.stringify(req.attributes)}
天赋：${req.talents.join('、') || '无'}
性别：${req.gender || '未指定'}
种族：${req.race || '未指定'}
享年：${req.lifespan} 岁
结局：${req.ending}

人生大事记：
${req.yearEvents.slice(-10).join('\n')}

请用 JSON 格式输出以下内容：
{
  "rating": "综合评价等级（SSS/SS/S/A+/A/B/C）",
  "tagline": "一句精辟的人生总结",
  "scores": {
    "drama": 戏剧性评分（0-100），
    "achievement": 成就评分（0-100），
    "impact": 影响力评分（0-100）
  },
  "highlights": ["3-5 条关键高光时刻或转折点"]
}`

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `请评价这个角色的人生。` },
  ]
}
