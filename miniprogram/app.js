/**
 * SkateGoal - 滑板招式成就系统
 * 小程序入口文件
 */

const userService = require('./services/userService')

App({
  onLaunch(opts) {
    console.log('🛹 SkateGoal Launch', opts)
    
    // 初始化用户数据
    this.initUserData()
    
    // 同步 progress 到 timeline（确保数据一致性）
    userService.syncProgressToTimeline()
  },

  onShow(opts) {
    console.log('🛹 SkateGoal Show', opts)
  },

  onHide() {
    console.log('🛹 SkateGoal Hide')
  },

  /**
   * 显示 MC 风格成就弹窗
   * @param {Object} achievement - { title, description, icon }
   */
  showAchievement(achievement) {
    // 通知所有页面显示成就弹窗
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page.onAchievementShow) {
        page.onAchievementShow(achievement)
      }
    })
  },

  /**
   * 初始化用户数据
   */
  initUserData() {
    // 初始化示例数据（首次使用）
    userService.initSampleData()
    
    // 从本地存储读取用户数据
    const userInfo = wx.getStorageSync('userInfo')
    const userProgress = wx.getStorageSync('userProgress')
    const timeline = wx.getStorageSync('timeline')

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
    // 已解锁成就
    unlockedAchievements: wx.getStorageSync('unlockedAchievements') || [],
    // 系统信息
    systemInfo: wx.getSystemInfoSync()
  }
})
