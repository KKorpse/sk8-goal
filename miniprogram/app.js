/**
 * SkateGoal - 滑板招式成就系统
 * 小程序入口文件
 */

const userService = require('./services/userService')
const storageService = require('./services/storageService')
const themeService = require('./services/themeService')
const themePage = require('./utils/themePage')

const STORAGE_OPTIONS = {
  persistOnLaunch: false,
  persistOnHide: false
}

App({
  onLaunch(opts) {
    console.log('🛹 SkateGoal Launch', opts)

    this.initStorage()

    if (STORAGE_OPTIONS.persistOnLaunch) {
      storageService.persistFallbackToPrimary()
    }

    // 初始化用户数据
    this.initUserData()

    // 初始化主题
    this.initTheme()
    
    // 同步 progress 到 timeline（确保数据一致性）
    userService.syncProgressToTimeline()
  },

  onShow(opts) {
    console.log('🛹 SkateGoal Show', opts)
  },

  onHide() {
    console.log('🛹 SkateGoal Hide')

    if (STORAGE_OPTIONS.persistOnHide) {
      storageService.persistFallbackToPrimary()
    }
  },

  /**
   * 初始化存储引擎
   */
  initStorage() {
    storageService.initStorage({
      backend: 'local',
      warmup: true
    })
  },

  /**
   * 初始化用户数据
   */
  initUserData() {
    // 初始化示例数据（首次使用）
    userService.initSampleData()

    const userInfo = storageService.getUserInfo()
    const userProgress = storageService.getUserProgress()
    const timeline = storageService.getTimeline()

    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
    if (userProgress) {
      this.globalData.userProgress = userProgress
    }
    if (timeline) {
      this.globalData.timeline = timeline
    }
  },

  /**
   * 初始化主题
   */
  initTheme() {
    const theme = themeService.getCurrentTheme()
    this.globalData.theme = theme
  },

  /**
   * 全局数据
   */
  globalData: {
    // 用户信息
    userInfo: {
      id: '10001',
      nickname: '滑板新手',
      avatar: '',
      stance: 'regular', // regular | goofy
      yearsSkating: 1,
      city: '深圳'
    },
    // 用户招式进度 { trickId: { normal: status, fakie: status, switch: status, nollie: status } }
    userProgress: {},
    // 时光轴记录
    timeline: [],
    // 当前主题
    theme: themeService.getCurrentTheme(),
    // 系统信息
    systemInfo: wx.getSystemInfoSync()
  }
})
