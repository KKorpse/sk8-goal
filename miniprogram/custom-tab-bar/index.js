Component({
  data: {
    selected: 0,
    list: [{
      pagePath: "/pages/tricks/tricks",
      text: "动作库",
      iconPath: "/images/icons/tricks.png",
      selectedIconPath: "/images/icons/tricks-active.png"
    }, {
      pagePath: "/pages/profile/profile",
      text: "我的",
      iconPath: "/images/icons/profile.png",
      selectedIconPath: "/images/icons/profile-active.png"
    }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})