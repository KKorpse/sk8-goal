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
    tagline: '最近在死磕 Frontside 180'
  },
  {
    id: 'friend-002',
    nickname: 'Momo',
    avatar: '/images/icons/default-avatar.png',
    ollieHeight: 3.5,
    practiceDays: 246,
    city: '广州',
    tagline: '今天也想把 Kickflip 踩稳'
  },
  {
    id: 'friend-003',
    nickname: '大熊',
    avatar: '/images/icons/default-avatar.png',
    ollieHeight: 1.5,
    practiceDays: 89,
    city: '上海',
    tagline: '正在练顺脚转体和基础线'
  }
]

function getFriends() {
  return defaultFriends.map((friend) => ({ ...friend }))
}

module.exports = {
  getFriends
}
