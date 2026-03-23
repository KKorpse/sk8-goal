const IStorageAdapter = require('./IStorageAdapter')

function clone(value) {
  if (value === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(value))
}

class MemoryStorageAdapter extends IStorageAdapter {
  constructor(initialData = {}) {
    super()
    this.store = {}
    this.replaceAllSync(initialData)
  }

  getSync(key, defaultValue = null) {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? clone(this.store[key])
      : defaultValue
  }

  setSync(key, value) {
    this.store[key] = clone(value)
    return true
  }

  removeSync(key) {
    delete this.store[key]
    return true
  }

  clearSync() {
    this.store = {}
    return true
  }

  getAllSync() {
    return clone(this.store) || {}
  }

  replaceAllSync(data = {}) {
    this.store = clone(data) || {}
    return true
  }
}

module.exports = MemoryStorageAdapter
