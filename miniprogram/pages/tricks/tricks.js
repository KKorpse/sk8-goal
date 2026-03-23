/**
 * 动作库页面
 */
const trickService = require('../../services/trickService')
const userService = require('../../services/userService')
const vibrate = require('../../utils/vibrate')
const config = require('../../config')
const mcEffects = require('../../utils/mc-effects')

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
    showStancePanel: false,
    // 成就弹窗相关
    showAchievement: false,
    achievementData: null,
    achievementAnim: null
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
      // 更新当前选中招式的数据
      const updatedTrick = trickService.getTrickById(trickId)
      this.setData({ selectedTrick: updatedTrick })
      
      // 更新列表中对应的招式数据（避免整个列表刷新导致滚动位置重置）
      const groupedTricks = this.data.groupedTricks.map(group => {
        const tricks = group.tricks.map(trick => {
          if (trick.id === trickId) {
            return updatedTrick
          }
          return trick
        })
        return { ...group, tricks }
      })
      this.setData({ groupedTricks })
      
      // 检查成就解锁
      this.checkAchievements(trickId, updatedTrick)
      
      // MC 音效反馈
      if (newStatus === 'mastered') {
        // 播放 MC 成就音效
        mcEffects.playAchievementSound()
        // 显示庆祝提示
        wx.showToast({
          title: '🎉 一脚一个！',
          icon: 'none',
          duration: 2000
        })
      } else if (newStatus !== 'none') {
        // 其他状态变化播放放置音效
        mcEffects.playPlaceSound()
      } else {
        // 取消/重置播放破坏音效
        mcEffects.playBreakSound()
      }
    }
  },

  /**
   * 成就显示回调（由 app.showAchievement 触发）
   */
  onAchievementShow(achievement) {
    this.showAchievementPopup(achievement)
  },

  /**
   * 显示成就弹窗
   */
  showAchievementPopup(achievement) {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    
    // 从右侧滑入
    animation.translateX(300).opacity(0).step()
    animation.translateX(0).opacity(1).step({ duration: 300 })
    
    this.setData({
      showAchievement: true,
      achievementData: achievement,
      achievementAnim: animation.export()
    })
    
    // 3秒后自动关闭
    setTimeout(() => {
      this.hideAchievementPopup()
    }, 3000)
  },

  /**
   * 隐藏成就弹窗
   */
  hideAchievementPopup() {
    const animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in'
    })
    
    animation.translateX(300).opacity(0).step({ duration: 200 })
    
    this.setData({
      achievementAnim: animation.export()
    })
    
    setTimeout(() => {
      this.setData({
        showAchievement: false,
        achievementData: null
      })
    }, 200)
  },

  /**
   * 检查成就解锁
   */
  checkAchievements(trickId, trick) {
    const app = getApp()
    const unlocked = app.globalData.unlockedAchievements || []
    
    // 检查"一脚四式"成就 - 完成所有四种脚位
    const stances = trick.stances || {}
    const hasAllStances = stances.normal !== 'none' && 
                          stances.fakie !== 'none' && 
                          stances.switch !== 'none' && 
                          stances.nollie !== 'none'
    
    if (hasAllStances && !unlocked.includes('stance_complete')) {
      this.unlockAchievement('stance_complete')
    }
    
    // 检查"初次见面" - 第一个招式
    if (!unlocked.includes('first_trick')) {
      this.unlockAchievement('first_trick')
    }
    
    // 检查 Ollie 相关
    if (trickId === 'ollie' && stances.normal === 'mastered' && !unlocked.includes('ollie_master')) {
      this.unlockAchievement('ollie_master')
    }
  },

  /**
   * 解锁成就
   */
  unlockAchievement(achievementId) {
    const app = getApp()
    const unlocked = app.globalData.unlockedAchievements || []
    
    if (unlocked.includes(achievementId)) return
    
    unlocked.push(achievementId)
    app.globalData.unlockedAchievements = unlocked
    wx.setStorageSync('unlockedAchievements', unlocked)
    
    const achievement = config.achievements[achievementId]
    if (achievement) {
      mcEffects.showAchievement(achievement)
    }
  }
})
