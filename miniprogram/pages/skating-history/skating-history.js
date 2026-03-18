/**
 * 滑板历史页面
 */

Page({
  data: {
    history: [],
    yearsSkating: 0,
    showModal: false,
    selectedDate: '',
    today: '',
    editingNode: null,
    editingIndex: -1,
    isSkating: false, // 当前是否正在滑板
    actionType: 'start' // 按钮状态：'start' | 'pause'
  },

  onLoad() {
    this.initToday()
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  /**
   * 初始化今天的日期
   */
  initToday() {
    const now = new Date()
    const today = this.formatDate(now)
    this.setData({ today, selectedDate: today })
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
   * 加载数据
   */
  loadData() {
    const history = wx.getStorageSync('skating_history') || []
    
    // 按时间排序（最新的在前）用于显示
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp)
    
    // 判断当前是否正在滑板（最后一个节点是 start）
    const chronological = [...history].sort((a, b) => a.timestamp - b.timestamp)
    const lastNode = chronological[chronological.length - 1]
    const isSkating = lastNode && lastNode.type === 'start'
    
    // 计算总滑板年数
    const { totalMs, periods } = this.calculateYearsSkating(history)
    const yearsSkating = Math.round(totalMs / (365.25 * 24 * 60 * 60 * 1000) * 10) / 10
    
    // 格式化显示数据，添加持续时间
    const formattedHistory = sortedHistory.map((item, index) => {
      const date = new Date(item.timestamp)
      const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
      
      // 查找该节点对应的时间段
      const period = periods.find(p => 
        (item.type === 'start' && p.startTimestamp === item.timestamp) ||
        (item.type === 'pause' && p.endTimestamp === item.timestamp)
      )
      
      let duration = ''
      if (period) {
        duration = this.formatDuration(period.duration)
      }
      
      return {
        ...item,
        dateStr,
        duration: item.type === 'start' ? duration : '' // 只在 start 节点显示持续时间
      }
    })
    
    this.setData({
      history: formattedHistory,
      yearsSkating,
      isSkating,
      actionType: isSkating ? 'pause' : 'start'
    })
  },

  /**
   * 计算真实滑板年数
   * 逻辑：每个 start 到最近的 pause 是一个时间段
   * 如果最后一个节点是 start，则从该 start 到当前时间累积
   */
  calculateYearsSkating(history) {
    if (history.length === 0) return { totalMs: 0, periods: [] }
    
    const now = Date.now()
    
    // 按时间顺序排序
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp)
    
    // 配对 start 和 pause
    const periods = []
    let currentStart = null
    
    sorted.forEach(node => {
      if (node.type === 'start') {
        // 新的开始节点
        if (currentStart !== null) {
          // 前一个 start 没有配对的 pause，这种情况理论上不应该发生
          // 但为了安全，我们忽略前一个未配对的 start
        }
        currentStart = node
      } else if (node.type === 'pause' && currentStart !== null) {
        // 找到配对的 pause
        periods.push({
          startTimestamp: currentStart.timestamp,
          endTimestamp: node.timestamp,
          duration: node.timestamp - currentStart.timestamp
        })
        currentStart = null
      }
    })
    
    // 如果最后一个节点是 start，累积到当前时间
    if (currentStart !== null) {
      periods.push({
        startTimestamp: currentStart.timestamp,
        endTimestamp: now,
        duration: now - currentStart.timestamp
      })
    }
    
    // 计算总时间
    const totalMs = periods.reduce((sum, p) => sum + p.duration, 0)
    
    return { totalMs, periods }
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
    
    this.setData({
      showModal: true,
      selectedDate: today,
      editingNode: null,
      editingIndex: -1
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
    const { selectedDate, actionType, editingNode, editingIndex } = this.data
    const history = wx.getStorageSync('skating_history') || []
    
    // 解析日期
    const [y, m, d] = selectedDate.split('-').map(Number)
    const timestamp = new Date(y, m - 1, d).getTime()
    
    if (editingNode) {
      // 编辑模式
      history[editingIndex].timestamp = timestamp
      history[editingIndex].date = selectedDate
    } else {
      // 新增模式
      const newNode = {
        id: `node_${Date.now()}`,
        type: actionType, // 'start' 或 'pause'
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
   * 编辑节点
   */
  editNode(e) {
    const { id, index } = e.currentTarget.dataset
    const history = wx.getStorageSync('skating_history') || []
    const node = history.find(h => h.id === id)
    
    if (node) {
      const date = new Date(node.timestamp)
      this.setData({
        showModal: true,
        selectedDate: this.formatDate(date),
        editingNode: node,
        editingIndex: history.findIndex(h => h.id === id)
      })
    }
  },

  /**
   * 删除节点
   */
  deleteNode(e) {
    const { id, index } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个节点吗？',
      success: (res) => {
        if (res.confirm) {
          const history = wx.getStorageSync('skating_history') || []
          const newHistory = history.filter(h => h.id !== id)
          wx.setStorageSync('skating_history', newHistory)
          this.loadData()
          wx.showToast({
            title: '已删除',
            icon: 'success'
          })
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
