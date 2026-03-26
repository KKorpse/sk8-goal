/**
 * 我的页面
 */
const userService = require('../../services/userService')
const trickService = require('../../services/trickService')
const storageService = require('../../services/storageService')
const themePage = require('../../utils/themePage')

Page({
  data: {
    // 用户信息
    userInfo: {},
    // Ollie 数据
    ollie: {
      normal: 0,
      switch: 0
    },
    // Ollie 设置是否展开
    ollieExpanded: false,
    // 脚位设置是否展开
    stanceExpanded: false,
    // 统计数据
    stats: {},
    // 统计展开状态：'mastered' | 'grinding' | 'trial' | ''
    statExpanded: '',
    // 统计展开列表数据
    statTrickLists: {
      mastered: [],
      grinding: [],
      trial: []
    },
    // 时光轴数据
    timeline: [],
    // 是否正在加载
    loading: false,
    // 站位配置
    stanceText: {
      regular: 'Regular (左脚前)',
      goofy: 'Goofy (右脚前)'
    },
    // 真实板龄（年）
    yearsSkating: 0,
    // 成就徽章
    allBadges: [],
    unlockedBadges: [],
    // 徽章详情弹窗
    showBadgeModal: false,
    selectedBadge: {},
    // 新成就弹窗
    showNewBadgesModal: false,
    newBadges: [],
    // 招式列表弹窗
    showTrickListModal: false,
    trickListTitle: '',
    trickList: [],
    // 成招详情弹窗
    showTimelineDetail: false,
    selectedTimeline: {},
    // 昵称修改弹窗
    showNicknameModal: false,
    tempNickname: '',
    // 滚动同步
    timelineScrollLeft: 9999,
    // 主题
    themeId: '',
    themeClass: '',
    themeMeta: {},
    themeOptions: [],
    sceneConfig: {},
    themePanelExpanded: false,
    // 导出图片
    exportCanvasHeight: 4000
  },

  onLoad() {
    this.applyThemeState()
    this.loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.applyThemeState()
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

    // 获取时光轴并添加 emoji
    const timelineRaw = userService.getTimeline(20)
    const allTricks = require('../../mock/tricks').getAllTricks()
    const trickMap = {}
    allTricks.forEach(t => { trickMap[t.id] = t })
    const timeline = timelineRaw.map(item => ({
      ...item,
      emoji: trickMap[item.trickId] && trickMap[item.trickId].emoji || '🛹'
    }))

    // 计算真实板龄
    const yearsSkating = this.calculateYearsSkating()
    
    // 加载 Ollie 数据
    const ollieData = wx.getStorageSync('ollie_data') || { normal: 0, switch: 0 }
    
    // 获取成就徽章
    const badges = this.getBadges(stats, ollieData)

    // 构建按熟练度分组的招式列表（用于展开下拉）
    const statTrickLists = this.buildStatTrickLists()

    this.setData({
      userInfo,
      stats,
      timeline,
      yearsSkating,
      ollie: ollieData,
      allBadges: badges.all,
      unlockedBadges: badges.unlocked,
      statTrickLists,
      loading: false
    })
    
    // 检查是否有未读徽章，自动弹出成就窗口
    const unreadBadges = badges.unlocked.filter(b => !b.read)
    if (unreadBadges.length > 0) {
      setTimeout(() => {
        this.setData({
          showNewBadgesModal: true,
          newBadges: unreadBadges
        })
      }, 500) // 延迟500ms，等待页面渲染完成
    }
  },

  /**
   * 计算真实滑板年数
   * 逻辑：每个 start 到最近的 pause 是一个时间段
   * 如果最后一个节点是 start，则从该 start 到当前时间累积
   */
  calculateYearsSkating() {
    const history = wx.getStorageSync('skating_history') || []
    if (history.length === 0) return 0
    
    const now = Date.now()
    
    // 按时间顺序排序
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp)
    
    // 配对 start 和 pause
    let totalMs = 0
    let currentStart = null
    
    sorted.forEach(node => {
      if (node.type === 'start') {
        currentStart = node
      } else if (node.type === 'pause' && currentStart !== null) {
        totalMs += node.timestamp - currentStart.timestamp
        currentStart = null
      }
    })
    
    // 如果最后一个节点是 start，累积到当前时间
    if (currentStart !== null) {
      totalMs += now - currentStart.timestamp
    }
    
    // 转换为年，保留一位小数
    return Math.round(totalMs / (365.25 * 24 * 60 * 60 * 1000) * 10) / 10
  },

  /**
   * 获取成就徽章（基于成招记录统计）
   */
  getBadges(stats, ollieData) {
    const timeline = storageService.getTimeline()
    
    // 从成招记录构建按招式分组的脚位映射
    const trickStances = {}
    timeline.forEach(record => {
      if (!trickStances[record.trickId]) {
        trickStances[record.trickId] = new Set()
      }
      trickStances[record.trickId].add(record.stance)
    })
    
    // 从存储中读取已读状态
    const readStatus = wx.getStorageSync('badge_read_status') || {}
    
    // 徽章定义
    const badgeDefs = [
      // === Ollie 高度成就 ===
      {
        id: 'first-takeoff',
        name: '第一次起飞',
        emoji: '🚀',
        description: 'Ollie 高度超过半立，你终于离地了！',
        type: 'ollie',
        check: () => {
          const height = ollieData.normal || 0
          return {
            unlocked: height >= 0.5,
            progress: height,
            progressMax: 0.5,
            progressText: `${height} / 0.5 立`
          }
        }
      },
      {
        id: 'glue-feet',
        name: '脚上有胶水',
        emoji: '🧲',
        description: 'Ollie 三立，板子仿佛粘在你脚上！',
        type: 'ollie',
        check: () => {
          const height = ollieData.normal || 0
          return {
            unlocked: height >= 3,
            progress: Math.min(height, 3),
            progressMax: 3,
            progressText: `${height} / 3 立`
          }
        }
      },
      {
        id: 'big-talk',
        name: '就爱吹牛逼',
        emoji: '🐮',
        description: 'Ollie 达到六立，你是传说中的滑手！',
        type: 'ollie',
        check: () => {
          const height = ollieData.normal || 0
          return {
            unlocked: height >= 6,
            progress: Math.min(height, 6),
            progressMax: 6,
            progressText: `${height} / 6 立`
          }
        }
      },
      // === 特定招式成就 ===
      {
        id: 'first-flip',
        name: '板下翻花',
        emoji: '🌸',
        description: '完成第一个 Kickflip，翻板的世界向你敞开！',
        type: 'trick',
        check: () => {
          const record = timeline.find(t => t.trickId === 'kickflip')
          return {
            unlocked: !!record,
            unlockDate: record ? record.date : null
          }
        }
      },
      {
        id: 'helicopter',
        name: '直升机起飞',
        emoji: '🚁',
        description: '完成第一个 360 Flip，你让板子转起来了！',
        type: 'trick',
        check: () => {
          const record = timeline.find(t => t.trickId === 'treflip' || t.trickId === '360-flip')
          return {
            unlocked: !!record,
            unlockDate: record ? record.date : null
          }
        }
      },
      // === 脚位成就 ===
      {
        id: 'rebel',
        name: '逆行者',
        emoji: '🔄',
        description: '在反脚位点亮第一个招，挑战不可能！',
        type: 'stance',
        check: () => {
          const switchStances = ['switch', 'fakie', 'nollie']
          const record = timeline.find(t => switchStances.includes(t.stance))
          return {
            unlocked: !!record,
            unlockDate: record ? record.date : null
          }
        }
      },
      {
        id: 'quad-master',
        name: '全脚制霸',
        emoji: '🎯',
        description: '同一个招式集齐 4 个脚位，你是全能选手！',
        type: 'stance',
        check: () => {
          const allStances = ['normal', 'fakie', 'switch', 'nollie']
          let completedTrick = null
          let lastRecord = null
          
          Object.entries(trickStances).forEach(([trickId, stances]) => {
            if (allStances.every(s => stances.has(s))) {
              completedTrick = trickId
              // 找该招式最新的记录
              const records = timeline.filter(t => t.trickId === trickId)
              lastRecord = records[0]
            }
          })
          
          return {
            unlocked: !!completedTrick,
            unlockDate: lastRecord ? lastRecord.date : null
          }
        }
      },
      // === 数量成就 ===
      {
        id: 'first-step',
        name: '起步',
        emoji: '🐣',
        description: '点亮第一个招式，滑板之路开始了！',
        type: 'count',
        check: () => {
          const count = stats.litCount || 0
          const record = timeline[0]
          return {
            unlocked: count >= 1,
            progress: count,
            progressMax: 1,
            progressText: `${count} / 1`,
            unlockDate: record ? record.date : null
          }
        }
      },
      {
        id: 'apprentice',
        name: '小有所成',
        emoji: '⭐',
        description: '点亮 10 个招式，你已经入门了！',
        type: 'count',
        check: () => {
          const count = stats.litCount || 0
          return {
            unlocked: count >= 10,
            progress: Math.min(count, 10),
            progressMax: 10,
            progressText: `${count} / 10`
          }
        }
      },
      {
        id: 'skilled',
        name: '身手不凡',
        emoji: '🔥',
        description: '点亮 20 个招式，你的招式库越来越丰富了！',
        type: 'count',
        check: () => {
          const count = stats.litCount || 0
          return {
            unlocked: count >= 20,
            progress: Math.min(count, 20),
            progressMax: 20,
            progressText: `${count} / 20`
          }
        }
      },
      {
        id: 'master',
        name: '街头传说',
        emoji: '🏆',
        description: '点亮 50 个招式，你是街头滑板的高手！',
        type: 'count',
        check: () => {
          const count = stats.litCount || 0
          return {
            unlocked: count >= 50,
            progress: Math.min(count, 50),
            progressMax: 50,
            progressText: `${count} / 50`
          }
        }
      },
      {
        id: 'legend',
        name: '滑板之神',
        emoji: '🌟',
        description: '点亮 100 个招式，你是滑板界的传奇！',
        type: 'count',
        check: () => {
          const count = stats.litCount || 0
          return {
            unlocked: count >= 100,
            progress: Math.min(count, 100),
            progressMax: 100,
            progressText: `${count} / 100`
          }
        }
      }
    ]
    
    // 计算每个徽章的状态
    const allBadges = badgeDefs.map(def => {
      const result = def.check()
      const wasUnlocked = (readStatus[def.id] && readStatus[def.id].unlocked) || false
      const isRead = (readStatus[def.id] && readStatus[def.id].read) || false
      
      const badge = {
        id: def.id,
        name: def.name,
        emoji: def.emoji,
        description: def.description,
        type: def.type,
        unlocked: result.unlocked,
        unlockDate: result.unlockDate || null,
        // 新解锁且未标记为已读，则为未读状态
        read: !result.unlocked ? true : (isRead || !wasUnlocked ? isRead : false)
      }
      
      // 添加进度信息
      if (result.progress !== undefined) {
        badge.progress = result.progress
        badge.progressMax = result.progressMax
        badge.progressText = result.progressText
        badge.progressPercent = Math.round((result.progress / result.progressMax) * 100)
      }
      
      return badge
    })
    
    // 已解锁的排在前面，未读的排在最前面
    allBadges.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1
      if (!a.unlocked && b.unlocked) return 1
      if (a.unlocked && b.unlocked) {
        if (!a.read && b.read) return -1
        if (a.read && !b.read) return 1
      }
      return 0
    })
    
    const unlocked = allBadges.filter(b => b.unlocked)
    
    // 更新存储中的解锁状态
    const newReadStatus = {}
    unlocked.forEach(b => {
      newReadStatus[b.id] = {
        unlocked: true,
        read: b.read
      }
    })
    wx.setStorageSync('badge_read_status', newReadStatus)
    
    return { all: allBadges, unlocked }
  },

  /**
   * 展开/收起脚位设置
   */
  toggleStanceExpand() {
    this.setData({
      stanceExpanded: !this.data.stanceExpanded
    })
  },

  /**
   * 设置脚位
   */
  setStance(e) {
    const { stance } = e.currentTarget.dataset
    const userInfo = userService.updateUserInfo({ stance })
    this.setData({
      userInfo,
      stanceExpanded: false
    })
    wx.showToast({
      title: `已切换至 ${stance === 'regular' ? 'Regular' : 'Goofy'}`,
      icon: 'none'
    })
  },

  /**
   * 选择头像
   */
  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath

        // 保存到本地缓存
        wx.saveFile({
          tempFilePath,
          success: (saveRes) => {
            const savedFilePath = saveRes.savedFilePath

            // 更新用户信息
            const userInfo = userService.updateUserInfo({ avatar: savedFilePath })
            this.setData({ userInfo })

            wx.showToast({
              title: '头像已更新',
              icon: 'success'
            })
          },
          fail: () => {
            // 如果保存失败，直接使用临时路径
            const userInfo = userService.updateUserInfo({ avatar: tempFilePath })
            this.setData({ userInfo })
            wx.showToast({
              title: '头像已更新',
              icon: 'success'
            })
          }
        })
      }
    })
  },

  /**
   * 编辑昵称 - 打开弹窗
   */
  editNickname() {
    this.setData({
      showNicknameModal: true,
      tempNickname: this.data.userInfo.nickname || ''
    })
  },

  /**
   * 输入昵称
   */
  onNicknameInput(e) {
    this.setData({
      tempNickname: e.detail.value
    })
  },

  /**
   * 关闭昵称弹窗
   */
  closeNicknameModal() {
    this.setData({ showNicknameModal: false })
  },

  /**
   * 确认修改昵称
   */
  confirmNickname() {
    const newNickname = this.data.tempNickname.trim()
    if (!newNickname) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none'
      })
      return
    }
    if (newNickname.length > 12) {
      wx.showToast({
        title: '昵称不能超过12个字',
        icon: 'none'
      })
      return
    }
    
    const userInfo = userService.updateUserInfo({ nickname: newNickname })
    this.setData({
      userInfo,
      showNicknameModal: false
    })
    wx.showToast({
      title: '昵称已更新',
      icon: 'success'
    })
  },

  /**
   * 点击板龄，跳转滑板历史页面
   */
  onSkatingHistoryTap() {
    wx.navigateTo({
      url: '/pages/skating-history/skating-history',
    })
  },

  /**
   * 展开/收起 Ollie 设置
   */
  toggleOllieExpand() {
    this.setData({
      ollieExpanded: !this.data.ollieExpanded
    })
  },

  /**
   * 构建/刷新按熟练度分组的招式列表
   */
  buildStatTrickLists() {
    const timeline = storageService.getTimeline()
    const allTricks = require('../../mock/tricks').getAllTricks()

    const trickMap = {}
    allTricks.forEach(t => { trickMap[t.id] = t })

    // 按 trickId + stance 分组，保留最高等级
    const statusPriority = { mastered: 3, grinding: 2, trial: 1 }
    const trickStanceMap = {}

    timeline.forEach(r => {
      const key = `${r.trickId}_${r.stance}`
      if (!trickStanceMap[key]) {
        trickStanceMap[key] = r
      } else {
        const existingPriority = statusPriority[trickStanceMap[key].status] || 0
        const currentPriority = statusPriority[r.status] || 0
        if (currentPriority > existingPriority) {
          trickStanceMap[key] = r
        }
      }
    })

    // 按熟练度分组
    const result = { mastered: [], grinding: [], trial: [] }
    Object.values(trickStanceMap).forEach(r => {
      const trick = trickMap[r.trickId] || {}
      const item = {
        id: r.id,
        name: r.trickName,
        emoji: trick.emoji || '🛹',
        stance: r.stance
      }
      if (r.status === 'mastered') {
        result.mastered.push(item)
      } else if (r.status === 'grinding') {
        result.grinding.push(item)
      } else if (r.status === 'trial') {
        result.trial.push(item)
      }
    })

    return result
  },

  /**
   * 展开/收起统计列表
   */
  toggleStatExpand(e) {
    const { type } = e.currentTarget.dataset
    const { statExpanded, statTrickLists } = this.data

    if (statExpanded === type) {
      // 收起
      this.setData({ statExpanded: '' })
    } else {
      // 展开（如果是首次展开则刷新列表数据）
      this.setData({ statExpanded: type, statTrickLists: this.buildStatTrickLists() })
    }
  },

  /**
   * 调整 Ollie 高度
   */
  adjustOllie(e) {
    const { type, delta } = e.currentTarget.dataset
    let val = parseFloat(delta)
    let current = this.data.ollie[type]
    let newValue = current + val
    if (newValue < 0) newValue = 0
    if (newValue > 6) newValue = 6  // 最大高度限制为 6 立
    
    const newOllie = { ...this.data.ollie, [type]: newValue }
    this.setData({ ollie: newOllie })
    wx.setStorageSync('ollie_data', newOllie)
    
    // 重新计算徽章状态
    const badges = this.getBadges(this.data.stats, newOllie)
    this.setData({
      allBadges: badges.all,
      unlockedBadges: badges.unlocked
    })
    
    // 检查是否有新解锁的未读徽章，自动弹出成就窗口
    const unreadBadges = badges.unlocked.filter(b => !b.read)
    if (unreadBadges.length > 0) {
      setTimeout(() => {
        this.setData({
          showNewBadgesModal: true,
          newBadges: unreadBadges
        })
      }, 300)
    }
  },

  /**
   * 点击单个徽章查看详情
   */
  onBadgeTap(e) {
    const { badge } = e.currentTarget.dataset
    this.setData({
      showBadgeModal: true,
      selectedBadge: badge
    })
  },

  /**
   * 关闭新成就弹窗
   */
  closeNewBadgesModal() {
    const { newBadges, allBadges } = this.data
    
    // 将所有新成就标记为已读
    const updatedBadges = allBadges.map(b => {
      const isNewBadge = newBadges.find(nb => nb.id === b.id)
      if (isNewBadge) {
        return { ...b, read: true }
      }
      return b
    })
    
    // 更新存储
    const readStatus = wx.getStorageSync('badge_read_status') || {}
    newBadges.forEach(badge => {
      if (readStatus[badge.id]) {
        readStatus[badge.id].read = true
      }
    })
    wx.setStorageSync('badge_read_status', readStatus)
    
    this.setData({
      allBadges: updatedBadges,
      unlockedBadges: updatedBadges.filter(b => b.unlocked),
      showNewBadgesModal: false,
      newBadges: []
    })
  },

  /**
   * 关闭徽章详情弹窗
   */
  closeBadgeModal() {
    const { selectedBadge, allBadges } = this.data
    
    // 如果徽章已解锁且未读，标记为已读
    if (selectedBadge.unlocked && !selectedBadge.read) {
      const updatedBadges = allBadges.map(b => {
        if (b.id === selectedBadge.id) {
          return { ...b, read: true }
        }
        return b
      })
      
      // 更新存储
      const readStatus = wx.getStorageSync('badge_read_status') || {}
      if (readStatus[selectedBadge.id]) {
        readStatus[selectedBadge.id].read = true
        wx.setStorageSync('badge_read_status', readStatus)
      }
      
      this.setData({
        allBadges: updatedBadges,
        unlockedBadges: updatedBadges.filter(b => b.unlocked),
        showBadgeModal: false
      })
    } else {
      this.setData({ showBadgeModal: false })
    }
  },

  /**
   * 阻止冒泡
   */
  preventClose() {},

  /**
   * 跳转到作者信息页
   */
  goAuthor() {
    wx.navigateTo({
      url: '/pages/author/author'
    })
  },

  /**
   * 跳转到好友列表
   */
  goFriends() {
    wx.navigateTo({
      url: '/pages/friends/friends'
    })
  },

  /**
   * 跳转到动作库
   */
  onGoToTricks() {
    wx.navigateTo({
      url: '/pages/tricks/tricks',
    })
  },

  /**
   * 点击统计数据
   * 同一个招式（trickId + stance）只显示最高等级的记录
   * 优先级：mastered > grinding > trial
   */
  onStatTap(e) {
    const { type } = e.currentTarget.dataset
    const timeline = storageService.getTimeline()
    const allTricks = require('../../mock/tricks').getAllTricks()

    // 构建招式 ID 到名称的映射
    const trickMap = {}
    allTricks.forEach(t => {
      trickMap[t.id] = t
    })

    // 按 trickId + stance 分组，保留最高等级的记录
    const statusPriority = { mastered: 3, grinding: 2, trial: 1 }
    const trickStanceMap = {}

    timeline.forEach(r => {
      const key = `${r.trickId}_${r.stance}`
      if (!trickStanceMap[key]) {
        trickStanceMap[key] = r
      } else {
        // 比较优先级，保留更高的
        const existingPriority = statusPriority[trickStanceMap[key].status] || 0
        const currentPriority = statusPriority[r.status] || 0
        if (currentPriority > existingPriority) {
          trickStanceMap[key] = r
        }
      }
    })

    // 筛选指定状态的记录
    let trickList = []
    let title = ''

    if (type === 'mastered') {
      title = '一脚一个'
      Object.values(trickStanceMap)
        .filter(r => r.status === 'mastered')
        .forEach(r => {
          const trick = trickMap[r.trickId] || {}
          trickList.push({
            id: r.id,
            trickId: r.trickId,
            name: r.trickName,
            emoji: trick.emoji,
            stance: r.stance,
            date: r.date
          })
        })
    } else if (type === 'grinding') {
      title = '死磕中'
      Object.values(trickStanceMap)
        .filter(r => r.status === 'grinding')
        .forEach(r => {
          const trick = trickMap[r.trickId] || {}
          trickList.push({
            id: r.id,
            trickId: r.trickId,
            name: r.trickName,
            emoji: trick.emoji,
            stance: r.stance,
            date: r.date
          })
        })
    } else if (type === 'trial') {
      title = '体验卡'
      Object.values(trickStanceMap)
        .filter(r => r.status === 'trial')
        .forEach(r => {
          const trick = trickMap[r.trickId] || {}
          trickList.push({
            id: r.id,
            trickId: r.trickId,
            name: r.trickName,
            emoji: trick.emoji,
            stance: r.stance,
            date: r.date
          })
        })
    }

    this.setData({
      showTrickListModal: true,
      trickListTitle: title,
      trickList
    })
  },

  /**
   * 关闭招式列表弹窗
   */
  closeTrickListModal() {
    this.setData({ showTrickListModal: false })
  },

  /**
   * 点击成招记录节点
   */
  onTimelineNodeTap(e) {
    const { index } = e.detail
    const record = this.data.timeline[index]
    const allTricks = require('../../mock/tricks').getAllTricks()
    const trick = allTricks.find(t => t.id === record.trickId) || {}
    
    this.setData({
      showTimelineDetail: true,
      selectedTimeline: {
        ...record,
        emoji: trick.emoji
      }
    })
  },

  /**
   * 关闭成招详情弹窗
   */
  closeTimelineDetail() {
    this.setData({ showTimelineDetail: false })
  },

  // ==================== 导出图片功能 ====================

  /**
   * 导出首页图片 - 使用真实元素位置精确绘制
   */
  onExportImage() {
    wx.showLoading({ title: '正在生成图片…', mask: true })

    // 用 createSelectorQuery 量出每个区块的真实坐标
    const query = wx.createSelectorQuery().in(this)
    query.select('.profile-page').boundingClientRect()
    query.select('.profile-card').boundingClientRect()
    query.select('.progress-card').boundingClientRect()
    query.select('.timeline-card').boundingClientRect()
    query.select('.checkin-wall-card').boundingClientRect()
    query.select('.footer').boundingClientRect()

    query.exec((res) => {
      const pageRect = res[0]
      const profileRect = res[1]
      const progressRect = res[2]
      const timelineRect = res[3]
      const checkinRect = res[4]
      const footerRect = res[5]

      if (!pageRect) {
        wx.hideLoading()
        wx.showToast({ title: '页面未就绪，请重试', icon: 'none' })
        return
      }

      const W = 750
      // 用 page 的实际宽度作为内容宽度
      const contentW = Math.min(Math.ceil(pageRect.width), W)
      // 总高度 = page 高度 + 顶部偏移 + 底部留白
      const totalHeight = Math.ceil(pageRect.height) + 80

      this.setData({ exportCanvasHeight: totalHeight })

      setTimeout(() => {
        const ctx = wx.createCanvasContext('exportCanvas')
        this._doDrawExport({
          ctx, W, totalHeight, contentW,
          pageRect, profileRect, progressRect,
          timelineRect, checkinRect, footerRect
        })
      }, 150)
    })
  },

  /**
   * 实际执行绘制
   */
  _doDrawExport({ ctx, W, totalHeight, contentW, pageRect, profileRect, progressRect, timelineRect, checkinRect, footerRect }) {
    const themeId = this.data.themeId
    const c = this.getThemeColorsV2(themeId)
    const { userInfo, ollie, stats, allBadges, unlockedBadges, timeline, yearsSkating, sceneConfig } = this.data
    const storageService = require('../../services/storageService')
    const records = storageService.getCheckinRecords()
    const today = new Date()
    const todayStr = storageService.formatDate(today)
    const todayChecked = (records[todayStr] && records[todayStr].count) > 0
    const consecutiveDays = storageService.getConsecutiveDays()
    const totalCheckins = Object.keys(records).length
    const monthCheckins = Object.keys(records).filter(d => {
      const dt = new Date(d)
      return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && records[d].count > 0
    }).length
    const yearCheckins = Object.keys(records).filter(d => {
      const dt = new Date(d)
      return dt.getFullYear() === today.getFullYear() && records[d].count > 0
    }).length

    // 计算偏移量：pageRect.left 是页面在屏幕中的左边界，内容从 0 开始
    const pageLeft = pageRect.left
    const offsetX = -pageLeft  // 使 pageLeft 映射到 canvas 0

    // ── 背景 ──
    ctx.setFillStyle(c.bgDark)
    ctx.fillRect(0, 0, W, totalHeight)

    // 背景纹理（近似 CSS radial-gradient 点阵）
    ctx.save()
    ctx.globalAlpha = 0.25
    for (let px = 0; px < W; px += 24) {
      for (let py = 0; py < totalHeight; py += 24) {
        ctx.setFillStyle(c.bgDot || '#4a3520')
        ctx.fillRect(px, py, 2, 2)
      }
    }
    ctx.restore()

    // ── 逐区块绘制（使用真实坐标偏移） ──
    let nextY = 0

    if (profileRect) {
      const absY = profileRect.top - pageRect.top + 24
      this._drawProfileCard(ctx, absY, c, { userInfo, ollie, allBadges, unlockedBadges, yearsSkating, sceneConfig }, offsetX, W)
      nextY = absY + profileRect.height + 24
    }

    if (progressRect) {
      const absY = progressRect.top - pageRect.top + 24
      this._drawProgressCard(ctx, absY, c, { ollie, stats }, offsetX, W)
      nextY = absY + progressRect.height + 24
    }

    if (timelineRect) {
      const absY = timelineRect.top - pageRect.top + 24
      this._drawTimelineCard(ctx, absY, c, { timeline }, offsetX, W)
      nextY = absY + timelineRect.height + 24
    }

    if (checkinRect) {
      const absY = checkinRect.top - pageRect.top + 24
      this._drawCheckinCard(ctx, absY, c, { todayChecked, consecutiveDays, totalCheckins, monthCheckins, yearCheckins }, offsetX, W)
      nextY = absY + checkinRect.height + 24
    }

    if (footerRect) {
      const absY = footerRect.top - pageRect.top + 24
      ctx.setFontSize(24)
      ctx.setFillStyle(c.textSecondary)
      ctx.setTextAlign('center')
      ctx.fillText('Made with 🛹 by Korpse  ·  v1.0.0', W / 2, absY + 40)
    }

    ctx.draw(false, () => {
      this._saveExportImage()
    })
  },

  // ──────────────────────────────── 各区块绘制 ────────────────────────────────

  /**
   * 个人信息卡片
   */
  _drawProfileCard(ctx, startY, c, data, offsetX, W) {
    const { userInfo, ollie, allBadges, unlockedBadges, yearsSkating, sceneConfig } = data
    const x = Math.max(24 + offsetX, 24)
    const cardW = Math.min(W - 48, W - offsetX - 48)
    const r = c.cardRadius
    const ip = 28

    // 卡片背景 + 边框
    this.drawRRect(ctx, x, startY, cardW, 220, r, c.bgCard)
    ctx.setStrokeStyle(c.border)
    ctx.setLineWidth(4)
    ctx.stroke()

    // 头像
    if (userInfo.avatar) {
      this._drawAvatar(ctx, x + ip, startY + ip, 110, 110, 8, userInfo.avatar)
    } else {
      this.drawRRect(ctx, x + ip, startY + ip, 110, 110, 8, c.bgSurface)
      ctx.setStrokeStyle(c.border)
      ctx.setLineWidth(4)
      ctx.stroke()
      ctx.setFontSize(56)
      ctx.setFillStyle(c.textPrimary)
      ctx.setTextAlign('center')
      ctx.fillText((sceneConfig && sceneConfig.avatarIcon) ? sceneConfig.avatarIcon : '🛹', x + ip + 55, startY + ip + 78)
    }

    // 昵称
    ctx.setFontSize(44)
    ctx.setFillStyle(c.textPrimary)
    ctx.setTextAlign('left')
    ctx.fillText(userInfo.nickname || '滑板玩家', x + ip + 145, startY + ip + 44)

    // ID
    ctx.setFontSize(24)
    ctx.setFillStyle(c.textSecondary)
    ctx.fillText('ID: ' + (userInfo.id || '—'), x + ip + 145, startY + ip + 80)

    // 脚位标签
    const stance = userInfo.stance === 'regular' ? 'Regular' : 'Goofy'
    this._drawTag(ctx, x + cardW - 160, startY + ip, 130, 40, '脚位 ' + stance, c.bgSurface, c.textPrimary)

    // 板龄标签
    this._drawTag(ctx, x + cardW - 160, startY + ip + 50, 130, 40, '板龄 ' + yearsSkating + ' 年', c.bgSurface, c.textPrimary)

    // Ollie 高度
    this._drawTag(ctx, x + ip, startY + 220 - ip - 40, 220, 40, 'Ollie ' + (ollie.normal || 0) + ' / ' + (ollie.switch || 0) + ' 立', c.primaryYellow, c.textPrimaryDark)

    // 成就徽章区
    const badgesY = startY + 220 + 12
    ctx.setFontSize(24)
    ctx.setFillStyle(c.textSecondary)
    ctx.setTextAlign('left')
    ctx.fillText('成就徽章 ' + unlockedBadges.length + '/' + allBadges.length, x, badgesY)

    const badgeSize = 52
    const badgeGap = 16
    const maxShow = 8
    const displayBadges = allBadges.slice(0, maxShow)

    displayBadges.forEach((badge, i) => {
      const bx = x + i * (badgeSize + badgeGap)
      const by = badgesY + 12
      if (badge.unlocked) {
        this.drawRRect(ctx, bx, by, badgeSize, badgeSize, 8, c.primaryGreen)
        ctx.setStrokeStyle(c.border)
        ctx.setLineWidth(4)
        ctx.stroke()
        ctx.setFontSize(32)
        ctx.setFillStyle(c.textLight)
        ctx.setTextAlign('center')
        ctx.fillText(badge.emoji, bx + badgeSize / 2, by + badgeSize / 2 + 12)
      } else {
        this.drawRRect(ctx, bx, by, badgeSize, badgeSize, 8, c.bgSurfaceDark)
        ctx.setStrokeStyle(c.border)
        ctx.setLineWidth(4)
        ctx.stroke()
        ctx.setFontSize(28)
        ctx.setFillStyle(c.textSecondary)
        ctx.setTextAlign('center')
        ctx.fillText('🔒', bx + badgeSize / 2, by + badgeSize / 2 + 10)
      }
    })

    if (allBadges.length > maxShow) {
      ctx.setFontSize(24)
      ctx.setFillStyle(c.textSecondary)
      ctx.setTextAlign('left')
      ctx.fillText('+' + (allBadges.length - maxShow), x + maxShow * (badgeSize + badgeGap), badgesY + 44)
    }
  },

  /**
   * 滑手数据卡片
   */
  _drawProgressCard(ctx, startY, c, data, offsetX, W) {
    const { ollie, stats } = data
    const x = Math.max(24 + offsetX, 24)
    const cardW = Math.min(W - 48, W - offsetX - 48)
    const r = c.cardRadius

    this.drawRRect(ctx, x, startY, cardW, 160, r, c.bgCard)
    ctx.setStrokeStyle(c.border)
    ctx.setLineWidth(4)
    ctx.stroke()

    ctx.setFontSize(32)
    ctx.setFillStyle(c.textPrimary)
    ctx.setTextAlign('left')
    ctx.fillText('滑手数据', x + 24, startY + 40)

    ctx.setFontSize(36)
    ctx.setFillStyle(c.primaryYellow)
    ctx.fillText('Ollie ' + (ollie.normal || 0) + ' 立', x + 24, startY + 80)
    ctx.setFontSize(24)
    ctx.setFillStyle(c.primaryCyan)
    ctx.fillText('Switch ' + (ollie.switch || 0) + ' 立', x + 240, startY + 80)

    // 三个统计
    const statsData = [
      { label: '一脚一个', value: stats.masteredCount || 0, color: c.primaryGreen },
      { label: '死磕中', value: stats.grindingCount || 0, color: c.primaryOrange },
      { label: '体验卡', value: stats.trialCount || 0, color: c.primaryCyan }
    ]
    const statW = (cardW - 48) / 3

    statsData.forEach((s, i) => {
      const sx = x + 24 + i * statW
      ctx.setFontSize(36)
      ctx.setFillStyle(s.color)
      ctx.setTextAlign('left')
      ctx.fillText(s.value, sx, startY + 128)
      ctx.setFontSize(24)
      ctx.setFillStyle(c.textSecondary)
      ctx.fillText(s.label, sx, startY + 152)
    })
  },

  /**
   * 成招记录卡片（游戏场景风格）
   */
  _drawTimelineCard(ctx, startY, c, data, offsetX, W) {
    const { timeline } = data
    const x = Math.max(24 + offsetX, 24)
    const cardW = Math.min(W - 48, W - offsetX - 48)
    const r = c.cardRadius
    const sceneH = 360

    // 天空
    ctx.setFillStyle(c.sceneSkyStart)
    ctx.fillRect(x, startY, cardW, sceneH * 0.55)
    // 草地
    ctx.setFillStyle(c.sceneGroundStart)
    ctx.fillRect(x, startY + sceneH * 0.55, cardW, sceneH * 0.3)
    // 土壤
    ctx.setFillStyle(c.sceneSoilStart)
    ctx.fillRect(x, startY + sceneH * 0.85, cardW, sceneH * 0.15)

    // 草地纹理
    ctx.save()
    ctx.globalAlpha = 0.3
    for (let gx = x; gx < x + cardW; gx += 16) {
      ctx.setFillStyle(c.sceneGroundEnd)
      ctx.fillRect(gx, startY + sceneH * 0.55, 8, 4)
    }
    ctx.restore()

    // 标题
    ctx.setFontSize(32)
    ctx.setFillStyle(c.textLight)
    ctx.setTextAlign('left')
    ctx.fillText('成招记录', x + 24, startY + 36)

    // 起点旗帜
    ctx.setFontSize(40)
    ctx.fillText('🚩', x + 24, startY + 90)
    ctx.setFontSize(18)
    ctx.fillText('起点', x + 28, startY + 110)

    // 时间线节点
    const displayTimeline = (timeline || []).slice(0, 6)
    const nodeStartX = x + 90
    const nodeW = Math.min((cardW - 120) / Math.max(displayTimeline.length, 1), 120)
    const nodeY = startY + 60

    displayTimeline.forEach((item, i) => {
      const nx = nodeStartX + i * nodeW
      const blockSize = Math.min(nodeW - 8, 80)

      // 方块背景
      this._drawBlock(ctx, nx + 4, nodeY, blockSize, blockSize, c.sceneCardAccent, c.border)
      ctx.setFontSize(Math.min(blockSize * 0.5, 36))
      ctx.setFillStyle(c.textLight)
      ctx.setTextAlign('center')
      ctx.fillText(item.emoji || '🛹', nx + 4 + blockSize / 2, nodeY + blockSize / 2 + 12)

      // 状态标记
      const star = item.status === 'mastered' ? '⭐' : item.status === 'trial' ? '✨' : '🔥'
      const starColor = item.status === 'mastered' ? c.primaryGreen : item.status === 'trial' ? c.primaryCyan : c.primaryOrange
      ctx.setFontSize(20)
      ctx.setFillStyle(starColor)
      ctx.fillText(star, nx + 4 + blockSize - 4, nodeY + 16)

      // 脚位标签
      const stanceLabel = item.stance === 'normal' ? 'N' : item.stance === 'fakie' ? 'F' : item.stance === 'switch' ? 'S' : 'No'
      ctx.setFontSize(16)
      ctx.setFillStyle(c.textLight)
      ctx.fillText(stanceLabel, nx + 4 + blockSize / 2, nodeY + blockSize + 18)

      // 招式名（最多4字）
      ctx.setFontSize(16)
      ctx.setFillStyle(c.textLight)
      ctx.fillText((item.trickName || '').substring(0, 4), nx + 4 + blockSize / 2, nodeY + blockSize + 36)
    })

    // 终点城堡
    const endX = x + cardW - 80
    ctx.setFontSize(44)
    ctx.fillText('🏰', endX, startY + 90)
    ctx.setFontSize(18)
    ctx.fillText('终点', endX + 4, startY + 110)

    // 云朵
    ctx.setFontSize(32)
    ctx.fillText('☁️', x + 200, startY + 40)
    ctx.fillText('☁️', x + 420, startY + 25)
  },

  /**
   * 打卡墙卡片
   */
  _drawCheckinCard(ctx, startY, c, data, offsetX, W) {
    const { todayChecked, consecutiveDays, totalCheckins, monthCheckins, yearCheckins } = data
    const x = Math.max(24 + offsetX, 24)
    const cardW = Math.min(W - 48, W - offsetX - 48)
    const r = c.cardRadius
    const ip = 28

    this.drawRRect(ctx, x, startY, cardW, 300, r, c.bgCard)
    ctx.setStrokeStyle(c.border)
    ctx.setLineWidth(4)
    ctx.stroke()

    // 标题
    ctx.setFontSize(32)
    ctx.setFillStyle(c.textPrimary)
    ctx.setTextAlign('left')
    ctx.fillText('滑板打卡', x + ip, startY + 40)

    // 连续打卡徽章
    this._drawTag(ctx, x + cardW - 160, startY + 20, 136, 40, '🔥 ' + consecutiveDays + ' 天', c.primaryOrange, c.textLight)

    // 游戏场景
    const sceneY = startY + 80
    const sceneH = 140
    const sx = x + 16
    const sw = cardW - 32

    ctx.setFillStyle(c.sceneSkyStart)
    ctx.fillRect(sx, sceneY, sw, sceneH * 0.6)
    ctx.setFillStyle(c.sceneGroundStart)
    ctx.fillRect(sx, sceneY + sceneH * 0.6, sw, sceneH * 0.25)
    ctx.setFillStyle(c.sceneSoilStart)
    ctx.fillRect(sx, sceneY + sceneH * 0.85, sw, sceneH * 0.15)

    // 云
    ctx.setFontSize(32)
    ctx.fillText('☁️', sx + 30, sceneY + 28)

    // 滑板小人
    ctx.setFontSize(44)
    ctx.fillText('🛹', sx + sw - 60, sceneY + sceneH * 0.5)

    // 打卡按钮
    const btnY = sceneY + sceneH + 12
    const btnW = cardW - 32
    const btnColor = todayChecked ? c.bgSurface : c.primaryGreen
    const btnText = todayChecked ? '✓ 今日已打卡' : '🎯 今日打卡'
    this._drawRoundBtn(ctx, x + 16, btnY, btnW, 48, btnColor, c.border, 4)
    ctx.setFontSize(28)
    ctx.setFillStyle(todayChecked ? c.textSecondary : c.textLight)
    ctx.setTextAlign('center')
    ctx.fillText(btnText, x + 16 + btnW / 2, btnY + 32)

    // 三个统计
    const statsY = btnY + 56
    const statsData = [
      { label: '本月', value: monthCheckins },
      { label: '今年', value: yearCheckins },
      { label: '总计', value: totalCheckins }
    ]
    const statW = (cardW - 48) / 3

    ctx.setTextAlign('center')
    statsData.forEach((s, i) => {
      const ssx = x + 24 + i * statW
      ctx.setFontSize(36)
      ctx.setFillStyle(c.primaryYellow)
      ctx.fillText(s.value, ssx + statW / 2, statsY)
      ctx.setFontSize(24)
      ctx.setFillStyle(c.textSecondary)
      ctx.fillText(s.label, ssx + statW / 2, statsY + 24)
    })
  },

  // ──────────────────────────────── 辅助绘制函数 ────────────────────────────────

  /**
   * 获取主题色（精确版，完全匹配 theme.wxss 变量）
   */
  getThemeColorsV2(themeId) {
    const t = {
      minecraft: {
        bgDark: '#3b2818', bgCard: '#c6c6c6', bgCardLight: '#d8d8d8',
        bgSurface: '#8b8b8b', bgSurfaceDark: '#6b6b6b',
        primaryYellow: '#ffff55', primaryCyan: '#00cccc', primaryOrange: '#ffaa00',
        primaryGreen: '#44dd44',
        border: '#000000',
        textPrimary: '#2a2a2a', textPrimaryDark: '#2a2a2a',
        textSecondary: '#555555', textLight: '#ffffff', textLightSec: '#cccccc',
        sceneSkyStart: '#5c94fc', sceneSkyEnd: '#87ceeb',
        sceneGroundStart: '#5cb85c', sceneGroundEnd: '#4a9f4a',
        sceneSoilStart: '#8b5a2b', sceneSoilEnd: '#6b4423',
        sceneCardAccent: '#e89b3c',
        cardRadius: 0, bgDot: '#4a3520'
      },
      stardew: {
        bgDark: '#f3e7c5', bgCard: '#fff8e7', bgCardLight: '#fffdf4',
        bgSurface: '#d6b98b', bgSurfaceDark: '#c4a16c',
        primaryYellow: '#f4d27a', primaryCyan: '#75b7c9', primaryOrange: '#d88b4d',
        primaryGreen: '#7ba05b',
        border: '#6e4a2c',
        textPrimary: '#4e3620', textPrimaryDark: '#4e3620',
        textSecondary: '#7b6041', textLight: '#fff9ed', textLightSec: '#f7e8c7',
        sceneSkyStart: '#c3ebff', sceneSkyEnd: '#f9efd6',
        sceneGroundStart: '#97bf6e', sceneGroundEnd: '#749c4e',
        sceneSoilStart: '#d8b883', sceneSoilEnd: '#b88e5e',
        sceneCardAccent: '#c98a52',
        cardRadius: 26, bgDot: '#c4a060'
      },
      terraria: {
        bgDark: '#1f2b1f', bgCard: '#465a46', bgCardLight: '#567056',
        bgSurface: '#304330', bgSurfaceDark: '#233223',
        primaryYellow: '#f3d25b', primaryCyan: '#66c8d7', primaryOrange: '#d88941',
        primaryGreen: '#61b05f',
        border: '#182518',
        textPrimary: '#eef5df', textPrimaryDark: '#102010',
        textSecondary: '#c2d2b8', textLight: '#f7ffe8', textLightSec: '#dce9cf',
        sceneSkyStart: '#6fa7d6', sceneSkyEnd: '#bfe8ff',
        sceneGroundStart: '#65ad54', sceneGroundEnd: '#4f8f42',
        sceneSoilStart: '#7c5a39', sceneSoilEnd: '#5d4028',
        sceneCardAccent: '#9d7f42',
        cardRadius: 18, bgDot: '#1a2e1a'
      }
    }
    return t[themeId] || t.minecraft
  },

  /**
   * 绘制圆角矩形（填充）
   */
  drawRRect(ctx, x, y, w, h, r, fillColor) {
    r = Math.min(r, w / 2, h / 2)
    ctx.setFillStyle(fillColor)
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
    ctx.fill()
  },

  /**
   * 绘制头像（带圆角裁剪）
   */
  _drawAvatar(ctx, x, y, w, h, r, avatarPath) {
    ctx.save()
    ctx.beginPath()
    this._rrectPath(ctx, x, y, w, h, r)
    ctx.clip()
    ctx.drawImage(avatarPath, x, y, w, h)
    ctx.restore()
    // 头像边框
    ctx.setStrokeStyle('#000000')
    ctx.setLineWidth(4)
    ctx.stroke()
  },

  /**
   * 绘制标签（药丸形状按钮/标签）
   */
  _drawTag(ctx, x, y, w, h, text, bgColor, textColor) {
    const r = h / 2
    this.drawRRect(ctx, x, y, w, h, r, bgColor)
    ctx.setStrokeStyle('#000000')
    ctx.setLineWidth(3)
    ctx.stroke()
    ctx.setFontSize(24)
    ctx.setFillStyle(textColor)
    ctx.setTextAlign('center')
    ctx.fillText(text, x + w / 2, y + h / 2 + 8)
  },

  /**
   * 绘制游戏场景中的方块
   */
  _drawBlock(ctx, x, y, w, h, fillColor, borderColor) {
    // 主体
    ctx.setFillStyle(fillColor)
    ctx.fillRect(x, y, w, h)
    // 高光（左上）
    ctx.setFillStyle('rgba(255,255,255,0.3)')
    ctx.fillRect(x, y, w, 4)
    ctx.fillRect(x, y, 4, h)
    // 边框
    ctx.setStrokeStyle(borderColor)
    ctx.setLineWidth(4)
    ctx.strokeRect(x, y, w, h)
  },

  /**
   * 绘制圆角按钮
   */
  _drawRoundBtn(ctx, x, y, w, h, fillColor, borderColor, borderW) {
    const r = h / 2
    this.drawRRect(ctx, x, y, w, h, r, fillColor)
    ctx.setStrokeStyle(borderColor)
    ctx.setLineWidth(borderW)
    ctx.stroke()
  },

  /**
   * 圆角矩形路径（内部用）
   */
  _rrectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2)
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
  },

  /**
   * 保存导出图片到相册
   */
  _saveExportImage() {
    wx.canvasToTempFilePath({
      canvasId: 'exportCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading()
            wx.showToast({ title: '图片已保存到相册', icon: 'success' })
          },
          fail: (err) => {
            wx.hideLoading()
            if (err.errMsg && err.errMsg.includes('auth deny')) {
              wx.showToast({ title: '请允许访问相册后重试', icon: 'none' })
            } else {
              wx.showToast({ title: '保存失败，请重试', icon: 'none' })
            }
          }
        })
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({ title: '生成图片失败', icon: 'none' })
        console.error('canvasToTempFilePath failed', err)
      }
    })
  },

  applyThemeState(themeId) {
    const theme = themeId ? themePage.setTheme(this, themeId) : themePage.applyTheme(this)
    this.setData({
      sceneConfig: theme.sceneConfig || {}
    })
    return theme
  },

  /**
   * 切换主题
   */
  onThemeChange(e) {
    const { themeId } = e.currentTarget.dataset

    if (!themeId || themeId === this.data.themeId) {
      return
    }

    const theme = this.applyThemeState(themeId)
    getApp().globalData.theme = theme

    wx.showToast({
      title: `已切换到${theme.name}`,
      icon: 'none',
      duration: 1500
    })
  },

  toggleThemePanel() {
    this.setData({
      themePanelExpanded: !this.data.themePanelExpanded
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
