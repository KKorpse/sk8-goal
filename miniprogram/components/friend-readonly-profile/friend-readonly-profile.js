Component({
  properties: {
    friend: {
      type: Object,
      value: {}
    }
  },

  data: {
    readonlySceneConfig: {
      startIcon: '🚩',
      startLabel: '开始',
      endIcon: '🏆',
      endLabel: '记录',
      emptyEmoji: '🛹',
      emptyHint: '去落下第一个动作吧'
    }
  }
})
