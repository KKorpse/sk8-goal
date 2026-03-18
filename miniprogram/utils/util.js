/**
 * SkateGoal 工具函数
 */

/**
 * 格式化时间
 * @param {number} time - 秒数
 * @returns {string}
 */
function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  const hour = parseInt(time / 3600, 10)
  time %= 3600
  const minute = parseInt(time / 60, 10)
  time = parseInt(time % 60, 10)
  const second = time

  return [hour, minute, second].map(n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

/**
 * 格式化日期
 * @param {Date|number} date - 日期对象或时间戳
 * @param {string} format - 格式 'YYYY.MM.DD' | 'YYYY-MM-DD' | 'MM.DD'
 * @returns {string}
 */
function formatDate(date, format = 'YYYY.MM.DD') {
  if (typeof date === 'number') {
    date = new Date(date)
  }
  if (!(date instanceof Date)) {
    date = new Date()
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'MM.DD':
      return `${month}.${day}`
    case 'YYYY.MM.DD':
    default:
      return `${year}.${month}.${day}`
  }
}

/**
 * 格式化日期时间
 * @param {Date|number} date - 日期对象或时间戳
 * @param {boolean} withMs - 是否包含毫秒
 * @returns {string}
 */
function formatDateTime(date, withMs = false) {
  if (typeof date === 'number') {
    date = new Date(date)
  }
  if (!(date instanceof Date)) {
    date = new Date()
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  const ms = String(date.getMilliseconds()).padStart(3, '0')

  let ret = `${year}-${month}-${day} ${hour}:${minute}:${second}`
  if (withMs) {
    ret += '.' + ms
  }
  return ret
}

/**
 * 比较版本号
 * @param {string} v1 - 版本1
 * @param {string} v2 - 版本2
 * @returns {number} - 1: v1 > v2, -1: v1 < v2, 0: v1 == v2
 */
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 要执行的函数
 * @param {number} interval - 间隔时间(ms)
 * @returns {Function}
 */
function throttle(fn, interval = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 生成唯一 ID
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * 深拷贝
 * @param {*} obj - 要拷贝的对象
 * @returns {*}
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item))
  }
  const cloned = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * 模糊搜索匹配
 * @param {string} query - 搜索词
 * @param {string} text - 要匹配的文本
 * @returns {boolean}
 */
function fuzzyMatch(query, text) {
  if (!query || !text) return false
  query = query.toLowerCase()
  text = text.toLowerCase()
  
  // 直接包含
  if (text.includes(query)) return true
  
  // 首字母匹配 (如 'kf' 匹配 'kickflip')
  let queryIndex = 0
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      queryIndex++
    }
  }
  return queryIndex === query.length
}

module.exports = {
  formatTime,
  formatDate,
  formatDateTime,
  compareVersion,
  debounce,
  throttle,
  generateId,
  deepClone,
  fuzzyMatch
}
