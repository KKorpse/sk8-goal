/**
 * SkateGoal - 滑板招式成就系统
 * 小程序入口文件
 */

App({
  onLaunch(opts) {
    console.log('🛹 SkateGoal Launch', opts)
    
    // 初始化用户数据
    this.initUserData()
  },

  onShow(opts) {
    console.log('🛹 SkateGoal Show', opts)
  },

  onHide() {
    console.log('🛹 SkateGoal Hide')
  },

  /**
   * 初始化用户数据
   */
  initUserData() {
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
    // 系统信息
    systemInfo: wx.getSystemInfoSync()
  }
})
