/**
 * 筛选标签组件
 */
const vibrate = require('../../utils/vibrate')

Component({
  properties: {
    // 标签列表 [{ id, name, icon? }]
    tabs: {
      type: Array,
      value: []
    },
    // 当前选中的标签 ID
    activeId: {
      type: String,
      value: ''
    }
  },

  data: {},

  methods: {
    /**
     * 点击标签
     */
    onTabTap(e) {
      const { id } = e.currentTarget.dataset
      
      // 如果已经是当前选中的，不处理
      if (id === this.properties.activeId) {
        return
      }
      
      vibrate.light()
      this.triggerEvent('change', { id })
    }
  }
})
