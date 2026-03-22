/**
 * 滑板打卡墙组件 - GitHub风格
 */
const storageService = require('../../services/storageService')
const vibrate = require('../../utils/vibrate')

Component({
  properties: {
    // 是否显示
    visible: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 打卡网格数据（按周组织）
    checkinWeeks: [],
    // 月份标签
    monthLabels: [],
    // 月份映射 { weekIndex: '月份文本' }
    monthMap: {},
    // 当前年份
    currentYear: new Date().getFullYear(),
    // 连续打卡天数
    consecutiveDays: 0,
    // 今日是否已打卡
    todayChecked: false,
    // 本月打卡天数
    monthCheckins: 0,
    // 今年打卡天数
    yearCheckins: 0,
    // 总计打卡天数
    totalCheckins: 0,
    // 弹窗相关
    showModal: false,
    selectedDate: '',
    selectedCount: 0,
    // 滚动位置（默认滚动到最右侧）
    scrollLeft: 9999
  },

  lifetimes: {
    attached() {
      this.loadCheckinData()
    }
  },

  methods: {
    /**
     * 加载打卡数据
     */
    loadCheckinData() {
      const records = storageService.getCheckinRecords()
      const today = new Date()
      const todayStr = storageService.formatDate(today)
      
      // 生成一年的打卡网格（从今天往前推一年）
      const { checkinWeeks, monthLabels, monthMap } = this.generateYearGrid(today)
      
      // 计算统计信息
      const consecutiveDays = storageService.getConsecutiveDays()
      const todayChecked = records[todayStr]?.count > 0
      const monthCheckins = this.getMonthCheckins(records, today)
      const yearCheckins = this.getYearCheckins(records, today)
      const totalCheckins = Object.keys(records).length
      
      this.setData({
        checkinWeeks,
        monthLabels,
        monthMap,
        currentYear: today.getFullYear(),
        consecutiveDays,
        todayChecked,
        monthCheckins,
        yearCheckins,
        totalCheckins
      })
    },

    /**
     * 生成一年的打卡网格（GitHub风格）
     */
    generateYearGrid(today) {
      const records = storageService.getCheckinRecords()
      const checkinWeeks = []
      const monthLabels = []
      // monthMap: { weekIndex: '月份文本' }，方便 wxml 中按列索引查找
      const monthMap = {}
      
      // 从一年前开始
      const startDate = new Date(today)
      startDate.setFullYear(startDate.getFullYear() - 1)
      
      // 调整到周日（GitHub从周日开始）
      const dayOfWeek = startDate.getDay()
      startDate.setDate(startDate.getDate() - dayOfWeek)
      
      let lastMonth = -1
      
      // 生成53周的数据
      for (let week = 0; week < 53; week++) {
        const weekData = []
        
        for (let day = 0; day < 7; day++) {
          const date = new Date(startDate)
          date.setDate(startDate.getDate() + week * 7 + day)
          const dateStr = storageService.formatDate(date)
          const count = records[dateStr]?.count || 0
          
          weekData.push({
            date: dateStr,
            count: count,
            level: this.getLevel(count)
          })
          
          // 检测月份变化（每月1号所在的周）
          const month = date.getMonth()
          if (month !== lastMonth) {
            const label = (month + 1) + '月'
            monthLabels.push({
              week: week,
              month: month + 1
            })
            monthMap[week] = label
            lastMonth = month
          }
        }
        
        checkinWeeks.push(weekData)
      }
      
      return { checkinWeeks, monthLabels, monthMap }
    },

    /**
     * 获取打卡等级
     */
    getLevel(count) {
      if (count === 0) return 'level-0'
      if (count === 1) return 'level-1'
      return 'level-2'
    },

    /**
     * 计算本月打卡天数
     */
    getMonthCheckins(records, today) {
      const year = today.getFullYear()
      const month = today.getMonth()
      let count = 0
      
      Object.keys(records).forEach(dateStr => {
        const date = new Date(dateStr)
        if (date.getFullYear() === year && date.getMonth() === month) {
          if (records[dateStr].count > 0) {
            count++
          }
        }
      })
      
      return count
    },

    /**
     * 计算今年打卡天数
     */
    getYearCheckins(records, today) {
      const year = today.getFullYear()
      let count = 0
      
      Object.keys(records).forEach(dateStr => {
        const date = new Date(dateStr)
        if (date.getFullYear() === year) {
          if (records[dateStr].count > 0) {
            count++
          }
        }
      })
      
      return count
    },

    /**
     * 点击打卡格子
     */
    onCellTap(e) {
      const { date, count } = e.currentTarget.dataset
      vibrate.light()
      
      this.setData({
        showModal: true,
        selectedDate: date,
        selectedCount: count || 0
      })
    },

    /**
     * 今日打卡
     */
    onCheckinTap() {
      vibrate.light()
      
      const todayStr = storageService.formatDate(new Date())
      const records = storageService.getCheckinRecords()
      const todayCount = records[todayStr]?.count || 0
      
      if (todayCount > 0) {
        wx.showToast({
          title: '今日已打卡',
          icon: 'none',
          duration: 1500
        })
        return
      }
      
      // 添加打卡
      storageService.addCheckin(todayStr)
      vibrate.success()
      
      wx.showToast({
        title: '打卡成功！',
        icon: 'success',
        duration: 1500
      })
      
      // 立即更新数据
      setTimeout(() => {
        this.loadCheckinData()
      }, 100)
    },

    /**
     * 弹窗操作
     */
    onModalAction() {
      const { selectedDate, selectedCount } = this.data
      vibrate.medium()
      
      if (selectedCount > 0) {
        // 取消打卡
        storageService.removeCheckin(selectedDate)
        wx.showToast({
          title: '已取消打卡',
          icon: 'none',
          duration: 1500
        })
      } else {
        // 补打卡
        storageService.addCheckin(selectedDate)
        vibrate.success()
        wx.showToast({
          title: '补打卡成功！',
          icon: 'success',
          duration: 1500
        })
      }
      
      // 关闭弹窗并刷新数据
      this.closeModal()
      
      // 延迟刷新数据，确保存储操作完成
      setTimeout(() => {
        this.loadCheckinData()
      }, 100)
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
    preventClose() {
      // 空方法，阻止事件冒泡
    }
  }
})
