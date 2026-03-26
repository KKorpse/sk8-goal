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
   * 导出首页图片
   */
  onExportImage() {
    wx.showLoading({ title: '正在生成图片…', mask: true })

    // 等待 WXML 渲染完成后再开始绘制
    setTimeout(() => {
      this.doExportImage()
    }, 100)
  },

  /**
   * 执行导出
   */
  doExportImage() {
    const themeId = this.data.themeId
    const themeColors = this.getThemeColors(themeId)
    const W = 750 // canvas 宽度 px

    // 预计算每个区块的高度，确定总高度
    const content = this.buildExportContent(W)
    const totalHeight = content.totalHeight

    // 更新 canvas 高度
    this.setData({ exportCanvasHeight: totalHeight })

    // 等待 canvas 尺寸更新后再绘制
    setTimeout(() => {
      const ctx = wx.createCanvasContext('exportCanvas')
      this.drawExportPage(ctx, W, totalHeight, themeColors, content)
      ctx.draw(false, () => {
        this.saveExportImage()
      })
    }, 150)
  },

  /**
   * 构建导出内容数据（用于计算高度和绘制）
   */
  buildExportContent(W) {
    const { userInfo, ollie, stats, allBadges, unlockedBadges, timeline, yearsSkating, themeId } = this.data
    const allTricks = require('../../mock/tricks').getAllTricks()
    const trickMap = {}
    allTricks.forEach(t => { trickMap[t.id] = t })

    const records = require('../../services/storageService').getCheckinRecords()
    const today = new Date()
    const todayStr = require('../../services/storageService').formatDate(today)
    const todayChecked = (records[todayStr] && records[todayStr].count) > 0
    const consecutiveDays = require('../../services/storageService').getConsecutiveDays()
    const totalCheckins = Object.keys(records).length

    // 计算月份和年的打卡数
    const monthCheckins = Object.keys(records).filter(d => {
      const dt = new Date(d)
      return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && records[d].count > 0
    }).length
    const yearCheckins = Object.keys(records).filter(d => {
      const dt = new Date(d)
      return dt.getFullYear() === today.getFullYear() && records[d].count > 0
    }).length

    // 预计算每个区块高度
    const PAD = 32
    const CARD_RADIUS = 16
    const FONT_BASE = 28
    const FONT_SM = 24
    const FONT_LG = 32
    const FONT_XL = 36
    const FONT_2XL = 44
    const LINE = FONT_BASE * 1.6

    let y = PAD // 当前纵向偏移

    // ── 顶部留白 ──
    y += 24

    // ── ① 个人信息卡片 ──
    const cardX = PAD
    const cardW = W - PAD * 2
    const cardH = 200
    y += cardH + 24

    // ── ② 滑手数据卡片（Ollie + 统计）──
    y += 160 + 24

    // ── ③ 成招记录 ──
    if (timeline.length > 0) {
      y += 360 + 24
    } else {
      y += 240 + 24
    }

    // ── ④ 打卡墙 ──
    y += 300 + 24

    // ── ⑤ 底部 Footer ──
    y += 80

    const totalHeight = y + PAD + 200 // 底部留白

    return {
      totalHeight,
      cardX, cardW,
      userInfo, ollie, stats, allBadges, unlockedBadges, timeline,
      yearsSkating, themeId, trickMap,
      records, todayStr, todayChecked, consecutiveDays,
      totalCheckins, monthCheckins, yearCheckins,
      PAD, CARD_RADIUS, FONT_BASE, FONT_SM, FONT_LG, FONT_XL, FONT_2XL, LINE,
      W
    }
  },

  /**
   * 获取主题色
   */
  getThemeColors(themeId) {
    const themes = {
      minecraft: {
        bgCard: '#c6c6c6', bgSurface: '#8b8b8b', bgDark: '#3b2818',
        primaryYellow: '#ffff55', primaryCyan: '#00cccc', primaryOrange: '#ffaa00',
        primaryGreen: '#44dd44', border: '#000000',
        textPrimary: '#2a2a2a', textLight: '#ffffff', textSecondary: '#555555',
        textLightSec: '#cccccc',
        sceneSkyStart: '#5c94fc', sceneSkyEnd: '#87ceeb',
        sceneGroundStart: '#5cb85c', sceneGroundEnd: '#4a9f4a',
        sceneSoilStart: '#8b5a2b', sceneSoilEnd: '#6b4423',
        sceneCardAccent: '#e89b3c', sceneCardHighlight: '#f0b860', sceneCardShadow: '#a06020',
        cardRadius: 0
      },
      stardew: {
        bgCard: '#fff8e7', bgSurface: '#d6b98b', bgDark: '#f3e7c5',
        primaryYellow: '#f4d27a', primaryCyan: '#75b7c9', primaryOrange: '#d88b4d',
        primaryGreen: '#7ba05b', border: '#6e4a2c',
        textPrimary: '#4e3620', textLight: '#fff9ed', textSecondary: '#7b6041',
        textLightSec: '#f7e8c7',
        sceneSkyStart: '#c3ebff', sceneSkyEnd: '#f9efd6',
        sceneGroundStart: '#97bf6e', sceneGroundEnd: '#749c4e',
        sceneSoilStart: '#d8b883', sceneSoilEnd: '#b88e5e',
        sceneCardAccent: '#c98a52', sceneCardHighlight: '#e9bf8f', sceneCardShadow: '#9c6337',
        cardRadius: 26
      },
      terraria: {
        bgCard: '#465a46', bgSurface: '#304330', bgDark: '#1f2b1f',
        primaryYellow: '#f3d25b', primaryCyan: '#66c8d7', primaryOrange: '#d88941',
        primaryGreen: '#61b05f', border: '#182518',
        textPrimary: '#eef5df', textLight: '#f7ffe8', textSecondary: '#c2d2b8',
        textLightSec: '#dce9cf',
        sceneSkyStart: '#6fa7d6', sceneSkyEnd: '#bfe8ff',
        sceneGroundStart: '#65ad54', sceneGroundEnd: '#4f8f42',
        sceneSoilStart: '#7c5a39', sceneSoilEnd: '#5d4028',
        sceneCardAccent: '#9d7f42', sceneCardHighlight: '#d1b36c', sceneCardShadow: '#68542b',
        cardRadius: 18
      }
    }
    return themes[themeId] || themes.minecraft
  },

  /**
   * 绘制导出页面
   */
  drawExportPage(ctx, W, totalHeight, c, content) {
    const { PAD, CARD_RADIUS, FONT_BASE, FONT_SM, FONT_LG, FONT_XL, FONT_2XL, LINE } = content

    // ── 背景 ──
    ctx.setFillStyle(c.bgDark)
    ctx.fillRect(0, 0, W, totalHeight)

    // ── 页面标题 ──
    let y = PAD + 16
    ctx.setFontSize(FONT_LG)
    ctx.setFillStyle(c.primaryYellow)
    ctx.setTextAlign('center')
    ctx.fillText('🛹 SkateGoal', W / 2, y)

    y += LINE * 1.5

    // ── ① 个人信息卡片 ──
    y = this.drawExportProfileCard(ctx, y, c, content)

    // ── ② 滑手数据卡片 ──
    y = this.drawExportProgressCard(ctx, y, c, content)

    // ── ③ 成招记录 ──
    if (content.timeline.length > 0) {
      y = this.drawExportTimeline(ctx, y, c, content)
    }

    // ── ④ 打卡墙 ──
    y = this.drawExportCheckinWall(ctx, y, c, content)

    // ── ⑤ 底部 ──
    ctx.setFontSize(FONT_SM)
    ctx.setFillStyle(c.textLightSec)
    ctx.setTextAlign('center')
    ctx.fillText('Made with 🛹 by Korpse  ·  v1.0.0', W / 2, y + 40)
  },

  /**
   * 绘制个人信息卡片
   */
  drawExportProfileCard(ctx, y, c, content) {
    const { cardX, cardW, userInfo, ollie, stats, allBadges, unlockedBadges, yearsSkating,
      PAD, FONT_BASE, FONT_SM, FONT_LG, FONT_XL, LINE } = content
    const cardH = 200
    const r = c.cardRadius

    // 卡片背景
    this.drawRoundedRect(ctx, cardX, y, cardW, cardH, r, c.bgCard, c.border, 4)

    const innerPad = 24
    let cx = cardX + innerPad
    let cy = y + innerPad

    // 头像占位
    ctx.setFillStyle(c.bgSurface)
    this.roundRect(ctx, cx, cy, 100, 100, 8, c.bgSurface)
    ctx.fill()
    ctx.setFontSize(56)
    ctx.setTextAlign('center')
    ctx.setFillStyle(c.textPrimary)
    const avatarIcon = this.data.sceneConfig.avatarIcon || '🛹'
    ctx.fillText(avatarIcon, cx + 50, cy + 72)

    cx += 120

    // 昵称
    ctx.setFontSize(FONT_XL)
    ctx.setFillStyle(c.textPrimary)
    ctx.setTextAlign('left')
    ctx.fillText(userInfo.nickname || '滑板玩家', cx, cy + 36)

    // ID
    cy += 48
    ctx.setFontSize(FONT_SM)
    ctx.setFillStyle(c.textSecondary)
    ctx.fillText('ID: ' + (userInfo.id || '—'), cx, cy)

    // 右侧标签：脚位 + 板龄
    const rx = cardX + cardW - innerPad
    ctx.setFontSize(FONT_SM)
    ctx.setTextAlign('right')

    ctx.setFillStyle(c.bgSurface)
    this.roundRect(ctx, rx - 130, y + innerPad, 130, 40, 8, c.bgSurface)
    ctx.fill()
    ctx.setFillStyle(c.textPrimary)
    ctx.fillText('脚位 ' + (userInfo.stance === 'regular' ? 'Regular' : 'Goofy'), rx, y + innerPad + 28)

    ctx.setFillStyle(c.bgSurface)
    this.roundRect(ctx, rx - 100, y + innerPad + 52, 100, 40, 8, c.bgSurface)
    ctx.fill()
    ctx.setFillStyle(c.textPrimary)
    ctx.fillText('板龄 ' + yearsSkating + ' 年', rx, y + innerPad + 80)

    // Ollie 高度（主卡片右下）
    ctx.setFontSize(FONT_SM)
    ctx.setFillStyle(c.bgSurface)
    this.roundRect(ctx, cardX + innerPad, y + cardH - innerPad - 40, 200, 40, 8, c.bgSurface)
    ctx.fill()
    ctx.setTextAlign('left')
    ctx.setFillStyle(c.primaryYellow)
    ctx.fillText('Ollie ' + (ollie.normal || 0) + ' / ' + (ollie.switch || 0) + ' 立', cardX + innerPad + 16, y + cardH - innerPad - 12)

    // 成就徽章
    const badgesY = y + cardH + 12
    ctx.setFontSize(FONT_SM)
    ctx.setFillStyle(c.textSecondary)
    ctx.setTextAlign('left')
    ctx.fillText('成就徽章 ' + unlockedBadges.length + '/' + allBadges.length, cardX, badgesY)

    const badgeStartX = cardX
    const badgeSize = 52
    const badgeGap = 16
    const maxBadges = 8
    const displayBadges = allBadges.slice(0, maxBadges)

    displayBadges.forEach((badge, i) => {
      const bx = badgeStartX + i * (badgeSize + badgeGap)
      const by = badgesY + 12

      if (badge.unlocked) {
        this.roundRect(ctx, bx, by, badgeSize, badgeSize, 8, c.primaryGreen)
        ctx.fill()
        ctx.setFontSize(32)
        ctx.setTextAlign('center')
        ctx.setFillStyle(c.textLight)
        ctx.fillText(badge.emoji, bx + badgeSize / 2, by + badgeSize / 2 + 12)
      } else {
        this.roundRect(ctx, bx, by, badgeSize, badgeSize, 8, c.bgSurface)
        ctx.fill()
        ctx.setFontSize(28)
        ctx.setTextAlign('center')
        ctx.setFillStyle(c.textSecondary)
        ctx.fillText('🔒', bx + badgeSize / 2, by + badgeSize / 2 + 10)
      }
    })

    if (allBadges.length > maxBadges) {
      ctx.setFontSize(FONT_SM)
      ctx.setFillStyle(c.textSecondary)
      ctx.fillText('+' + (allBadges.length - maxBadges), badgeStartX + maxBadges * (badgeSize + badgeGap) + 8, badgesY + 42)
    }

    return badgesY + badgeSize + 12 + 24
  },

  /**
   * 绘制滑手数据卡片（Ollie + 统计）
   */
  drawExportProgressCard(ctx, y, c, content) {
    const { cardX, cardW, ollie, stats, FONT_BASE, FONT_SM, FONT_LG, FONT_XL, LINE, PAD } = content
    const cardH = 160
    const r = c.cardRadius

    this.drawRoundedRect(ctx, cardX, y, cardW, cardH, r, c.bgCard, c.border, 4)

    // 标题
    ctx.setFontSize(FONT_LG)
    ctx.setFillStyle(c.textPrimary)
    ctx.setTextAlign('left')
    ctx.fillText('滑手数据', cardX + 24, y + 40)

    // Ollie 主高度
    ctx.setFontSize(FONT_XL)
    ctx.setFillStyle(c.primaryYellow)
    ctx.fillText('Ollie ' + (ollie.normal || 0) + ' 立', cardX + 24, y + 80)
    ctx.setFontSize(FONT_SM)
    ctx.setFillStyle(c.primaryCyan)
    ctx.fillText('Switch ' + (ollie.switch || 0) + ' 立', cardX + 200, y + 80)

    // 三个统计
    const statY = y + 110
    const statsData = [
      { label: '一脚一个', value: stats.masteredCount || 0, color: c.primaryGreen },
      { label: '死磕中', value: stats.grindingCount || 0, color: c.primaryOrange },
      { label: '体验卡', value: stats.trialCount || 0, color: c.primaryCyan }
    ]

    const statStartX = cardX + 24
    const statW = (cardW - 48) / 3

    statsData.forEach((s, i) => {
      const sx = statStartX + i * statW
      ctx.setFontSize(FONT_XL)
      ctx.setFillStyle(s.color)
      ctx.setTextAlign('left')
      ctx.fillText(s.value, sx, statY)
      ctx.setFontSize(FONT_SM)
      ctx.setFillStyle(c.textSecondary)
      ctx.fillText(s.label, sx, statY + 24)
    })

    return y + cardH + 24
  },

  /**
   * 绘制成招记录时间线
   */
  drawExportTimeline(ctx, y, c, content) {
    const { cardX, cardW, timeline, FONT_BASE, FONT_SM, FONT_LG, FONT_XL, LINE } = content
    const sceneH = 360
    const r = c.cardRadius

    // 游戏风格背景
    const skyH = sceneH * 0.55
    ctx.setFillStyle(c.sceneSkyStart)
    ctx.fillRect(cardX, y, cardW, skyH)

    // 渐变到地面
    ctx.setFillStyle(c.sceneGroundStart)
    ctx.fillRect(cardX, y + skyH, cardW, sceneH - skyH)

    // 地面纹理
    ctx.setFillStyle(c.sceneGroundEnd)
    for (let i = 0; i < cardW; i += 16) {
      ctx.fillRect(cardX + i, y + skyH, 8, 4)
    }

    // 土壤
    ctx.setFillStyle(c.sceneSoilStart)
    ctx.fillRect(cardX, y + sceneH - 48, cardW, 48)
    ctx.setFillStyle(c.sceneSoilEnd)
    for (let i = 0; i < cardW; i += 16) {
      ctx.fillRect(cardX + i, y + sceneH - 48, 8, 48)
    }

    // 标题
    ctx.setFontSize(FONT_LG)
    ctx.setFillStyle(c.textLight)
    ctx.setTextAlign('left')
    ctx.fillText('成招记录', cardX + 24, y + 36)

    // 起点旗帜
    ctx.setFontSize(36)
    ctx.fillText('🚩', cardX + 24, y + 80)

    // 时间线节点（最多显示6个）
    const displayTimeline = timeline.slice(0, 6)
    const nodeStartX = cardX + 80
    const nodeW = 100
    const nodeY = y + 60

    displayTimeline.forEach((item, i) => {
      const nx = nodeStartX + i * nodeW

      // 节点方块
      this.drawRoundedRect(ctx, nx, nodeY, 72, 72, 8, c.sceneCardAccent, c.border, 4)
      ctx.setFontSize(36)
      ctx.setTextAlign('center')
      ctx.setFillStyle(c.textLight)
      ctx.fillText(item.emoji || '🛹', nx + 36, nodeY + 48)

      // 状态星标
      const starColor = item.status === 'mastered' ? c.primaryGreen
        : item.status === 'trial' ? c.primaryCyan
        : c.primaryOrange
      ctx.setFontSize(20)
      ctx.fillText(item.status === 'mastered' ? '⭐' : item.status === 'trial' ? '✨' : '🔥', nx + 60, nodeY + 20)

      // 脚位标签
      ctx.setFontSize(18)
      ctx.setFillStyle(c.textLight)
      ctx.fillText(item.stance === 'normal' ? 'N' : item.stance === 'fakie' ? 'F' : item.stance === 'switch' ? 'S' : 'No', nx + 36, nodeY + 96)

      // 招式名
      ctx.setFontSize(16)
      ctx.setFillStyle(c.textLight)
      const name = (item.trickName || '').substring(0, 6)
      ctx.fillText(name, nx + 36, nodeY + 116)
    })

    // 终点城堡
    ctx.setFontSize(40)
    ctx.setTextAlign('left')
    ctx.fillText('🏰', cardX + cardW - 80, y + 100)

    // 云朵装饰
    ctx.setFontSize(28)
    ctx.fillText('☁️', cardX + 200, y + 50)
    ctx.fillText('☁️', cardX + 450, y + 30)

    return y + sceneH + 24
  },

  /**
   * 绘制打卡墙
   */
  drawExportCheckinWall(ctx, y, c, content) {
    const { cardX, cardW, consecutiveDays, todayChecked, totalCheckins, monthCheckins, yearCheckins,
      FONT_BASE, FONT_SM, FONT_LG, FONT_XL, LINE } = content
    const cardH = 300
    const r = c.cardRadius

    this.drawRoundedRect(ctx, cardX, y, cardW, cardH, r, c.bgCard, c.border, 4)

    // 标题
    ctx.setFontSize(FONT_LG)
    ctx.setFillStyle(c.textPrimary)
    ctx.setTextAlign('left')
    ctx.fillText('滑板打卡', cardX + 24, y + 36)

    // 连续打卡徽章
    ctx.setFillStyle(c.primaryOrange)
    this.roundRect(ctx, cardX + cardW - 160, y + 18, 136, 40, 8, c.primaryOrange)
    ctx.fill()
    ctx.setFontSize(FONT_SM)
    ctx.setTextAlign('center')
    ctx.setFillStyle(c.textLight)
    ctx.fillText('🔥 ' + consecutiveDays + ' 天', cardX + cardW - 92, y + 45)

    // 游戏场景背景
    const sceneY = y + 68
    const sceneH = 140

    // 天空
    ctx.setFillStyle(c.sceneSkyStart)
    ctx.fillRect(cardX + 16, sceneY, cardW - 32, sceneH * 0.6)

    // 地面
    ctx.setFillStyle(c.sceneGroundStart)
    ctx.fillRect(cardX + 16, sceneY + sceneH * 0.6, cardW - 32, sceneH * 0.25)

    // 土壤
    ctx.setFillStyle(c.sceneSoilStart)
    ctx.fillRect(cardX + 16, sceneY + sceneH * 0.85, cardW - 32, sceneH * 0.15)

    // 滑板小人
    ctx.setFontSize(40)
    ctx.setTextAlign('right')
    ctx.fillText('🛹', cardX + cardW - 40, sceneY + sceneH * 0.55)

    // 云
    ctx.setFontSize(28)
    ctx.setTextAlign('left')
    ctx.fillText('☁️', cardX + 40, sceneY + 30)

    // 打卡按钮（简化）
    const btnY = sceneY + sceneH + 12
    const btnW = cardW - 32
    ctx.setFillStyle(todayChecked ? c.bgSurface : c.primaryGreen)
    this.roundRect(ctx, cardX + 16, btnY, btnW, 48, 24, todayChecked ? c.bgSurface : c.primaryGreen)
    ctx.fill()
    ctx.setFontSize(FONT_BASE)
    ctx.setTextAlign('center')
    ctx.setFillStyle(todayChecked ? c.textSecondary : c.textLight)
    ctx.fillText(todayChecked ? '✓ 今日已打卡' : '🎯 今日打卡', cardX + cardW / 2, btnY + 32)

    // 统计
    const statsY = btnY + 56
    const statsData = [
      { label: '本月', value: monthCheckins },
      { label: '今年', value: yearCheckins },
      { label: '总计', value: totalCheckins }
    ]
    const statW = (cardW - 48) / 3

    ctx.setTextAlign('center')
    statsData.forEach((s, i) => {
      const sx = cardX + 24 + i * statW
      ctx.setFontSize(FONT_XL)
      ctx.setFillStyle(c.primaryYellow)
      ctx.fillText(s.value, sx + statW / 2, statsY)
      ctx.setFontSize(FONT_SM)
      ctx.setFillStyle(c.textSecondary)
      ctx.fillText(s.label, sx + statW / 2, statsY + 24)
    })

    return y + cardH + 24
  },

  // ==================== 绘制辅助函数 ====================

  /**
   * 绘制圆角矩形（填充 + 边框）
   */
  drawRoundedRect(ctx, x, y, w, h, r, fillColor, strokeColor, strokeWidth) {
    ctx.setFillStyle(fillColor)
    ctx.beginPath()
    this._roundRectPath(ctx, x, y, w, h, r)
    ctx.closePath()
    ctx.fill()
    if (strokeColor && strokeWidth) {
      ctx.setStrokeStyle(strokeColor)
      ctx.setLineWidth(strokeWidth)
      ctx.stroke()
    }
  },

  /**
   * 圆角矩形路径
   */
  _roundRectPath(ctx, x, y, w, h, r) {
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
   * 填充圆角矩形（快捷方法）
   */
  roundRect(ctx, x, y, w, h, r, fillColor) {
    ctx.beginPath()
    this._roundRectPath(ctx, x, y, w, h, r)
    ctx.closePath()
    ctx.setFillStyle(fillColor)
    ctx.fill()
  },

  /**
   * 保存导出图片到相册
   */
  saveExportImage() {
    const canvasId = 'exportCanvas'
    wx.canvasToTempFilePath({
      canvasId,
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
