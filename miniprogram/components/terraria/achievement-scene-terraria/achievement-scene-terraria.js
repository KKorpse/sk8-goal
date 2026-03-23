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
      const { index } = e.currentTarget.dataset
      this.triggerEvent('nodetap', { index })
    }
  }
})
