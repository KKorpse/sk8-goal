/**
 * SkateGoal 存储服务
 * 基于 StorageEngine 封装业务存储操作
 */

const config = require('../config')
const LocalStorageAdapter = require('./storage/LocalStorageAdapter')
const MemoryStorageAdapter = require('./storage/MemoryStorageAdapter')
const StorageEngine = require('./storage/StorageEngine')

const KEYS = config.storageKeys

let localAdapter = new LocalStorageAdapter()
let memoryAdapter = new MemoryStorageAdapter()
let engine = new StorageEngine(localAdapter, memoryAdapter)
let currentBackend = 'local'

function createAdapters(options = {}) {
  const {
    localData = {},
    memoryData = {},
    useLocalAsPrimary = true,
    pureMemory = false
  } = options

  localAdapter = new LocalStorageAdapter()
  memoryAdapter = new MemoryStorageAdapter(memoryData)

  if (pureMemory) {
    engine = new StorageEngine(
      memoryAdapter,
      new MemoryStorageAdapter(memoryData)
    )
    currentBackend = 'memory'
    return engine
  }

  if (useLocalAsPrimary) {
    engine = new StorageEngine(localAdapter, memoryAdapter)
    currentBackend = 'local'
    return engine
  }

  localAdapter.replaceAllSync(localData)
  engine = new StorageEngine(memoryAdapter, localAdapter)
  currentBackend = 'memory'
  return engine
}

function getEngine() {
  return engine
}

function getPrimaryAdapter() {
  return engine.primaryAdapter
}

function getFallbackAdapter() {
  return engine.fallbackAdapter
}

function initStorage(options = {}) {
  const {
    primaryAdapter,
    fallbackAdapter,
    warmup = true,
    backend = 'local'
  } = options

  if (primaryAdapter && fallbackAdapter) {
    engine = new StorageEngine(primaryAdapter, fallbackAdapter)
    currentBackend = backend
  } else {
    createAdapters({
      useLocalAsPrimary: backend !== 'memory'
    })
  }

  if (warmup && currentBackend !== 'memory') {
    engine.warmupFallbackSync()
  }

  return engine
}

/**
 * 同步获取数据
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*}
 */
function get(key, defaultValue = null) {
  return engine.getSync(key, defaultValue)
}

/**
 * 异步获取数据
 * @param {string} key
 * @param {*} defaultValue
 * @returns {Promise<*>}
 */
function getAsync(key, defaultValue = null) {
  return engine.get(key, defaultValue)
}

/**
 * 同步设置数据
 * @param {string} key - 存储键
 * @param {*} value - 值
 * @returns {boolean}
 */
function set(key, value) {
  return engine.setSync(key, value)
}

/**
 * 异步设置数据
 * @param {string} key
 * @param {*} value
 * @returns {Promise<boolean>}
 */
function setAsync(key, value) {
  return engine.set(key, value)
}

/**
 * 同步删除数据
 * @param {string} key - 存储键
 * @returns {boolean}
 */
function remove(key) {
  return engine.removeSync(key)
}

/**
 * 异步删除数据
 * @param {string} key
 * @returns {Promise<boolean>}
 */
function removeAsync(key) {
  return engine.remove(key)
}

/**
 * 清空所有数据
 * @returns {boolean}
 */
function clear() {
  return engine.clearSync()
}

/**
 * 异步清空所有数据
 * @returns {Promise<boolean>}
 */
function clearAsync() {
  return engine.clear()
}

function exportSnapshot() {
  return engine.exportSnapshotSync()
}

function exportStorage() {
  return exportSnapshot()
}

function exportSnapshotAsync() {
  return engine.exportSnapshot()
}

function importSnapshot(snapshot = {}) {
  return engine.importSnapshotSync(snapshot)
}

function importStorage(snapshot = {}) {
  return importSnapshot(snapshot)
}

function importSnapshotAsync(snapshot = {}) {
  return engine.importSnapshot(snapshot)
}

function warmupMemoryFallback() {
  return engine.warmupFallbackSync()
}

function warmupMemoryFallbackAsync() {
  return engine.warmupFallback()
}

function persistFallbackToPrimary() {
  return engine.persistFallbackToPrimarySync()
}

