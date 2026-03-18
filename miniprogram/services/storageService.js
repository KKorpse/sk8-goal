/**
 * SkateGoal 存储服务
 * 封装本地存储操作
 */

const config = require('../config')
const KEYS = config.storageKeys

/**
 * 同步获取数据
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*}
 */
function get(key, defaultValue = null) {
  try {
    const value = wx.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (e) {
    console.error(`[Storage] Get ${key} failed:`, e)
    return defaultValue
  }
}

/**
 * 同步设置数据
 * @param {string} key - 存储键
 * @param {*} value - 值
 * @returns {boolean}
 */
function set(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error(`[Storage] Set ${key} failed:`, e)
    return false
  }
}

/**
 * 同步删除数据
 * @param {string} key - 存储键
 * @returns {boolean}
 */
function remove(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error(`[Storage] Remove ${key} failed:`, e)
    return false
  }
}

/**
 * 清空所有数据
 * @returns {boolean}
 */
function clear() {
  try {
    wx.clearStorageSync()
    return true
  } catch (e) {
    console.error('[Storage] Clear failed:', e)
    return false
  }
}

// ========== 用户相关 ==========

/**
 * 获取用户信息
 * @returns {Object|null}
 */
function getUserInfo() {
  return get(KEYS.USER_INFO, null)
}

/**
 * 保存用户信息
 * @param {Object} userInfo
 * @returns {boolean}
 */
function setUserInfo(userInfo) {
  return set(KEYS.USER_INFO, userInfo)
}

/**
 * 获取用户进度
 * @returns {Object}
 */
function getUserProgress() {
  return get(KEYS.USER_PROGRESS, {})
}

/**
 * 保存用户进度
 * @param {Object} progress
 * @returns {boolean}
 */
function setUserProgress(progress) {
  return set(KEYS.USER_PROGRESS, progress)
}

/**
 * 更新单个招式进度
 * @param {string} trickId - 招式 ID
 * @param {string} stance - 脚位
 * @param {string} status - 状态
 * @returns {boolean}
 */
function updateTrickStatus(trickId, stance, status) {
  const progress = getUserProgress()
  
  if (!progress[trickId]) {
    progress[trickId] = {
      normal: 'none',
      fakie: 'none',
      switch: 'none',
      nollie: 'none'
    }
  }
  
  progress[trickId][stance] = status
  return setUserProgress(progress)
}

// ========== 时光轴相关 ==========

/**
 * 获取时光轴
 * @returns {Array}
 */
function getTimeline() {
  return get(KEYS.TIMELINE, [])
}

/**
 * 保存时光轴
 * @param {Array} timeline
 * @returns {boolean}
 */
function setTimeline(timeline) {
  return set(KEYS.TIMELINE, timeline)
}

/**
 * 添加时光轴记录
 * @param {Object} record
 * @returns {boolean}
 */
function addTimelineRecord(record) {
  const timeline = getTimeline()
  timeline.unshift(record) // 最新的在前面
  return setTimeline(timeline)
}

module.exports = {
  get,
  set,
  remove,
  clear,
  getUserInfo,
  setUserInfo,
  getUserProgress,
  setUserProgress,
  updateTrickStatus,
  getTimeline,
  setTimeline,
  addTimelineRecord
}
