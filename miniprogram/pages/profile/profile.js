/**
 * 我的页面
 */
const userService = require('../../services/userService')
const trickService = require('../../services/trickService')
const storageService = require('../../services/storageService')

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
    timelineScrollLeft: 9999
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
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
      emoji: trickMap[item.trickId]?.emoji || '🛹'
    }))

    // 计算真实板龄
    const yearsSkating = this.calculateYearsSkating()
    
    // 加载 Ollie 数据
    const ollieData = wx.getStorageSync('ollie_data') || { normal: 0, switch: 0 }
    
    // 获取成就徽章
    const badges = this.getBadges(stats, ollieData)

    this.setData({
      userInfo,
      stats,
      timeline,
      yearsSkating,
      ollie: ollieData,
      allBadges: badges.all,
      unlockedBadges: badges.unlocked,
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
      const wasUnlocked = readStatus[def.id]?.unlocked || false
      const isRead = readStatus[def.id]?.read || false
      
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
    const { index } = e.currentTarget.dataset
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
