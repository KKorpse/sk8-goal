/**
 * 我的页面
 */
const userService = require('../../services/userService')
const trickService = require('../../services/trickService')

Page({
  data: {
    // 用户信息
    userInfo: {},
    // 统计数据
    stats: {},
    // 时光轴数据
    timeline: [],
    // 是否正在加载
    loading: false,
    // 站位配置
    stanceText: {
      regular: 'Regular (左脚前)',
      goofy: 'Goofy (右脚前)'
    }
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadData()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadData()
    wx.stopPullDownRefresh()
  },

  /**
   * 加载数据
   */
  loadData() {
    this.setData({ loading: true })

    // 获取用户信息
    const userInfo = userService.getUserInfo()
    
    // 获取统计数据
    const stats = trickService.getStats()
    
    // 获取时光轴
    const timeline = userService.getTimeline(20)

    this.setData({
      userInfo,
      stats,
      timeline,
      loading: false
    })
  },

  /**
   * 点击时光轴项
   */
  onTimelineItemTap(e) {
    const { record } = e.detail
    // 可以跳转到该招式的详情或弹出面板
    wx.showToast({
      title: `${record.trickName} (${record.stance})`,
      icon: 'none'
    })
  },

  /**
   * 点击头衔
   */
  onTitleTap() {
    // 显示头衔墙
    const titles = userService.getAllTitles()
    const titleList = titles.map(t => {
      const status = t.current ? ' ⭐ 当前' : (t.unlocked ? ' ✓' : ' 🔒')
      return `${t.emoji} ${t.name}${status}`
    })
    
    wx.showActionSheet({
      itemList: titleList,
      fail: () => {}
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const { userInfo, stats } = this.data
    return {
      title: `${userInfo.nickname} 已点亮 ${stats.litCount} 个滑板招式！`,
      path: '/pages/tricks/tricks'
    }
  }
})
