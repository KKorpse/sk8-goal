/**
 * SkateGoal 好友 Mock 数据
 */

const defaultFriends = [
  {
    id: 'friend-001',
    nickname: '阿泽',
    avatar: '/images/icons/default-avatar.png',
    ollieHeight: 2.5,
    practiceDays: 128,
    city: '深圳',
    tagline: '最近在死磕 Frontside 180',
    profile: {
      signature: '下班就去刷街，最近想把 Frontside 180 做得更轻松。',
      stance: 'regular',
      yearsSkating: 3,
      ollie: {
        normal: 2.5,
        switch: 1.5
      },
      badgesUnlockedCount: 4,
      badges: [
        { id: 'daily-60', emoji: '🔥', name: '60 天连续练板', unlocked: true },
        { id: 'ollie-2', emoji: '🪜', name: 'Ollie 过 2 立', unlocked: true },
        { id: 'street-line', emoji: '🛣️', name: '第一条街式线路', unlocked: true },
        { id: 'fs180', emoji: '🌀', name: 'FS 180 落地', unlocked: true },
        { id: 'kickflip', emoji: '🦋', name: 'Kickflip 入门', unlocked: false },
        { id: 'rail-touch', emoji: '🛹', name: '碰到第一根杆', unlocked: false }
      ],
      stats: {
        masteredCount: 9,
        grindingCount: 4,
        trialCount: 6
      },
      monthlyCheckinDays: 12,
      timeline: [
        { emoji: '🌀', trickName: 'Frontside 180', stance: 'normal', status: 'grinding', date: '03.18' },
        { emoji: '🛹', trickName: 'Ollie', stance: 'normal', status: 'mastered', date: '03.11' },
        { emoji: '💫', trickName: 'Pop Shove-it', stance: 'normal', status: 'trial', date: '03.03' }
      ],
      skateLevel: '进阶滑手',
      achievements: ['连续练板 60 天', 'Ollie 稳定过 2 立', '完成第一个街式线路'],
      specialtyTricks: ['Ollie', 'Frontside 180', 'Pop Shove-it']
    }
  },
  {
    id: 'friend-002',
    nickname: 'Momo',
    avatar: '/images/icons/default-avatar.png',
    ollieHeight: 3.5,
    practiceDays: 246,
    city: '广州',
    tagline: '今天也想把 Kickflip 踩稳',
    profile: {
      signature: '偏爱平地翻板，目标是让 Kickflip 和 Heelflip 都更干净。',
      stance: 'goofy',
      yearsSkating: 5,
      ollie: {
        normal: 3.5,
        switch: 2
      },
      badgesUnlockedCount: 5,
      badges: [
        { id: 'daily-200', emoji: '🔥', name: '200 天连续练板', unlocked: true },
        { id: 'kickflip-clean', emoji: '🦋', name: 'Kickflip 干净落地', unlocked: true },
        { id: 'heelflip', emoji: '🌪️', name: 'Heelflip 成招', unlocked: true },
        { id: 'jam-session', emoji: '🎪', name: '参加 Jam Session', unlocked: true },
        { id: 'ollie-3', emoji: '📏', name: 'Ollie 过 3 立', unlocked: true },
        { id: 'treflip', emoji: '✨', name: 'Tre Flip 解锁', unlocked: false }
      ],
      stats: {
        masteredCount: 16,
        grindingCount: 5,
        trialCount: 4
      },
      monthlyCheckinDays: 18,
      timeline: [
        { emoji: '🦋', trickName: 'Kickflip', stance: 'normal', status: 'grinding', date: '03.21' },
        { emoji: '🌪️', trickName: 'Heelflip', stance: 'normal', status: 'mastered', date: '03.15' },
        { emoji: '✨', trickName: 'Varial Kickflip', stance: 'switch', status: 'trial', date: '03.07' }
      ],
      skateLevel: '高阶滑手',
      achievements: ['练板总天数突破 200 天', 'Kickflip 成功率明显提升', '参加过本地 Jam Session'],
      specialtyTricks: ['Kickflip', 'Heelflip', 'Varial Kickflip']
    }
  },
  {
    id: 'friend-003',
    nickname: '大熊',
    avatar: '/images/icons/default-avatar.png',
    ollieHeight: 1.5,
    practiceDays: 89,
    city: '上海',
    tagline: '正在练顺脚转体和基础线',
    profile: {
      signature: '喜欢从基础动作慢慢堆稳定性，先把每个动作踩实。',
      stance: 'regular',
      yearsSkating: 2,
      ollie: {
        normal: 1.5,
        switch: 0.5
      },
      badgesUnlockedCount: 3,
      badges: [
        { id: 'daily-30', emoji: '🔥', name: '30 天连续练板', unlocked: true },
        { id: 'first-line', emoji: '🛣️', name: '第一条基础线路', unlocked: true },
        { id: 'tic-tac', emoji: '🎯', name: 'Tic-Tac 稳定', unlocked: true },
        { id: 'manual-hold', emoji: '⚖️', name: 'Manual 维持 3 秒', unlocked: false },
        { id: 'bs180', emoji: '🔄', name: 'Backside 180 解锁', unlocked: false },
        { id: 'drop-in', emoji: '🏁', name: '第一次 Drop In', unlocked: false }
      ],
      stats: {
        masteredCount: 5,
        grindingCount: 3,
        trialCount: 7
      },
      monthlyCheckinDays: 9,
      timeline: [
        { emoji: '🔄', trickName: 'Backside 180', stance: 'normal', status: 'trial', date: '03.19' },
        { emoji: '⚖️', trickName: 'Manual', stance: 'normal', status: 'grinding', date: '03.12' },
        { emoji: '🎯', trickName: 'Tic-Tac', stance: 'normal', status: 'mastered', date: '03.05' }
      ],
      skateLevel: '入门滑手',
      achievements: ['坚持练板 30 天', '完成第一条基础平地线', '掌握稳定 Tic-Tac 节奏'],
      specialtyTricks: ['Tic-Tac', 'Manual', 'Backside 180']
    }
  }
]

function getFriends() {
  return JSON.parse(JSON.stringify(defaultFriends))
}

module.exports = {
  getFriends
}
