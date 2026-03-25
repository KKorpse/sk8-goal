Component({
  properties: {
    ollie: {
      type: Object,
      value: {
        normal: 0,
        switch: 0
      }
    }
  },

  data: {
    normalWidth: 0,
    switchWidth: 0
  },

  observers: {
    ollie: function (ollie) {
      const normal = Number(ollie && ollie.normal) || 0
      const switchValue = Number(ollie && ollie.switch) || 0

      this.setData({
        normalWidth: Math.max(0, Math.min(normal * 20, 100)),
        switchWidth: Math.max(0, Math.min(switchValue * 20, 100))
      })
    }
  }
})
