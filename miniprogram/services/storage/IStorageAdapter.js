/**
 * 存储适配器接口约定
 * 所有适配器都需要同时提供同步与异步接口
 *
 * 同步接口:
 * - getSync(key, defaultValue)
 * - setSync(key, value)
 * - removeSync(key)
 * - clearSync()
 * - getAllSync()
 * - replaceAllSync(data)
 *
 * 异步接口:
 * - get(key, defaultValue)
 * - set(key, value)
 * - remove(key)
 * - clear()
 * - getAll()
 * - replaceAll(data)
 */

class IStorageAdapter {
  getSync() {
    throw new Error('IStorageAdapter.getSync must be implemented')
  }

  setSync() {
    throw new Error('IStorageAdapter.setSync must be implemented')
  }

  removeSync() {
    throw new Error('IStorageAdapter.removeSync must be implemented')
  }

  clearSync() {
    throw new Error('IStorageAdapter.clearSync must be implemented')
  }

  getAllSync() {
    throw new Error('IStorageAdapter.getAllSync must be implemented')
  }

  replaceAllSync() {
    throw new Error('IStorageAdapter.replaceAllSync must be implemented')
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

  replaceAll(data) {
    return Promise.resolve(this.replaceAllSync(data))
  }
}

module.exports = IStorageAdapter
