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
  let timeline = storageService.getTimeline() || []
  
  // 不再自动填充示例数据，保持为空，需要用户手动添加成就
  
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
  
  // 同步 progress 到 timeline（trial 和 mastered 才算成招）
  syncProgressToTimeline()
  
  return true
}

/**
 * 同步 progress 数据到 timeline
 * 确保 progress 中非 none 的状态都有对应的 timeline 记录
 */
function syncProgressToTimeline() {
  const progress = storageService.getUserProgress()
  const timeline = storageService.getTimeline()
  const allTricks = require('../mock/tricks').getAllTricks()
  const util = require('../utils/util')
  
  // 构建 timeline 中已有的记录 key
  const existingKeys = new Set()
  timeline.forEach(r => {
    existingKeys.add(`${r.trickId}-${r.stance}`)
  })
  
  // 构建招式 ID 到名称的映射
  const trickMap = {}
  allTricks.forEach(t => {
    trickMap[t.id] = t
  })
  
  // 检查 progress 中非 none 的状态是否在 timeline 中
  let hasNewRecords = false
  Object.entries(progress).forEach(([trickId, stances]) => {
    Object.entries(stances).forEach(([stance, status]) => {
      const key = `${trickId}-${stance}`
      // 非 none 的状态都要记录到 timeline
      if (status !== 'none' && !existingKeys.has(key)) {
        const trick = trickMap[trickId]
        if (trick) {
          timeline.unshift({
            id: util.generateId(),
            trickId: trickId,
            trickName: trick.name,
            stance: stance,
            status: status,
            date: util.formatDate(new Date()),
            timestamp: Date.now()
          })
          hasNewRecords = true
        }
      }
    })
  })
  
  // 保存更新后的 timeline
  if (hasNewRecords) {
    timeline.sort((a, b) => b.timestamp - a.timestamp)
    storageService.setTimeline(timeline)
  }
  
  return hasNewRecords
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
  syncProgressToTimeline,
  getAllTitles,
  resetAllData
}
