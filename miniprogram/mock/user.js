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
    normal: 'trial',
    fakie: 'none',
    switch: 'none',
    nollie: 'none'
  }
}

// 示例时光轴数据（默认为空，用户手动解锁招式时添加）
const sampleTimeline = []

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
