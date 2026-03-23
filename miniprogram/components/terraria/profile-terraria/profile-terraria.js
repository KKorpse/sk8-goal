const { TERRARIA_COMPONENT_MAP } = require('../../../themes/componentRegistry')

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
    terrariaAchievementScenePath: TERRARIA_COMPONENT_MAP.achievementScene,
    litBarWidth: 0,
    masteredBarWidth: 0,
    yearsBarWidth: 0
  },

  observers: {
    'stats.litCount, stats.masteredCount, yearsSkating': function (litCount, masteredCount, yearsSkating) {
      this.setData({
        litBarWidth: Math.min((litCount || 0) * 10, 100),
        masteredBarWidth: Math.min((masteredCount || 0) * 14, 100),
        yearsBarWidth: Math.min((yearsSkating || 0) * 20, 100)
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
