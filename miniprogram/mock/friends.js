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
      skateLevel: '入门滑手',
      achievements: ['坚持练板 30 天', '完成第一条基础平地线', '掌握稳定 Tic-Tac 节奏'],
      specialtyTricks: ['Tic-Tac', 'Manual', 'Backside 180']
    }
  }
]

function getFriends() {
  return defaultFriends.map((friend) => ({ ...friend }))
}

module.exports = {
  getFriends
}