function persistFallbackToPrimaryAsync() {
  return engine.persistFallbackToPrimary()
}

function setStorageBackend(backend, options = {}) {
  const snapshot = exportSnapshot()

  if (backend === 'memory') {
    createAdapters({
      localData: snapshot,
      memoryData: snapshot,
      useLocalAsPrimary: false
    })
    return true
  }

  if (backend === 'local') {
    createAdapters({
      useLocalAsPrimary: true
    })

    if (options.importCurrentSnapshot !== false) {
      engine.importSnapshotSync(snapshot)
    } else {
      engine.warmupFallbackSync()
    }

    return true
  }

  if (backend && typeof backend.getSync === 'function' && options.fallbackAdapter) {
    engine = new StorageEngine(backend, options.fallbackAdapter)
    currentBackend = options.backendName || 'custom'

    if (options.warmup !== false) {
      engine.warmupFallbackSync()
    }

    return true
  }

  return false
}

function resetToMemoryMode(initialData) {
  const snapshot = initialData || exportSnapshot()
  createAdapters({
    memoryData: snapshot,
    pureMemory: true
  })
  return true
}

function getCurrentBackend() {
  return currentBackend
}

// ========== 用户相关 ==========

function getUserInfo() {
  return get(KEYS.USER_INFO, null)
}

function setUserInfo(userInfo) {
  return set(KEYS.USER_INFO, userInfo)
}

function getUserProgress() {
  return get(KEYS.USER_PROGRESS, {})
}

function setUserProgress(progress) {
  return set(KEYS.USER_PROGRESS, progress)
}

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

function getTimeline() {
  return get(KEYS.TIMELINE, [])
}

function setTimeline(timeline) {
  return set(KEYS.TIMELINE, timeline)
}

function addTimelineRecord(record) {
  const timeline = getTimeline()
  timeline.unshift(record)
  return setTimeline(timeline)
}

// ========== 打卡相关 ==========

function getCheckinRecords() {
  return get(KEYS.CHECKIN_RECORDS, {})
}

function setCheckinRecords(records) {
  return set(KEYS.CHECKIN_RECORDS, records)
}

function addCheckin(date) {
  const records = getCheckinRecords()

  if (!records[date]) {
    records[date] = {
      count: 0,
      timestamps: []
    }
  }

  records[date].count++
  records[date].timestamps.push(Date.now())

  cleanOldCheckinRecords(records)

  return setCheckinRecords(records)
}

function removeCheckin(date) {
  const records = getCheckinRecords()

  if (records[date] && records[date].count > 0) {
    records[date].count--
    records[date].timestamps.pop()

    if (records[date].count === 0) {
      delete records[date]
    }

    return setCheckinRecords(records)
  }

  return false
}

function cleanOldCheckinRecords(records) {
  const maxDays = config.checkin.maxDays
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - maxDays)

  Object.keys(records).forEach(date => {
    const recordDate = new Date(date)
    if (recordDate < cutoffDate) {
      delete records[date]
    }
  })
}

function getConsecutiveDays() {
  const records = getCheckinRecords()
  const today = new Date()
  let consecutive = 0

  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = formatDate(date)

    if (records[dateStr] && records[dateStr].count > 0) {
      consecutive++
    } else {
      break
    }
  }

  return consecutive
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

module.exports = {
  initStorage,
  getEngine,
  getPrimaryAdapter,
  getFallbackAdapter,
  getCurrentBackend,
  setStorageBackend,
  warmupMemoryFallback,
  warmupMemoryFallbackAsync,
  persistFallbackToPrimary,
  persistFallbackToPrimaryAsync,
  exportSnapshot,
  exportStorage,
  exportSnapshotAsync,
  importSnapshot,
  importStorage,
  importSnapshotAsync,
  resetToMemoryMode,
  get,
  getAsync,
  set,
  setAsync,
  remove,
  removeAsync,
  clear,
  clearAsync,
  getUserInfo,
  setUserInfo,
  getUserProgress,
  setUserProgress,
  updateTrickStatus,
  getTimeline,
  setTimeline,
  addTimelineRecord,
  getCheckinRecords,
  setCheckinRecords,
  addCheckin,
  removeCheckin,
  getConsecutiveDays,
  formatDate
}
