/**
 * SkateGoal 用户 Mock 数据
 */

// 默认用户信息
const defaultUserInfo = {
  id: '10001',
  nickname: '滑板新手',
  avatar: '',
  stance: 'regular', // regular | goofy
  yearsSkating: 1,
  city: '深圳',
  title: '板场萌新' // 当前头衔
}

// 示例用户进度数据
const sampleUserProgress = {
  'pushing': {
    normal: 'mastered',
    fakie: 'mastered',
    switch: 'grinding',
    nollie: 'trial'
  },
  'ollie': {
    normal: 'mastered',
    fakie: 'trial',
    switch: 'grinding',
    nollie: 'none'
  },
  'kickflip': {
    normal: 'trial',
    fakie: 'none',
    switch: 'none',
    nollie: 'none'
  },
  'manual': {
    normal: 'mastered',
    fakie: 'grinding',
    switch: 'none',
    nollie: 'none'
  },
  'bs-180': {
    normal: 'trial',
    fakie: 'none',
    switch: 'none',
    nollie: 'none'
  },
  'pop-shuvit': {
    normal: 'grinding',
    fakie: 'none',
    switch: 'none',
    nollie: 'none'
  }
}

// 示例时光轴数据
const sampleTimeline = [
  {
    id: 't1',
    trickId: 'kickflip',
    trickName: 'Kickflip',
    stance: 'normal',
    status: 'trial',
    date: '2026.03.15',
    timestamp: 1773763200000
  },
  {
    id: 't2',
    trickId: 'ollie',
    trickName: 'Ollie',
    stance: 'fakie',
    status: 'trial',
    date: '2026.03.10',
    timestamp: 1773331200000
  },
  {
    id: 't3',
    trickId: 'ollie',
    trickName: 'Ollie',
    stance: 'normal',
    status: 'mastered',
    date: '2026.02.20',
    timestamp: 1771804800000
  },
  {
    id: 't4',
    trickId: 'manual',
    trickName: 'Manual',
    stance: 'normal',
    status: 'mastered',
    date: '2026.02.01',
    timestamp: 1770163200000
  },
  {
    id: 't5',
    trickId: 'pushing',
    trickName: 'Pushing',
    stance: 'normal',
    status: 'mastered',
    date: '2026.01.15',
    timestamp: 1768694400000
  },
  {
    id: 't6',
    trickId: 'pushing',
    trickName: 'Pushing',
    stance: 'fakie',
    status: 'mastered',
    date: '2026.01.20',
    timestamp: 1769126400000
  }
]

// 头衔配置
const titles = [
  {
    id: 'newbie',
    name: '板场萌新',
    emoji: '🐣',
    requirement: '注册账号',
    minTricks: 0
  },
  {
    id: 'beginner',
    name: '初出茅庐',
    emoji: '🌱',
    requirement: '点亮 3 个招式',
    minTricks: 3
  },
  {
    id: 'apprentice',
    name: '小有所成',
    emoji: '⭐',
    requirement: '点亮 10 个招式',
    minTricks: 10
  },
  {
    id: 'skilled',
    name: '身手不凡',
    emoji: '🔥',
    requirement: '点亮 20 个招式',
    minTricks: 20
  },
  {
    id: 'expert',
    name: '翻板大王',
    emoji: '👑',
    requirement: '掌握所有翻板招式',
    minTricks: 30
  },
  {
    id: 'master',
    name: '街头传说',
    emoji: '🏆',
    requirement: '点亮 50 个招式',
    minTricks: 50
  },
  {
    id: 'legend',
    name: '滑板之神',
    emoji: '🌟',
    requirement: '点亮所有招式',
    minTricks: 100
  }
]

module.exports = {
  defaultUserInfo,
  sampleUserProgress,
  sampleTimeline,
  titles,
  
  /**
   * 根据已掌握招式数量获取头衔
   * @param {number} masteredCount - 已掌握数量
   * @returns {Object}
   */
  getTitleByProgress(masteredCount) {
    let currentTitle = titles[0]
    for (const title of titles) {
      if (masteredCount >= title.minTricks) {
        currentTitle = title
      }
    }
    return currentTitle
  },
  
  /**
   * 获取所有头衔
   * @returns {Array}
   */
  getAllTitles() {
    return titles
  }
}
