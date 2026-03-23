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
    TIMELINE: 'timeline',
    CHECKIN_RECORDS: 'checkinRecords' // 打卡记录
  },

  // 打卡配置
  checkin: {
    displayDays: 30, // 显示最近30天
    maxDays: 365, // 最多保存365天
    levels: {
      0: { color: '#2d3748', name: '未打卡', minCount: 0 },
      1: { color: '#276749', name: '已打卡', minCount: 1 },
      2: { color: '#38a169', name: '多次打卡', minCount: 2 }
    }
  },

  // 成就定义
  achievements: {
    // 招式类成就
    first_trick: {
      id: 'first_trick',
      title: '初次见面',
      description: '解锁第一个招式',
      icon: '🌱'
    },
    ollie_master: {
      id: 'ollie_master',
      title: '豚跳大师',
      description: '完全掌握 Ollie',
      icon: '🦘'
    },
    kickflip_boss: {
      id: 'kickflip_boss',
      title: '跟翻王者',
      description: '掌握所有跟翻招式',
      icon: '💫'
    },
    // 打卡类成就
    first_checkin: {
      id: 'first_checkin',
      title: '初次打卡',
      description: '完成第一次打卡',
      icon: '📅'
    },
    week_streak: {
      id: 'week_streak',
      title: '一周坚持',
      description: '连续打卡7天',
      icon: '🔥'
    },
    month_streak: {
      id: 'month_streak',
      title: '月度达人',
      description: '连续打卡30天',
      icon: '⭐'
    },
    // 招式完成度成就
    stance_complete: {
      id: 'stance_complete',
      title: '一脚四式',
      description: '完成一个招式的全部四种脚位',
      icon: '🎯'
    },
    all_basics: {
      id: 'all_basics',
      title: '基础毕业',
      description: '完成所有基础招式',
      icon: '🎓'
    }
  }
}

module.exports = config
