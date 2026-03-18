/**
 * 脚位矩阵面板组件
 */
const config = require('../../config')
const vibrate = require('../../utils/vibrate')

Component({
  properties: {
    // 是否显示
    visible: {
      type: Boolean,
      value: false
    },
    // 招式数据
    trick: {
      type: Object,
      value: null
    }
  },

  data: {
    stanceConfig: config.stanceConfig,
    statusConfig: config.statusConfig,
    stances: config.stances,
    statusList: ['trial', 'grinding', 'mastered'],
    // 当前展开的脚位选择器
    expandedStance: null,
    // 动画相关
    animationData: {},
    showMask: false
  },

  observers: {
    'visible': function(visible) {
      if (visible) {
        this.setData({ showMask: true })
        // 延迟显示动画
        setTimeout(() => {
          this.runAnimation(true)
        }, 50)
      } else {
        this.runAnimation(false)
        setTimeout(() => {
          this.setData({ showMask: false, expandedStance: null })
        }, 300)
      }
    }
  },

  methods: {
    /**
     * 执行动画
     */
    runAnimation(show) {
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      
      if (show) {
        animation.translateY(0).step()
      } else {
        animation.translateY('100%').step()
      }
      
      this.setData({
        animationData: animation.export()
      })
    },

    /**
     * 关闭面板
     */
    onClose() {
      vibrate.light()
      this.triggerEvent('close')
    },

    /**
     * 阻止冒泡
     */
    preventClose() {
      // 空方法，阻止事件冒泡
    },

    /**
     * 点击脚位
     */
    onStanceTap(e) {
      const { stance } = e.currentTarget.dataset
      vibrate.light()
      
      // 切换展开状态
      if (this.data.expandedStance === stance) {
        this.setData({ expandedStance: null })
      } else {
        this.setData({ expandedStance: stance })
      }
    },

    /**
     * 选择状态
     */
    onStatusSelect(e) {
      const { stance, status } = e.currentTarget.dataset
      const trick = this.properties.trick
      const oldStatus = trick?.stances?.[stance] || 'none'
      
      // 如果选择相同状态，则取消（设为none）
      const newStatus = (oldStatus === status) ? 'none' : status
      
      // 触感反馈
      vibrate.forStatusChange(oldStatus, newStatus)
      
      // 关闭选择器
      this.setData({ expandedStance: null })
      
      // 触发事件
      this.triggerEvent('statuschange', {
        trickId: trick.id,
        stance,
        oldStatus,
        newStatus
      })
    },

    /**
     * 获取状态显示文本
     */
    getStatusText(status) {
      return this.data.statusConfig[status]?.text || '未解锁'
    },

    /**
     * 获取状态 Emoji
     */
    getStatusEmoji(status) {
      return this.data.statusConfig[status]?.emoji || '⬜'
    }
  }
})
