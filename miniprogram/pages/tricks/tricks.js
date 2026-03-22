/**
 * 动作库页面
 */
const trickService = require('../../services/trickService')
const userService = require('../../services/userService')
const vibrate = require('../../utils/vibrate')
const config = require('../../config')

// 状态优先级（用于判断一个招式的"最佳状态"）
const STATUS_PRIORITY = { mastered: 3, grinding: 2, trial: 1, none: 0 }

// 三个熟练度分组配置
const STATUS_GROUPS = [
  { key: 'mastered', emoji: '🦶', label: '一脚一个', color: 'var(--status-mastered)' },
  { key: 'grinding', emoji: '🔥', label: '死磕中', color: 'var(--status-grinding)' },
  { key: 'trial', emoji: '🎫', label: '体验卡', color: 'var(--status-trial)' }
]

Page({
  data: {
    // 分类列表
    categories: [],
    // 当前选中分类
    activeCategory: 'all',
    // 搜索关键词
    searchKeyword: '',
    // 分组后的招式列表（按招式系列分组，用于展示）
    groupedTricks: [],
    // 按熟练度分组（mastered/grinding/trial）
    statusGroups: [],
    // 是否正在加载
    loading: false,
    // 当前选中的招式（用于脚位面板）
    selectedTrick: null,
    // 脚位面板是否显示
    showStancePanel: false,
    // 展开状态：记录每个 status group 是否展开
    expandedGroups: {
      mastered: true,
      grinding: true,
      trial: true
    },
    // 状态分组配置
    statusGroupConfig: STATUS_GROUPS
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
   * 获取招式的最佳状态
   */
  getBestStatus(trick) {
    let best = 'none'
    let bestPriority = 0
    const stances = trick.stances || {}
    for (const stance of config.stances) {
      const status = stances[stance] || 'none'
      const priority = STATUS_PRIORITY[status] || 0
      if (priority > bestPriority) {
        bestPriority = priority
        best = status
      }
    }
    return best
  },

  /**
   * 加载招式列表（同时维护两种分组方式）
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

    // 按招式系列分组（保留原有逻辑）
    const groupedTricks = trickService.groupTricks(tricks)

    // 按熟练度分组
    const statusMap = { mastered: [], grinding: [], trial: [] }
    tricks.forEach(trick => {
      const bestStatus = this.getBestStatus(trick)
      if (bestStatus !== 'none') {
        statusMap[bestStatus].push(trick)
      }
    })

    const statusGroups = STATUS_GROUPS.map(group => ({
      ...group,
      tricks: statusMap[group.key],
      count: statusMap[group.key].length
    }))

    this.setData({
      groupedTricks,
      statusGroups,
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
   * 切换熟练度分组展开/收起
   */
  onToggleStatusGroup(e) {
    const { key } = e.currentTarget.dataset
    vibrate.light()
    const expandedGroups = { ...this.data.expandedGroups }
    expandedGroups[key] = !expandedGroups[key]
    this.setData({ expandedGroups })
  },

  /**
   * 点击招式卡片
   */
  onTrickTap(e) {
    const { trick } = e.detail
    vibrate.light()
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
      // 更新当前选中招式的数据
      const updatedTrick = trickService.getTrickById(trickId)
      this.setData({ selectedTrick: updatedTrick })

      // 重新加载整个列表（因为分组可能变化）
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
