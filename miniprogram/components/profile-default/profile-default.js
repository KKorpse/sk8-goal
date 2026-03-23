const { TERRARIA_COMPONENT_MAP } = require('../../themes/componentRegistry')

Component({
  properties: {
    themeId: String,
    componentMap: {
      type: Object,
      value: {}
    },
    userInfo: {
      type: Object,
      value: {}
    },
    sceneConfig: {
      type: Object,
      value: {}
    },
    stanceExpanded: Boolean,
    yearsSkating: Number,
    unlockedBadges: {
      type: Array,
      value: []
    },
    allBadges: {
      type: Array,
      value: []
    },
    ollie: {
      type: Object,
      value: {}
    },
    ollieExpanded: Boolean,
    stats: {
      type: Object,
      value: {}
    },
    statExpanded: String,
    statTrickLists: {
      type: Object,
      value: {}
    },
    timeline: {
      type: Array,
      value: []
    }
  },

  data: {
    useTerrariaAchievementScene: false
  },

  observers: {
    componentMap(componentMap) {
      this.setData({
        useTerrariaAchievementScene: !!componentMap &&
          componentMap.achievementScene === TERRARIA_COMPONENT_MAP.achievementScene
      })
    }
  },

  methods: {
    emit(name, detail) {
      this.triggerEvent(name, detail || {})
    },

    handleEmit(e) {
      this.emit(e.currentTarget.dataset.name)
    },

    emitDataset(name, e) {
      this.emit(name, e.currentTarget.dataset)
    },

    handleEmitDataset(e) {
      this.emitDataset(e.currentTarget.dataset.name, e)
    },

    onTimelineNodeTap(e) {
      this.emit('timelinenodetap', e.detail)
    }
  }
})
