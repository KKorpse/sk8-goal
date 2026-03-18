/**
 * SkateGoal 配置文件
 */

const config = {
  // 应用信息
  appName: 'SkateGoal',
  version: '1.0.0',
  
  // 状态定义
  trickStatus: {
    NONE: 'none',       // 未解锁
    TRIAL: 'trial',     // 体验卡
    GRINDING: 'grinding', // 死磕中
    MASTERED: 'mastered'  // 一脚一个
  },

  // 状态显示配置
  statusConfig: {
    none: {
      icon: '--',
      text: '未解锁',
      emoji: '⬜',
      color: '#334155'
    },
    trial: {
      icon: '🎫',
      text: '体验卡',
      emoji: '🎫',
      color: '#22D3EE'
    },
    grinding: {
      icon: '🔥',
      text: '死磕中',
      emoji: '🔥',
      color: '#F97316'
    },
    mastered: {
      icon: '🦶',
      text: '一脚一个',
      emoji: '🦶',
      color: '#FBBF24'
    }
  },

  // 脚位定义
  stances: ['normal', 'fakie', 'switch', 'nollie'],
  
  stanceConfig: {
    normal: {
      name: 'Normal',
      nameCn: '正脚',
      abbr: 'N'
    },
    fakie: {
      name: 'Fakie',
      nameCn: '倒滑',
      abbr: 'F'
    },
    switch: {
      name: 'Switch',
      nameCn: '反脚',
      abbr: 'S'
    },
    nollie: {
      name: 'Nollie',
      nameCn: '反倒',
      abbr: 'No'
    }
  },

  // 分类定义
  categories: [
    { id: 'all', name: '全部', icon: '🎯' },
    { id: 'basics', name: '必修', icon: '📚' },
    { id: 'flat', name: '平地', icon: '🛹' },
    { id: 'obstacles', name: '道具', icon: '🏗️' },
    { id: 'transition', name: '弧面', icon: '🌊' }
  ],

  // 存储 Key
  storageKeys: {
    USER_INFO: 'userInfo',
    USER_PROGRESS: 'userProgress',
    TIMELINE: 'timeline'
  }
}

module.exports = config
