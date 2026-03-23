Component({
  properties: {
    timeline: {
      type: Array,
      value: []
    },
    variant: {
      type: String,
      value: 'terraria'
    },
    sceneConfig: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onNodeTap(e) {
      this.triggerEvent('nodetap', { index: e.currentTarget.dataset.index })
    }
  }
})
