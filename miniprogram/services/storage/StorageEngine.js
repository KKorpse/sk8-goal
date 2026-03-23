function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function clone(value) {
  if (value === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(value))
}

class StorageEngine {
  constructor(primaryAdapter, fallbackAdapter) {
    this.primaryAdapter = primaryAdapter
    this.fallbackAdapter = fallbackAdapter
  }

  setAdapters(primaryAdapter, fallbackAdapter) {
    this.primaryAdapter = primaryAdapter
    this.fallbackAdapter = fallbackAdapter || this.fallbackAdapter
    return true
  }

  warmupFallbackSync() {
    const snapshot = this.primaryAdapter.getAllSync()
    this.fallbackAdapter.replaceAllSync(snapshot)
    return snapshot
  }

  warmupFallback() {
    return Promise.resolve(this.warmupFallbackSync())
  }

  persistFallbackToPrimarySync() {
    const snapshot = this.fallbackAdapter.getAllSync()
    const ok = this.primaryAdapter.replaceAllSync(snapshot)
    return ok ? snapshot : null
  }

  persistFallbackToPrimary() {
    return Promise.resolve(this.persistFallbackToPrimarySync())
  }

  getSync(key, defaultValue = null) {
    try {
      const value = this.primaryAdapter.getSync(key, undefined)
      if (value !== undefined) {
        return value === '' ? defaultValue : value
      }
    } catch (e) {
      console.error(`[StorageEngine] Primary get ${key} failed:`, e)
    }

    try {
      const value = this.fallbackAdapter.getSync(key, undefined)
      return value !== undefined ? value : defaultValue
    } catch (e) {
      console.error(`[StorageEngine] Fallback get ${key} failed:`, e)
      return defaultValue
    }
  }

  setSync(key, value) {
    let primaryOk = false

    try {
      primaryOk = !!this.primaryAdapter.setSync(key, value)
    } catch (e) {
      console.error(`[StorageEngine] Primary set ${key} failed:`, e)
    }

    try {
      this.fallbackAdapter.setSync(key, value)
    } catch (e) {
      console.error(`[StorageEngine] Fallback backup set ${key} failed:`, e)
    }

    return primaryOk
  }

  removeSync(key) {
    let primaryOk = false

    try {
      primaryOk = !!this.primaryAdapter.removeSync(key)
    } catch (e) {
      console.error(`[StorageEngine] Primary remove ${key} failed:`, e)
    }

    try {
      this.fallbackAdapter.removeSync(key)
    } catch (e) {
      console.error(`[StorageEngine] Fallback backup remove ${key} failed:`, e)
    }

    return primaryOk
  }

  clearSync() {
    let primaryOk = false

    try {
      primaryOk = !!this.primaryAdapter.clearSync()
    } catch (e) {
      console.error('[StorageEngine] Primary clear failed:', e)
    }

    try {
      this.fallbackAdapter.clearSync()
    } catch (e) {
      console.error('[StorageEngine] Fallback backup clear failed:', e)
    }

    return primaryOk
  }

  getAllSync() {
    try {
      const snapshot = this.primaryAdapter.getAllSync()
      if (isObject(snapshot)) {
        return clone(snapshot)
      }
    } catch (e) {
      console.error('[StorageEngine] Primary export failed:', e)
    }

    try {
      const snapshot = this.fallbackAdapter.getAllSync()
      return isObject(snapshot) ? clone(snapshot) : {}
    } catch (e) {
      console.error('[StorageEngine] Fallback export failed:', e)
      return {}
    }
  }

  importSnapshotSync(snapshot = {}) {
    const normalized = isObject(snapshot) ? snapshot : {}
    const primaryOk = this.primaryAdapter.replaceAllSync(normalized)
    this.fallbackAdapter.replaceAllSync(normalized)
    return !!primaryOk
  }

  exportSnapshotSync() {
    return this.getAllSync()
  }

  get(key, defaultValue = null) {
    return Promise.resolve(this.getSync(key, defaultValue))
  }

  set(key, value) {
    return Promise.resolve(this.setSync(key, value))
  }

  remove(key) {
    return Promise.resolve(this.removeSync(key))
  }

  clear() {
    return Promise.resolve(this.clearSync())
  }

  getAll() {
    return Promise.resolve(this.getAllSync())
  }

  importSnapshot(snapshot = {}) {
    return Promise.resolve(this.importSnapshotSync(snapshot))
  }

  exportSnapshot() {
    return Promise.resolve(this.exportSnapshotSync())
  }
}

module.exports = StorageEngine
