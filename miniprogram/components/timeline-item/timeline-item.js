/**
 * 时光轴条目组件
 */
const config = require('../../config')

Component({
  properties: {
    // 时光轴记录
    record: {
      type: Object,
      value: {}
    },
    // 是否是第一个
    isFirst: {
      type: Boolean,
      value: false
    },
    // 是否是最后一个
    isLast: {
      type: Boolean,
      value: false
    },
    // 主题变体
    variant: {
      type: String,
      value: 'minecraft'
    }
  },

  data: {
    statusConfig: config.statusConfig,
    stanceConfig: config.stanceConfig
  },

  methods: {
    /**
     * 点击条目
     */
    onTap() {
      this.triggerEvent('tap', { record: this.properties.record })
    }
  }
})
