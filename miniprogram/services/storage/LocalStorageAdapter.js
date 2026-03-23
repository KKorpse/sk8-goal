const IStorageAdapter = require('./IStorageAdapter')

function clone(value) {
  if (value === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(value))
}

class LocalStorageAdapter extends IStorageAdapter {
  getSync(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key)
      return value !== '' ? clone(value) : defaultValue
    } catch (e) {
      console.error(`[LocalStorageAdapter] Get ${key} failed:`, e)
      return defaultValue
    }
  }

  setSync(key, value) {
    try {
      wx.setStorageSync(key, clone(value))
      return true
    } catch (e) {
      console.error(`[LocalStorageAdapter] Set ${key} failed:`, e)
      return false
    }
  }

  removeSync(key) {
    try {
      wx.removeStorageSync(key)
      return true
    } catch (e) {
      console.error(`[LocalStorageAdapter] Remove ${key} failed:`, e)
      return false
    }
  }

  clearSync() {
    try {
      wx.clearStorageSync()
      return true
    } catch (e) {
      console.error('[LocalStorageAdapter] Clear failed:', e)
      return false
    }
  }

  getAllSync() {
    try {
      const info = wx.getStorageInfoSync()
      const snapshot = {}

      info.keys.forEach(key => {
        const value = wx.getStorageSync(key)
        if (value !== '') {
          snapshot[key] = clone(value)
        }
      })

      return snapshot
    } catch (e) {
      console.error('[LocalStorageAdapter] Export snapshot failed:', e)
      return {}
    }
  }

  replaceAllSync(data = {}) {
    try {
      wx.clearStorageSync()

      Object.keys(data).forEach(key => {
        wx.setStorageSync(key, clone(data[key]))
      })

      return true
    } catch (e) {
      console.error('[LocalStorageAdapter] Import snapshot failed:', e)
      return false
    }
  }

  get(key, defaultValue = null) {
    return new Promise(resolve => {
      wx.getStorage({
        key,
        success: res => resolve(clone(res.data)),
        fail: () => resolve(defaultValue)
      })
    })
  }

  set(key, value) {
    return new Promise(resolve => {
      wx.setStorage({
        key,
        data: clone(value),
        success: () => resolve(true),
        fail: err => {
          console.error(`[LocalStorageAdapter] Async set ${key} failed:`, err)
          resolve(false)
        }
      })
    })
  }

  remove(key) {
    return new Promise(resolve => {
      wx.removeStorage({
        key,
        success: () => resolve(true),
        fail: err => {
          console.error(`[LocalStorageAdapter] Async remove ${key} failed:`, err)
          resolve(false)
        }
      })
    })
  }

  clear() {
    return new Promise(resolve => {
      wx.clearStorage({
        success: () => resolve(true),
        fail: err => {
          console.error('[LocalStorageAdapter] Async clear failed:', err)
          resolve(false)
        }
      })
    })
  }

  getAll() {
    return Promise.resolve(this.getAllSync())
  }

  replaceAll(data = {}) {
    return Promise.resolve(this.replaceAllSync(data))
  }
}

module.exports = LocalStorageAdapter
