/**
 * SkateGoal 招式服务
 * 处理招式数据的获取、搜索、状态更新等
 */

const mockTricks = require('../mock/tricks')
const storageService = require('./storageService')
const config = require('../config')
const util = require('../utils/util')

/**
 * 获取所有招式（带用户进度）
 * @returns {Array}
 */
function getAllTricks() {
  const tricks = mockTricks.getAllTricks()
  const progress = storageService.getUserProgress()
  
  return tricks.map(trick => ({
    ...trick,
    stances: progress[trick.id] || {
      normal: 'none',
      fakie: 'none',
      switch: 'none',
      nollie: 'none'
    }
  }))
}

/**
 * 按分类获取招式（带用户进度）
 * @param {string} category - 分类 ID
 * @returns {Array}
 */
function getTricksByCategory(category) {
  const tricks = mockTricks.getTricksByCategory(category)
  const progress = storageService.getUserProgress()
  
  return tricks.map(trick => ({
    ...trick,
    stances: progress[trick.id] || {
      normal: 'none',
      fakie: 'none',
      switch: 'none',
      nollie: 'none'
    }
  }))
}

/**
 * 按分组整理招式
 * @param {Array} tricks - 招式列表
 * @returns {Array} - [{ group: string, tricks: Array }]
 */
function groupTricks(tricks) {
  return mockTricks.groupTricks(tricks)
}

/**
 * 搜索招式
 * @param {string} query - 搜索词
 * @returns {Array}
 */
function searchTricks(query) {
  if (!query || !query.trim()) {
    return getAllTricks()
  }
  
  const tricks = mockTricks.searchTricks(query)
  const progress = storageService.getUserProgress()
  
  return tricks.map(trick => ({
    ...trick,
    stances: progress[trick.id] || {
      normal: 'none',
      fakie: 'none',
      switch: 'none',
      nollie: 'none'
    }
  }))
}

/**
 * 模糊搜索招式
 * @param {string} query - 搜索词
 * @returns {Array}
 */
function fuzzySearchTricks(query) {
  if (!query || !query.trim()) {
    return getAllTricks()
  }
  
  const allTricks = getAllTricks()
  return allTricks.filter(trick => 
    util.fuzzyMatch(query, trick.name) ||
    util.fuzzyMatch(query, trick.nameCn) ||
    util.fuzzyMatch(query, trick.id)
  )
}

/**
 * 获取单个招式详情
 * @param {string} trickId - 招式 ID
 * @returns {Object|null}
 */
function getTrickById(trickId) {
  const trick = mockTricks.getTrickById(trickId)
  if (!trick) return null
  
  const progress = storageService.getUserProgress()
  return {
    ...trick,
    stances: progress[trickId] || {
      normal: 'none',
      fakie: 'none',
      switch: 'none',
      nollie: 'none'
    }
  }
}

/**
 * 更新招式状态
 * @param {string} trickId - 招式 ID
 * @param {string} stance - 脚位
 * @param {string} status - 新状态
 * @returns {Object} - { success: boolean, timeline?: Object }
 */
function updateTrickStatus(trickId, stance, status) {
  const trick = mockTricks.getTrickById(trickId)
  if (!trick) {
    return { success: false, error: 'Trick not found' }
  }
  
  // 获取旧状态
  const progress = storageService.getUserProgress()
  const oldStatus = progress[trickId]?.[stance] || 'none'
  
  // 如果状态没有变化，直接返回
  if (oldStatus === status) {
    return { success: true, changed: false }
  }
  
  // 更新状态
  const updated = storageService.updateTrickStatus(trickId, stance, status)
  if (!updated) {
    return { success: false, error: 'Storage failed' }
  }
  
  // 如果是有效的进度（非 none），添加时光轴记录
  let timelineRecord = null
  if (status !== 'none') {
    timelineRecord = {
      id: util.generateId(),
      trickId: trickId,
      trickName: trick.name,
      stance: stance,
      status: status,
      date: util.formatDate(new Date()),
      timestamp: Date.now()
    }
    storageService.addTimelineRecord(timelineRecord)
  }
  
  return { 
    success: true, 
    changed: true,
    oldStatus,
    newStatus: status,
    timeline: timelineRecord
  }
}

/**
 * 获取统计数据
 * 所有统计都基于 timeline（成招记录）
 * 同一个招式（trickId + stance）只保留最高等级的记录
 * 优先级：mastered > grinding > trial
 * @returns {Object}
 */
function getStats() {
  const timeline = storageService.getTimeline()
  const totalTricks = mockTricks.getAllTricks().length

  // 按 trickId + stance 分组，保留最高等级的记录
  const statusPriority = { mastered: 3, grinding: 2, trial: 1 }
  const trickStanceMap = {}

  timeline.forEach(record => {
    const key = `${record.trickId}_${record.stance}`
    if (!trickStanceMap[key]) {
      trickStanceMap[key] = record
    } else {
      // 比较优先级，保留更高的
      const existingPriority = statusPriority[trickStanceMap[key].status] || 0
      const currentPriority = statusPriority[record.status] || 0
      if (currentPriority > existingPriority) {
        trickStanceMap[key] = record
      }
    }
  })

  // 从去重后的记录统计三种状态
  let masteredCount = 0  // 一脚一个
  let grindingCount = 0  // 死磕中
  let trialCount = 0     // 体验卡

  Object.values(trickStanceMap).forEach(record => {
    if (record.status === 'mastered') {
      masteredCount++
    } else if (record.status === 'grinding') {
      grindingCount++
    } else if (record.status === 'trial') {
      trialCount++
    }
  })

  // 已点亮 = 全部三种状态
  const litCount = masteredCount + grindingCount + trialCount

  return {
    totalTricks,
    totalStances: totalTricks * 4,
    masteredCount,
    grindingCount,
    trialCount,
    litCount, // 已点亮数量
    progress: Math.round((litCount / (totalTricks * 4)) * 100) // 进度百分比
  }
}

/**
 * 获取分类列表
 * @returns {Array}
 */
function getCategories() {
  return config.categories
}

module.exports = {
  getAllTricks,
  getTricksByCategory,
  groupTricks,
  searchTricks,
  fuzzySearchTricks,
  getTrickById,
  updateTrickStatus,
  getStats,
  getCategories
}
