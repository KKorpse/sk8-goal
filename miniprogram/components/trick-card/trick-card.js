/**
 * 招式卡片组件
 */
const config = require('../../config')
const vibrate = require('../../utils/vibrate')

Component({
  properties: {
    // 招式数据
    trick: {
      type: Object,
      value: {}
    }
  },

  data: {
    stanceConfig: config.stanceConfig,
    statusConfig: config.statusConfig,
    stances: config.stances
  },

  methods: {
    /**
     * 点击卡片
     */
    onTap() {
      vibrate.light()
      this.triggerEvent('tap', { trick: this.properties.trick })
    },

    /**
     * 获取脚位状态样式类
     */
    getStatusClass(status) {
      return status || 'none'
    }
  }
})
