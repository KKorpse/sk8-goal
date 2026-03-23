/**
 * 滑板历史页面
 */
const themePage = require('../../utils/themePage')

Page({
  data: {
    periods: [],      // 区间列表（按时间倒序）
    yearsSkating: 0,
    showModal: false,
    showActionMenu: false,  // 操作菜单
    selectedPeriod: null,   // 选中的区间
    selectedDate: '',
    today: '',
    dateRangeStart: '1990-01-01',
    dateRangeEnd: '',
    editingNode: null,
    editingIndex: -1,
    isSkating: false, // 当前是否正在滑板
    actionType: 'start', // 按钮状态：'start' | 'pause'
    themeId: '',
    themeClass: '',
    themeMeta: {},
    themeOptions: []
  },

  onLoad() {
    themePage.applyTheme(this)
    this.initToday()
    this.loadData()
  },

  onShow() {
    themePage.applyTheme(this)
    this.loadData()
  },

  /**
   * 初始化今天的日期
   */
  initToday() {
    const now = new Date()
    const today = this.formatDate(now)
    this.setData({ today, selectedDate: today, dateRangeEnd: today })
  },

  /**
   * 格式化日期
   */
  formatDate(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  },

  /**
   * 格式化简短日期（月.日）
   */
  formatShortDate(timestamp) {
    const date = new Date(timestamp)
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${m}.${d}`
  },

  /**
   * 格式化完整日期（年.月.日）
   */
  formatFullDate(timestamp) {
    const date = new Date(timestamp)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}.${m}.${d}`
  },

  /**
   * 加载数据
   */
  loadData() {
    const history = wx.getStorageSync('skating_history') || []

    // 按时间顺序排序（从早到晚）
    const chronological = [...history].sort((a, b) => a.timestamp - b.timestamp)

    // 验证并修复数据：确保以 start 开始，且 start 和 pause 交替
    const validatedHistory = this.validateAndFixHistory(chronological)

    // 判断当前是否正在滑板（最后一个节点是 start）
    const lastNode = validatedHistory[validatedHistory.length - 1]
    const isSkating = lastNode && lastNode.type === 'start'

    // 计算区间数据
    const periods = this.calculatePeriods(validatedHistory)

    // 计算总滑板年数
    const totalSkatingMs = periods
      .filter(p => p.type === 'skating')
      .reduce((sum, p) => sum + p.duration, 0)
    const yearsSkating = Math.round(totalSkatingMs / (365.25 * 24 * 60 * 60 * 1000) * 10) / 10

    this.setData({
      periods,
      yearsSkating,
      isSkating,
      actionType: isSkating ? 'pause' : 'start',
      dateRangeEnd: this.data.today
    })
  },

  /**
   * 验证并修复历史数据
   * 确保以 start 开始，且 start 和 pause 交替
   */
  validateAndFixHistory(history) {
    if (history.length === 0) return []

    const fixed = []
    let expectedType = 'start' // 第一个节点必须是 start

    for (const node of history) {
      if (node.type === expectedType) {
        fixed.push(node)
        expectedType = expectedType === 'start' ? 'pause' : 'start'
      }
      // 如果类型不对，跳过这个节点
    }

    // 如果保存了修正后的数据，更新存储
    if (fixed.length !== history.length) {
      wx.setStorageSync('skating_history', fixed)
    }

    return fixed
  },

  /**
   * 计算时间段区间
   */
  calculatePeriods(history) {
    if (history.length === 0) return []

    const now = Date.now()
    const periods = []
    let currentStart = null
    let lastPause = null

    history.forEach((node) => {
      if (node.type === 'start') {
        currentStart = node
      } else if (node.type === 'pause' && currentStart !== null) {
        // 添加滑板期间
        periods.push({
          id: `skating_${currentStart.timestamp}`,
          type: 'skating',
          startTimestamp: currentStart.timestamp,
          endTimestamp: node.timestamp,
          startDate: this.formatFullDate(currentStart.timestamp),
          endDate: this.formatFullDate(node.timestamp),
          duration: node.timestamp - currentStart.timestamp,
          durationText: this.formatDuration(node.timestamp - currentStart.timestamp),
          days: Math.ceil((node.timestamp - currentStart.timestamp) / (24 * 60 * 60 * 1000)),
          startId: currentStart.id,
          endId: node.id,
          isCurrent: false
        })
        lastPause = node
        currentStart = null
      }
    })

    // 如果最后一个节点是 start，添加当前进行中的滑板期间
    if (currentStart !== null) {
      periods.push({
        id: `skating_${currentStart.timestamp}`,
        type: 'skating',
        startTimestamp: currentStart.timestamp,
        endTimestamp: now,
        startDate: this.formatFullDate(currentStart.timestamp),
        endDate: this.formatFullDate(now),
        duration: now - currentStart.timestamp,
        durationText: this.formatDuration(now - currentStart.timestamp),
        days: Math.ceil((now - currentStart.timestamp) / (24 * 60 * 60 * 1000)),
        startId: currentStart.id,
        endId: null,
        isCurrent: true
      })
    }

    // 计算暂停期间（在滑板期间之间）
    const allPeriods = []
    for (let i = 0; i < periods.length; i++) {
      // 添加滑板期间
      allPeriods.push(periods[i])
      
      // 如果不是最后一个滑板期间，计算到下一个滑板期间开始的暂停时间
      if (i < periods.length - 1) {
        const pauseStart = periods[i].endTimestamp
        const pauseEnd = periods[i + 1].startTimestamp
        if (pauseEnd > pauseStart) {
          allPeriods.push({
            id: `pause_${pauseStart}`,
            type: 'pause',
            startTimestamp: pauseStart,
            endTimestamp: pauseEnd,
            startDate: this.formatFullDate(pauseStart),
            endDate: this.formatFullDate(pauseEnd),
            duration: pauseEnd - pauseStart,
            durationText: this.formatDuration(pauseEnd - pauseStart),
            days: Math.ceil((pauseEnd - pauseStart) / (24 * 60 * 60 * 1000)),
            startId: periods[i].endId,
            endId: periods[i + 1].startId,
            isCurrent: false
          })
        }
      }
    }

    // 如果最后一个节点是 pause，添加当前冻结期间（从最后一个 pause 到现在）
    if (lastPause && !currentStart) {
      allPeriods.push({
        id: `pause_${lastPause.timestamp}`,
        type: 'pause',
        startTimestamp: lastPause.timestamp,
        endTimestamp: now,
        startDate: this.formatFullDate(lastPause.timestamp),
        endDate: this.formatFullDate(now),
        duration: now - lastPause.timestamp,
        durationText: this.formatDuration(now - lastPause.timestamp),
        days: Math.ceil((now - lastPause.timestamp) / (24 * 60 * 60 * 1000)),
        startId: lastPause.id,
        endId: null,
        isCurrent: true
      })
    }

    // 按时间倒序排列（最新的在前）
    return allPeriods.sort((a, b) => b.startTimestamp - a.startTimestamp)
  },

  /**
   * 格式化持续时间
   */
  formatDuration(ms) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000))
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years > 0) {
      const remainMonths = Math.floor((days % 365) / 30)
      return remainMonths > 0 ? `${years}年${remainMonths}个月` : `${years}年`
    } else if (months > 0) {
      return `${months}个月`
    } else if (days > 0) {
      return `${days}天`
    } else {
      return '不到1天'
    }
  },

  /**
   * 切换滑板状态（开始/暂停）
   */
  toggleSkating() {
    const { actionType, today } = this.data

    // 新增模式：设置日期范围
    // start 只能在最后一个 pause 之后（如果有），pause 只能在最后一个 start 之后
    const history = wx.getStorageSync('skating_history') || []
    const chronological = [...history].sort((a, b) => a.timestamp - b.timestamp)

    let dateRangeStart = '1990-01-01'
    let dateRangeEnd = today

    if (actionType === 'pause' && chronological.length > 0) {
      // pause 必须在最后一个 start 之后
      const lastStart = [...chronological].reverse().find(n => n.type === 'start')
      if (lastStart) {
        dateRangeStart = this.formatDate(new Date(lastStart.timestamp))
      }
    } else if (actionType === 'start' && chronological.length > 0) {
      // start 必须在最后一个 pause 之后
      const lastPause = [...chronological].reverse().find(n => n.type === 'pause')
      if (lastPause) {
        dateRangeStart = this.formatDate(new Date(lastPause.timestamp))
      }
    }

    this.setData({
      showModal: true,
      selectedDate: today,
      editingNode: null,
      editingIndex: -1,
      dateRangeStart,
      dateRangeEnd
    })
  },

  /**
   * 日期选择
   */
  onDateChange(e) {
    this.setData({ selectedDate: e.detail.value })
  },

  /**
   * 关闭弹窗
   */
  closeModal() {
    this.setData({ showModal: false })
  },

  /**
   * 阻止冒泡
   */
  preventClose() {},

  /**
   * 确认添加/编辑节点
   */
  confirmNode() {
    const { selectedDate, actionType, editingNode, editingIndex, dateRangeStart, dateRangeEnd } = this.data
    const history = wx.getStorageSync('skating_history') || []

    // 解析日期
    const [y, m, d] = selectedDate.split('-').map(Number)
    const timestamp = new Date(y, m - 1, d).getTime()

    // 验证日期范围
    const rangeStart = new Date(dateRangeStart).getTime()
    const rangeEnd = new Date(dateRangeEnd).getTime()

    if (timestamp < rangeStart || timestamp > rangeEnd) {
      wx.showToast({
        title: '开始和暂停滑板不能在同一天',
        icon: 'none'
      })
      return
    }

    if (editingNode) {
      // 编辑模式
      history[editingIndex].timestamp = timestamp
      history[editingIndex].date = selectedDate
    } else {
      // 新增模式
      const newNode = {
        id: `node_${Date.now()}`,
        type: actionType,
        timestamp,
        date: selectedDate
      }

      history.push(newNode)
    }

    // 保存并刷新
    wx.setStorageSync('skating_history', history)
    this.setData({ showModal: false })
    this.loadData()

    wx.showToast({
      title: editingNode ? '已更新' : (actionType === 'start' ? '开始滑板' : '暂停滑板'),
      icon: 'success'
    })
  },

  /**
   * 显示操作菜单
   */
  showPeriodMenu(e) {
    const { id, endId, type } = e.currentTarget.dataset
    this.setData({
      showActionMenu: true,
      selectedPeriod: { startId: id, endId, type }
    })
  },

  /**
   * 关闭操作菜单
   */
  closeActionMenu() {
    this.setData({ showActionMenu: false })
  },

  /**
   * 编辑区间
   */
  editPeriod() {
    const { selectedPeriod } = this.data
    if (!selectedPeriod) return

    const { startId } = selectedPeriod
    const history = wx.getStorageSync('skating_history') || []
    const chronological = [...history].sort((a, b) => a.timestamp - b.timestamp)
    const nodeIndex = chronological.findIndex(h => h.id === startId)
    const node = chronological[nodeIndex]

    if (node) {
      const date = new Date(node.timestamp)

      // 计算可编辑的日期范围
      let dateRangeStart = '1990-01-01'
      let dateRangeEnd = this.data.today

      if (node.type === 'start') {
        // start 节点：必须在上一个 pause 之后，下一个 pause 之前（如果有）
        if (nodeIndex > 0) {
          const prevNode = chronological[nodeIndex - 1]
          if (prevNode.type === 'pause') {
            dateRangeStart = this.formatDate(new Date(prevNode.timestamp))
          }
        }
        // 找下一个 pause
        const nextPause = chronological.slice(nodeIndex + 1).find(n => n.type === 'pause')
        if (nextPause) {
          dateRangeEnd = this.formatDate(new Date(nextPause.timestamp))
        }
      } else {
        // pause 节点：必须在上一个 start 之后，下一个 start 之前（如果有）
        if (nodeIndex > 0) {
          const prevNode = chronological[nodeIndex - 1]
          if (prevNode.type === 'start') {
            dateRangeStart = this.formatDate(new Date(prevNode.timestamp))
          }
        }
        // 找下一个 start
        const nextStart = chronological.slice(nodeIndex + 1).find(n => n.type === 'start')
        if (nextStart) {
          dateRangeEnd = this.formatDate(new Date(nextStart.timestamp))
        }
      }

      this.setData({
        showActionMenu: false,
        showModal: true,
        selectedDate: this.formatDate(date),
        editingNode: node,
        editingIndex: history.findIndex(h => h.id === startId),
        dateRangeStart,
        dateRangeEnd
      })
    }
  },

  /**
   * 删除区间
   * 删除中间节点时，会删除相邻的两个节点（一个start和一个pause）
   */
  deletePeriod() {
    const { selectedPeriod } = this.data
    if (!selectedPeriod) return

    const { startId, endId, type } = selectedPeriod
    const history = wx.getStorageSync('skating_history') || []

    // 找到要删除的节点
    const chronological = [...history].sort((a, b) => a.timestamp - b.timestamp)

    // 确定要删除的节点ID列表
    let idsToDelete = []

    if (type === 'skating') {
      // 滑板期间：删除对应的 start 节点
      idsToDelete.push(startId)

      // 如果不是最后一个滑板期间，还需要删除对应的 pause 节点
      if (endId) {
        idsToDelete.push(endId)
      }
    } else {
      // 暂停期间：删除暂停开始节点
      // 暂停期间是在两个滑板期间之间，所以需要删除这个 pause 节点和下一个 start 节点
      const pauseNode = chronological.find(h => h.id === startId)
      if (pauseNode) {
        idsToDelete.push(startId)
        // 找到这个 pause 之后的 start 节点
        const pauseIndex = chronological.findIndex(h => h.id === startId)
        const nextStart = chronological.slice(pauseIndex + 1).find(n => n.type === 'start')
        if (nextStart) {
          idsToDelete.push(nextStart.id)
        }
      }
    }

    // 检查是否是唯一的一个滑板期间（只有2个节点：start + pause）
    if (chronological.length <= 2) {
      wx.showModal({
        title: '确认删除',
        content: '这将清空所有滑板记录，确定要删除吗？',
        success: (res) => {
          if (res.confirm) {
            wx.setStorageSync('skating_history', [])
            this.setData({ showActionMenu: false })
            this.loadData()
            wx.showToast({ title: '已删除', icon: 'success' })
          }
        }
      })
      return
    }

    // 删除节点
    const deleteDesc = idsToDelete.length > 1 
      ? '这将删除连续的两条记录并合并前后时间段，确定要删除吗？' 
      : '删除后无法恢复，确定要删除吗？'

    wx.showModal({
      title: '确认删除',
      content: deleteDesc,
      success: (res) => {
        if (res.confirm) {
          const newHistory = history.filter(h => !idsToDelete.includes(h.id))
          wx.setStorageSync('skating_history', newHistory)
          this.setData({ showActionMenu: false })
          this.loadData()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack()
  }
})
