const config = require('../../../config')
const vibrate = require('../../../utils/vibrate')

Component({
  properties: {
    trick: {
      type: Object,
      value: {}
    }
  },

  data: {
    stances: config.stances,
    stanceConfig: config.stanceConfig
  },

  methods: {
    onTap() {
      vibrate.light()
      this.triggerEvent('tap', { trick: this.properties.trick })
    }
  }
})
