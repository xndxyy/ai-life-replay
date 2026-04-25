// 世界数据 - 反编译自 re.maa-ai.com
// 9 个预设世界 + 自定义世界由后端处理

export interface Attribute {
  key: string
  name: string
  icon: string
  description: string
}

export interface AcquiredAttributeTier {
  min: number
  label: string
}

export interface AcquiredAttribute {
  key: string
  name: string
  icon: string
  description: string
  initialValue: number
  tiers: AcquiredAttributeTier[]
}

export interface World {
  id: string
  name: string
  description: string
  theme: string
  themeColor: string
  icon: string
  tagline: string
  era: string
  maxAge: number
  eventStyle: string
  specialEndings: string[]
  attributes: Attribute[]
  acquiredAttributes: AcquiredAttribute[]
  locked: boolean
  unlockMethod: string
  aiGenerated: boolean
}

export const worlds: World[] = [
  {
    id: "modern",
    name: "现代都市",
    description: "二十一世纪的平凡人间。升学、就业、恋爱、房贷——这垃圾人生，一秒也不想呆了。",
    theme: "modern",
    themeColor: "#4a6fa5",
    icon: "🏙️",
    tagline: "这垃圾人生，一秒也不想呆了",
    era: "当代中国",
    maxAge: 90,
    eventStyle: "现实主义基调，关注升学、就业、恋爱、家庭、事业成就、退休等现实话题。可涉及社会热点（房价、创业、AI 浪潮等），幽默感偏社会讽刺和自嘲。⚠️ 体质 3+ 的角色在 55 岁前不应因 health 死亡（违反=叙事失败）；中年期（35-55）聚焦事业和家庭发展，禁止反复安排癌症/重病/ICU 剧情；疾病叙事一生最多 1 条主线，不要让健康问题成为故事主旋律。角色事业或社会影响达到较高水平时，应自然考虑触发超越结局。",
    specialEndings: ["学术巅峰", "商业帝国", "星际移民", "意识永生", "功成身退", "著书传世"],
    attributes: [
      { key: "looks", name: "颜值", icon: "✨", description: "外貌魅力，影响社交和恋爱" },
      { key: "intelligence", name: "智力", icon: "🧠", description: "学习能力和认知水平" },
      { key: "constitution", name: "体质", icon: "💪", description: "身体素质，影响健康和寿命" },
      { key: "wealth", name: "家境", icon: "💰", description: "家庭经济条件和社会资源" },
    ],
    acquiredAttributes: [
      {
        key: "money", name: "金钱", icon: "💰", description: "个人净资产，从零开始打拼",
        initialValue: 0,
        tiers: [
          { min: 0, label: "身无分文" }, { min: 1, label: "月光族" },
          { min: 4, label: "小康" }, { min: 7, label: "中产" },
          { min: 10, label: "富裕" }, { min: 14, label: "大富翁" },
          { min: 18, label: "财富自由" },
        ],
      },
      {
        key: "career", name: "事业", icon: "📈", description: "职业成就，晋升、创业、行业影响力",
        initialValue: 0,
        tiers: [
          { min: 0, label: "无业" }, { min: 1, label: "打工人" },
          { min: 4, label: "骨干" }, { min: 7, label: "主管" },
          { min: 10, label: "高管" }, { min: 14, label: "行业大佬" },
          { min: 18, label: "巅峰人物" },
        ],
      },
      {
        key: "social", name: "人脉", icon: "👥", description: "社会关系网络的广度和质量",
        initialValue: 0,
        tiers: [
          { min: 0, label: "独来独往" }, { min: 1, label: "熟人几个" },
          { min: 4, label: "朋友不少" }, { min: 7, label: "人脉广泛" },
          { min: 10, label: "八面玲珑" }, { min: 14, label: "呼风唤雨" },
          { min: 18, label: "通天关系" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
  {
    id: "xianxia",
    name: "九州仙域",
    description: "东方修仙世界：灵气充盈的天地。从凡人到飞升，历经炼气、筑基、金丹、元婴，渡过天劫就能羽化登仙。",
    theme: "xianxia",
    themeColor: "#b8862e",
    icon: "⚔️",
    tagline: "炼气筑基，渡劫飞升成仙",
    era: "太古仙界",
    maxAge: 130,
    eventStyle: "仙侠小说风格，涉及修炼境界提升、宗门争斗、秘境探险、丹药炼器、心魔渡劫。用\"你\"的视角叙述。术语如灵气、金丹、元婴等需自然融入。",
    specialEndings: ["飞升仙界", "羽化登仙", "大能转世", "开宗立派", "化身天道"],
    attributes: [
      { key: "root", name: "根骨", icon: "🦴", description: "灵根资质，修炼速度的根基" },
      { key: "comprehension", name: "悟性", icon: "👁️", description: "领悟道法和突破境界的能力" },
      { key: "luck", name: "气运", icon: "🍀", description: "机缘和奇遇的运气" },
      { key: "sect", name: "宗门底蕴", icon: "🏛️", description: "所在修行门派的实力和资源" },
    ],
    acquiredAttributes: [
      {
        key: "cultivation", name: "修为", icon: "⚡", description: "修炼境界，从炼气到渡劫",
        initialValue: 0,
        tiers: [
          { min: 0, label: "凡人" }, { min: 1, label: "炼气期" },
          { min: 4, label: "筑基期" }, { min: 7, label: "金丹期" },
          { min: 10, label: "元婴期" }, { min: 14, label: "化神期" },
          { min: 18, label: "大乘期" },
        ],
      },
      {
        key: "spiritStones", name: "灵石", icon: "💎", description: "修仙界的货币与修炼资源",
        initialValue: 0,
        tiers: [
          { min: 0, label: "囊中羞涩" }, { min: 1, label: "勉强糊口" },
          { min: 4, label: "小有余资" }, { min: 7, label: "财力不错" },
          { min: 10, label: "一方富豪" }, { min: 14, label: "宗门宝库" },
          { min: 18, label: "富可敌宗" },
        ],
      },
      {
        key: "karma", name: "因果", icon: "☯️", description: "业力与机缘，影响天劫难度",
        initialValue: 0,
        tiers: [
          { min: 0, label: "因果清净" }, { min: 1, label: "微有牵扯" },
          { min: 4, label: "因果缠身" }, { min: 7, label: "业力深重" },
          { min: 10, label: "天道宠爱" }, { min: 14, label: "气运之子" },
          { min: 18, label: "天道化身" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
  {
    id: "isekai",
    name: "墨海浮生",
    description: "穿书异世：一觉醒来，你变成了一本你读过的小说里的炮灰角色。剧情走向、死亡 flag 你都知道——这一次，改写命运。",
    theme: "isekai",
    themeColor: "#6b5b8a",
    icon: "📖",
    tagline: "炮灰觉醒，逆天改命",
    era: "架空异世界",
    maxAge: 80,
    eventStyle: "穿书/重生风格，带有自我意识和剧情认知。角色清楚原著走向，需要在已知剧情和蝴蝶效应之间权衡。用\"你\"的视角。可包含搞笑吐槽、系统元素、剧情偏离等。",
    specialEndings: ["回到现实", "成为新主角", "黑化 boss", "平行世界定居", "与原著和解"],
    attributes: [
      { key: "prophecy", name: "先知", icon: "🔮", description: "对原剧情的知晓程度" },
      { key: "charm", name: "魅力", icon: "✨", description: "角色的吸引力" },
      { key: "survival", name: "求生", icon: "🛡️", description: "在危机中存活的能力" },
      { key: "influence", name: "影响力", icon: "🌟", description: "改变剧情走向的能力" },
    ],
    acquiredAttributes: [
      {
        key: "wealth", name: "资产", icon: "💰", description: "在异世界积攒的财富",
        initialValue: 0,
        tiers: [
          { min: 0, label: "身无分文" }, { min: 1, label: "铜板几枚" },
          { min: 4, label: "小有余财" }, { min: 7, label: "富甲一方" },
          { min: 10, label: "富可敌国" }, { min: 14, label: "世界首富" },
          { min: 18, label: "恒产永恒" },
        ],
      },
      {
        key: "allies", name: "势力", icon: "⚔️", description: "你的支持网络和阵营力量",
        initialValue: 0,
        tiers: [
          { min: 0, label: "孤身一人" }, { min: 1, label: "几个朋友" },
          { min: 4, label: "小有名望" }, { min: 7, label: "势力不小" },
          { min: 10, label: "割据一方" }, { min: 14, label: "朝堂重臣" },
          { min: 18, label: "天下共主" },
        ],
      },
      {
        key: "rewrite", name: "改写度", icon: "📝", description: "对原剧情的改变程度",
        initialValue: 0,
        tiers: [
          { min: 0, label: "循规蹈矩" }, { min: 1, label: "调整细节" },
          { min: 4, label: "支线偏移" }, { min: 7, label: "剧情分支" },
          { min: 10, label: "主线重构" }, { min: 14, label: "世界重塑" },
          { min: 18, label: "原著作者都懵" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
  {
    id: "palace",
    name: "朱门深宫",
    description: "古代宫斗世界：红墙黄瓦，钟鼓沉沉。选秀入宫、步步为营——这一局棋，你是棋子还是执棋人？",
    theme: "palace",
    themeColor: "#b24a6f",
    icon: "👑",
    tagline: "红墙深处，谁主沉浮",
    era: "架空古代王朝",
    maxAge: 70,
    eventStyle: "古典宫斗风格，涉及选秀册封、后宫争宠、朝堂权谋、家族兴衰。用\"你\"的视角，注重心理描写和计谋博弈。",
    specialEndings: ["垂帘听政", "远嫁和亲", "一代贤后", "凤临天下"],
    attributes: [
      { key: "beauty", name: "容貌", icon: "🌸", description: "外在姿色与仪态" },
      { key: "scheme", name: "心机", icon: "🧩", description: "计谋与城府" },
      { key: "favor", name: "圣眷", icon: "💎", description: "皇帝恩宠与信任" },
      { key: "family", name: "家世", icon: "🏯", description: "母族势力和背景" },
    ],
    acquiredAttributes: [
      {
        key: "rank", name: "位份", icon: "👑", description: "后宫品级与地位",
        initialValue: 0,
        tiers: [
          { min: 0, label: "庶人" }, { min: 1, label: "答应" },
          { min: 4, label: "贵人" }, { min: 7, label: "嫔位" },
          { min: 10, label: "妃位" }, { min: 14, label: "贵妃" },
          { min: 18, label: "皇后" },
        ],
      },
      {
        key: "treasure", name: "私房", icon: "💰", description: "私人财富与积蓄",
        initialValue: 0,
        tiers: [
          { min: 0, label: "一贫如洗" }, { min: 1, label: "打赏度日" },
          { min: 4, label: "小有积蓄" }, { min: 7, label: "殷实富足" },
          { min: 10, label: "财大气粗" }, { min: 14, label: "富甲后宫" },
          { min: 18, label: "国库都是我家的" },
        ],
      },
      {
        key: "clique", name: "党羽", icon: "👥", description: "心腹与联盟力量",
        initialValue: 0,
        tiers: [
          { min: 0, label: "独来独往" }, { min: 1, label: "一两个心腹" },
          { min: 4, label: "小有势力" }, { min: 7, label: "羽翼渐丰" },
          { min: 10, label: "权倾后宫" }, { min: 14, label: "朝堂党争" },
          { min: 18, label: "掌控六宫" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
  {
    id: "magic",
    name: "奥术大陆",
    description: "一个充满奥术与神秘的世界。魔法学院、元素之力、远古遗迹——你是一个巫师。",
    theme: "magic",
    themeColor: "#7c5cbf",
    icon: "🧙",
    tagline: "奥术至上，力量为王",
    era: "魔法纪元",
    maxAge: 110,
    eventStyle: "西方奇幻魔法风格，涉及魔法学习、法术对战、学院生活、秘境探索、种族纷争。用\"你\"的视角，充满魔法描述和奇幻色彩。",
    specialEndings: ["龙骑士", "元素归一", "大贤者", "位面行者"],
    attributes: [
      { key: "magic", name: "魔力", icon: "✨", description: "魔法力量的天赋" },
      { key: "wisdom", name: "智慧", icon: "🧠", description: "理解与学习魔法的能力" },
      { key: "physique", name: "体魄", icon: "💪", description: "身体素质与魔法承载" },
      { key: "bloodline", name: "血统", icon: "🔮", description: "魔法血统的纯正度" },
    ],
    acquiredAttributes: [
      {
        key: "spellRank", name: "法术", icon: "⚡", description: "掌握的魔法等级",
        initialValue: 0,
        tiers: [
          { min: 0, label: "魔法学徒" }, { min: 1, label: "初级法师" },
          { min: 4, label: "中级法师" }, { min: 7, label: "高级法师" },
          { min: 10, label: "大法师" }, { min: 14, label: "魔导师" },
          { min: 18, label: "法神" },
        ],
      },
      {
        key: "gold", name: "金币", icon: "💰", description: "通用财富",
        initialValue: 0,
        tiers: [
          { min: 0, label: "穷困潦倒" }, { min: 1, label: "勉强度日" },
          { min: 4, label: "衣食无忧" }, { min: 7, label: "财力雄厚" },
          { min: 10, label: "富甲一方" }, { min: 14, label: "大陆首富" },
          { min: 18, label: "法师塔堆满金" },
        ],
      },
      {
        key: "prestige", name: "声望", icon: "🌟", description: "在魔法界的名声",
        initialValue: 0,
        tiers: [
          { min: 0, label: "默默无闻" }, { min: 1, label: "初露头角" },
          { min: 4, label: "小有名气" }, { min: 7, label: "名声在外" },
          { min: 10, label: "远近闻名" }, { min: 14, label: "大陆传说" },
          { min: 18, label: "传奇偶像" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
  {
    id: "medieval",
    name: "铁与火的纪元",
    description: "硝烟弥漫的中世纪、剑与盾、铁与血——征服还是毁灭，这是一个问题。",
    theme: "medieval",
    themeColor: "#c0392b",
    icon: "⚔️",
    tagline: "硝烟弥漫，剑指四方",
    era: "中世纪",
    maxAge: 60,
    eventStyle: "中世纪战争史诗风格，关注军事征战、政治联姻、城堡围攻、骑士精神、瘟疫/饥荒、信仰冲突。用\"你\"的视角，叙事直接有力。",
    specialEndings: ["十字军英雄", "传奇王者", "隐世农夫", "圣殿守护", "海外建国"],
    attributes: [
      { key: "combat", name: "武力", icon: "⚔️", description: "个人战斗能力" },
      { key: "strategy", name: "智谋", icon: "🧠", description: "战略智慧和用人能力" },
      { key: "charisma", name: "魅力", icon: "👑", description: "统帅力与个人威望" },
      { key: "domain", name: "领地", icon: "🏰", description: "统治的领土和资源" },
    ],
    acquiredAttributes: [
      {
        key: "military", name: "兵力", icon: "🪖", description: "麾下的军队规模",
        initialValue: 0,
        tiers: [
          { min: 0, label: "光杆司令" }, { min: 1, label: "散兵游勇" },
          { min: 4, label: "百人队" }, { min: 7, label: "千人军" },
          { min: 10, label: "万人军团" }, { min: 14, label: "诸侯联军" },
          { min: 18, label: "百万雄师" },
        ],
      },
      {
        key: "gold", name: "金币", icon: "💰", description: "军事和领地的财富",
        initialValue: 0,
        tiers: [
          { min: 0, label: "一贫如洗" }, { min: 1, label: "勉强糊口" },
          { min: 4, label: "小有余粮" }, { min: 7, label: "粮草充足" },
          { min: 10, label: "财库充盈" }, { min: 14, label: "富可敌国" },
          { min: 18, label: "金龙如山" },
        ],
      },
      {
        key: "authority", name: "权力", icon: "👑", description: "政治权力和控制范围",
        initialValue: 0,
        tiers: [
          { min: 0, label: "平民百姓" }, { min: 1, label: "小地主" },
          { min: 4, label: "男爵" }, { min: 7, label: "子爵/伯爵" },
          { min: 10, label: "侯爵/公爵" }, { min: 14, label: "国王" },
          { min: 18, label: "皇帝" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
  {
    id: "cyberpunk",
    name: "夜之城 2099",
    description: "霓虹闪烁，义体改造，企业统治一切。在钢铁丛林的夜之城，打出一片天。",
    theme: "cyberpunk",
    themeColor: "#00bcd4",
    icon: "🔮",
    tagline: "霓虹之下，皆为企业奴",
    era: "2099 年",
    maxAge: 100,
    eventStyle: "赛博朋克黑色电影风格，关注义体改造、网络入侵、企业阴谋、街头火拼、身份认同。用\"你\"的视角，带有科技感和荒诞感。",
    specialEndings: ["上传意识", "系统崩溃", "街头传奇", "机械飞升"],
    attributes: [
      { key: "hacker", name: "黑客", icon: "💻", description: "网络入侵和电子战能力" },
      { key: "cyber", name: "义体化", icon: "⚙️", description: "机械义体改造程度" },
      { key: "street", name: "街头信誉", icon: "🔥", description: "在地下社会的威望" },
      { key: "corp", name: "企业关系", icon: "🏢", description: "在大公司的内线和关系" },
    ],
    acquiredAttributes: [
      {
        key: "credits", name: "信用", icon: "💳", description: "电子货币与信用额度",
        initialValue: 0,
        tiers: [
          { min: 0, label: "红灯区乞丐" }, { min: 1, label: "打零工" },
          { min: 4, label: "黄牛党" }, { min: 7, label: "中间人" },
          { min: 10, label: "企业家" }, { min: 14, label: "企业高管" },
          { min: 18, label: "夜之城首富" },
        ],
      },
      {
        key: "data", name: "数据", icon: "💾", description: "拥有的大数据和情报",
        initialValue: 0,
        tiers: [
          { min: 0, label: "信息难民" }, { min: 1, label: "二手情报" },
          { min: 4, label: "资料库基础" }, { min: 7, label: "情报贩子" },
          { min: 10, label: "数据库级" }, { min: 14, label: "企业机密" },
          { min: 18, label: "全知之眼" },
        ],
      },
      {
        key: "cyberLevel", name: "改造度", icon: "🔩", description: "义体改造的先进程度",
        initialValue: 0,
        tiers: [
          { min: 0, label: "纯天然" }, { min: 1, label: "小改怡情" },
          { min: 4, label: "半机械" }, { min: 7, label: "重装上阵" },
          { min: 10, label: "赛博格" }, { min: 14, label: "金刚狼同款" },
          { min: 18, label: "人机合一" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
  {
    id: "space",
    name: "银河纪元",
    description: "宇航时代，人类已遍布银河。星际航行、文明冲突、古老遗迹——在浩瀚宇宙中书写你的传说。",
    theme: "space",
    themeColor: "#2c3e50",
    icon: "🚀",
    tagline: "星辰大海，皆为征途",
    era: "星际纪元",
    maxAge: 110,
    eventStyle: "太空歌剧科幻风格，关注星际航行、外星文明接触、太空战斗、殖民开拓、科技奇点。用\"你\"的视角，宏大叙事。",
    specialEndings: ["星际流浪者", "虫洞殉难", "太空隐士"],
    attributes: [
      { key: "pilot", name: "驾驶", icon: "🚀", description: "飞船驾驶与操控能力" },
      { key: "tech", name: "科技", icon: "🔬", description: "科学技术水平" },
      { key: "diplomacy", name: "外交", icon: "🤝", description: "星际交际能力" },
      { key: "fleet", name: "舰队", icon: "🛸", description: "掌握的力量和舰队规模" },
    ],
    acquiredAttributes: [
      {
        key: "starCoin", name: "星币", icon: "💰", description: "银河通用货币",
        initialValue: 0,
        tiers: [
          { min: 0, label: "破产" }, { min: 1, label: "打零工" },
          { min: 4, label: "船长的积蓄" }, { min: 7, label: "星港富豪" },
          { min: 10, label: "小行星级别的富有" }, { min: 14, label: "星系富商" },
          { min: 18, label: "经济命脉掌控者" },
        ],
      },
      {
        key: "reputation", name: "声望", icon: "🌟", description: "银河中的名声",
        initialValue: 0,
        tiers: [
          { min: 0, label: "无名小卒" }, { min: 1, label: "初出茅庐" },
          { min: 4, label: "小有名气" }, { min: 7, label: "星域名人" },
          { min: 10, label: "星系英雄" }, { min: 14, label: "银河传说" },
          { min: 18, label: "活着的传奇" },
        ],
      },
      {
        key: "discoveries", name: "发现", icon: "🔭", description: "探索与科研发现",
        initialValue: 0,
        tiers: [
          { min: 0, label: "已知区域" }, { min: 1, label: "小行星发现" },
          { min: 4, label: "宜居星球" }, { min: 7, label: "远古遗迹" },
          { min: 10, label: "新文明" }, { min: 14, label: "物理法则突破" },
          { min: 18, label: "宇宙真理" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
  {
    id: "wasteland",
    name: "废土末世",
    description: "核战后的荒芜世界，变异生物横行，幸存者在废墟中挣扎求生。你能否成为新世界的火种？",
    theme: "wasteland",
    themeColor: "#8b4513",
    icon: "☢️",
    tagline: "废墟之上，重建文明",
    era: "核战后",
    maxAge: 50,
    eventStyle: "废土末世生存风格，关注资源争夺、变异生物、幸存者营地、道德抉择、文明重建。用\"你\"的视角，残酷但有力，偶尔有黑暗幽默。",
    specialEndings: ["变异觉醒", "新文明奠基", "绿洲守护者", "星际逃离", "废土传奇"],
    attributes: [
      { key: "survival", name: "生存", icon: "🎒", description: "在废土中生存的能力" },
      { key: "combat", name: "战斗", icon: "⚔️", description: "战斗与武器使用能力" },
      { key: "leadership", name: "领导力", icon: "👥", description: "领导幸存者的能力" },
      { key: "supplies", name: "物资", icon: "📦", description: "拥有的生存资源" },
    ],
    acquiredAttributes: [
      {
        key: "settlement", name: "据点", icon: "🏠", description: "营地和据点的规模",
        initialValue: 0,
        tiers: [
          { min: 0, label: "流浪" }, { min: 1, label: "小避难所" },
          { min: 4, label: "营地" }, { min: 7, label: "要塞" },
          { min: 10, label: "城镇" }, { min: 14, label: "城市" },
          { min: 18, label: "新文明国度" },
        ],
      },
      {
        key: "followers", name: "追随者", icon: "👥", description: "跟随你的人数和质量",
        initialValue: 0,
        tiers: [
          { min: 0, label: "独狼" }, { min: 1, label: "几个同伴" },
          { min: 4, label: "小队" }, { min: 7, label: "百人团队" },
          { min: 10, label: "千人集团" }, { min: 14, label: "万人组织" },
          { min: 18, label: "新文明种族" },
        ],
      },
      {
        key: "techLevel", name: "科技", icon: "🔧", description: "掌握的废土科技水平",
        initialValue: 0,
        tiers: [
          { min: 0, label: "石器时代" }, { min: 1, label: "原始工具" },
          { min: 4, label: "工坊水平" }, { min: 7, label: "蒸汽机械" },
          { min: 10, label: "电力复兴" }, { min: 14, label: "旧世纪科技" },
          { min: 18, label: "黄金时代" },
        ],
      },
    ],
    locked: false, unlockMethod: "free", aiGenerated: false,
  },
]
