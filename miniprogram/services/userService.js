/**
 * SkateGoal 用户服务
 * 处理用户信息、时光轴等
 */

const mockUser = require('../mock/user')
const storageService = require('./storageService')
const trickService = require('./trickService')

/**
 * 获取用户信息
 * @returns {Object}
 */
function getUserInfo() {
  let userInfo = storageService.getUserInfo()
  
  // 如果没有用户信息，使用默认值
  if (!userInfo) {
    userInfo = { ...mockUser.defaultUserInfo }
    storageService.setUserInfo(userInfo)
  }
  
  // 更新头衔
  const stats = trickService.getStats()
  const title = mockUser.getTitleByProgress(stats.litCount)
  userInfo.title = title.name
  userInfo.titleEmoji = title.emoji
  
  return userInfo
}

/**
 * 更新用户信息
 * @param {Object} updates - 要更新的字段
 * @returns {Object}
 */
function updateUserInfo(updates) {
  const userInfo = getUserInfo()
  const newUserInfo = { ...userInfo, ...updates }
  storageService.setUserInfo(newUserInfo)
  return newUserInfo
}

/**
 * 获取用户时光轴
 * @param {number} limit - 限制数量
 * @returns {Array}
 */
function getTimeline(limit = 50) {
  let timeline = storageService.getTimeline()
  
  // 如果没有时光轴数据，使用示例数据
  if (!timeline || timeline.length === 0) {
    timeline = [...mockUser.sampleTimeline]
    storageService.setTimeline(timeline)
  }
  
  // 按时间倒序排列
  timeline.sort((a, b) => b.timestamp - a.timestamp)
  
  return limit ? timeline.slice(0, limit) : timeline
}

/**
 * 获取用户统计概览
 * @returns {Object}
 */
function getUserStats() {
  const stats = trickService.getStats()
  const userInfo = getUserInfo()
  
  return {
    ...stats,
    nickname: userInfo.nickname,
    title: userInfo.title,
    titleEmoji: userInfo.titleEmoji,
    stance: userInfo.stance,
    yearsSkating: userInfo.yearsSkating
  }
}

/**
 * 初始化示例数据（首次使用）
 */
function initSampleData() {
  const progress = storageService.getUserProgress()
  
  // 如果已有进度数据，不初始化
  if (Object.keys(progress).length > 0) {
    return false
  }
  
  // 设置示例进度
  storageService.setUserProgress(mockUser.sampleUserProgress)
  
  // 设置示例时光轴
  storageService.setTimeline(mockUser.sampleTimeline)
  
  return true
}

/**
 * 获取所有头衔
 * @returns {Array}
 */
function getAllTitles() {
  const stats = trickService.getStats()
  const titles = mockUser.getAllTitles()
  
  return titles.map(title => ({
    ...title,
    unlocked: stats.litCount >= title.minTricks,
    current: stats.litCount >= title.minTricks && 
             (titles.findIndex(t => t.id === title.id) === titles.length - 1 ||
              stats.litCount < titles[titles.findIndex(t => t.id === title.id) + 1].minTricks)
  }))
}

/**
 * 重置所有数据
 * @returns {boolean}
 */
function resetAllData() {
  storageService.setUserProgress({})
  storageService.setTimeline([])
  return true
}

module.exports = {
  getUserInfo,
  updateUserInfo,
  getTimeline,
  getUserStats,
  initSampleData,
  getAllTitles,
  resetAllData
}
