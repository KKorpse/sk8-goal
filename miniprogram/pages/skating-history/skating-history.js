/**
 * 滑板历史页面
 */

Page({
  data: {
    history: [],
    yearsSkating: 0,
    showModal: false,
    nodeType: 'start', // 'start' | 'pause'
    selectedDate: '',
    today: '',
    editingNode: null,
    editingIndex: -1
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
    
    // 按时间排序（最新的在前）
    history.sort((a, b) => b.timestamp - a.timestamp)
    
    // 格式化显示数据
    const formattedHistory = history.map((item, index, arr) => {
      const date = new Date(item.timestamp)
      const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
      
      // 计算持续时间
      let duration = ''
      if (item.type === 'start' && item.endTime) {
        const ms = item.endTime - item.timestamp
        duration = this.formatDuration(ms)
      }
      
      return {
        ...item,
        dateStr,
        duration
      }
    })
    
    // 计算总滑板年数
    const yearsSkating = this.calculateYearsSkating(history)
    
    this.setData({
      history: formattedHistory,
      yearsSkating
    })
  },

  /**
   * 计算真实滑板年数
   */
  calculateYearsSkating(history) {
    if (history.length === 0) return 0
    
    const now = Date.now()
    let totalMs = 0
    
    history.forEach(period => {
      if (period.type === 'start') {
        const endTime = period.endTime || now
        totalMs += endTime - period.timestamp
      }
    })
    
    // 转换为年，保留一位小数
    return Math.round(totalMs / (365.25 * 24 * 60 * 60 * 1000) * 10) / 10
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
   * 添加开始节点
   */
  addStartNode() {
    this.setData({
      showModal: true,
      nodeType: 'start',
      selectedDate: this.data.today,
      editingNode: null,
      editingIndex: -1
    })
  },

  /**
   * 添加暂停节点
   */
  addPauseNode() {
    this.setData({
      showModal: true,
      nodeType: 'pause',
      selectedDate: this.data.today,
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
    const { selectedDate, nodeType, editingNode, editingIndex } = this.data
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
        type: nodeType,
        timestamp,
        date: selectedDate
      }
      
      if (nodeType === 'start') {
        // 如果是开始节点，找到上一个未结束的开始节点并设置结束时间
        const lastUnfinished = history.find(h => h.type === 'start' && !h.endTime)
        if (lastUnfinished && lastUnfinished.timestamp < timestamp) {
          lastUnfinished.endTime = timestamp
        }
      } else if (nodeType === 'pause') {
        // 如果是暂停节点，找到最近的开始节点并设置结束时间
        const lastStart = history.filter(h => h.type === 'start').sort((a, b) => b.timestamp - a.timestamp)[0]
        if (lastStart && lastStart.timestamp < timestamp && !lastStart.endTime) {
          lastStart.endTime = timestamp
        }
      }
      
      history.push(newNode)
    }
    
    // 保存并刷新
    wx.setStorageSync('skating_history', history)
    this.setData({ showModal: false })
    this.loadData()
    
    wx.showToast({
      title: editingNode ? '已更新' : '已添加',
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
        nodeType: node.type,
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
