/**
 * 动作库页面
 */
const trickService = require('../../services/trickService')
const userService = require('../../services/userService')
const vibrate = require('../../utils/vibrate')

Page({
  data: {
    // 分类列表
    categories: [],
    // 当前选中分类
    activeCategory: 'all',
    // 搜索关键词
    searchKeyword: '',
    // 分组后的招式列表
    groupedTricks: [],
    // 是否正在加载
    loading: false,
    // 当前选中的招式（用于脚位面板）
    selectedTrick: null,
    // 脚位面板是否显示
    showStancePanel: false
  },

  onLoad() {
    // 初始化示例数据（首次使用）
    userService.initSampleData()
    
    // 加载分类
    this.loadCategories()
    
    // 加载招式列表
    this.loadTricks()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    // 每次显示时刷新数据
    this.loadTricks()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadTricks()
    wx.stopPullDownRefresh()
  },

  /**
   * 加载分类列表
   */
  loadCategories() {
    const categories = trickService.getCategories()
    this.setData({ categories })
  },

  /**
   * 加载招式列表
   */
  loadTricks() {
    this.setData({ loading: true })

    let tricks = []
    const { activeCategory, searchKeyword } = this.data

    // 根据搜索词或分类获取招式
    if (searchKeyword) {
      tricks = trickService.fuzzySearchTricks(searchKeyword)
    } else {
      tricks = trickService.getTricksByCategory(activeCategory)
    }

    // 分组
    const groupedTricks = trickService.groupTricks(tricks)

    this.setData({
      groupedTricks,
      loading: false
    })
  },

  /**
   * 搜索
   */
  onSearch(e) {
    const { value } = e.detail
    this.setData({ searchKeyword: value })
    this.loadTricks()
  },

  /**
   * 分类切换
   */
  onCategoryChange(e) {
    const { id } = e.detail
    this.setData({ 
      activeCategory: id,
      searchKeyword: '' // 切换分类时清空搜索
    })
    this.loadTricks()
  },

  /**
   * 点击招式卡片
   */
  onTrickTap(e) {
    const { trick } = e.detail
    this.setData({
      selectedTrick: trick,
      showStancePanel: true
    })
  },

  /**
   * 关闭脚位面板
   */
  onStancePanelClose() {
    this.setData({ showStancePanel: false })
  },

  /**
   * 状态变更
   */
  onStatusChange(e) {
    const { trickId, stance, oldStatus, newStatus } = e.detail
    
    // 调用服务更新状态
    const result = trickService.updateTrickStatus(trickId, stance, newStatus)
    
    if (result.success && result.changed) {
      // 刷新当前选中招式的数据
      const updatedTrick = trickService.getTrickById(trickId)
      this.setData({ selectedTrick: updatedTrick })
      
      // 刷新列表
      this.loadTricks()
      
      // 如果是达成"一脚一个"，显示庆祝提示
      if (newStatus === 'mastered') {
        wx.showToast({
          title: '🎉 一脚一个！',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})
