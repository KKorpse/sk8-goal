/**
 * 搜索栏组件
 */
const util = require('../../utils/util')

Component({
  properties: {
    // 占位文字
    placeholder: {
      type: String,
      value: '搜个招...'
    },
    // 当前值
    value: {
      type: String,
      value: ''
    }
  },

  data: {
    inputValue: '',
    isFocused: false
  },

  lifetimes: {
    attached() {
      this.setData({ inputValue: this.properties.value })
      // 创建防抖搜索函数
      this.debouncedSearch = util.debounce((value) => {
        this.triggerEvent('search', { value })
      }, 300)
    }
  },

  observers: {
    'value': function(value) {
      if (value !== this.data.inputValue) {
        this.setData({ inputValue: value })
      }
    }
  },

  methods: {
    /**
     * 输入变化
     */
    onInput(e) {
      const value = e.detail.value
      this.setData({ inputValue: value })
      
      // 防抖触发搜索
      this.debouncedSearch(value)
    },

    /**
     * 聚焦
     */
    onFocus() {
      this.setData({ isFocused: true })
      this.triggerEvent('focus')
    },

    /**
     * 失焦
     */
    onBlur() {
      this.setData({ isFocused: false })
      this.triggerEvent('blur')
    },

    /**
     * 确认搜索
     */
    onConfirm() {
      this.triggerEvent('search', { value: this.data.inputValue })
      this.triggerEvent('confirm', { value: this.data.inputValue })
    },

    /**
     * 清空输入
     */
    onClear() {
      this.setData({ inputValue: '' })
      this.triggerEvent('search', { value: '' })
      this.triggerEvent('clear')
    }
  }
})
