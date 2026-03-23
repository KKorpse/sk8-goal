const themePage = require('../../utils/themePage')
const friendsMock = require('../../mock/friends')

Page({
  data: {
    themeId: '',
    themeClass: '',
    themeMeta: {},
    themeOptions: [],
    friends: []
  },

  onLoad() {
    this.loadData()
    themePage.applyTheme(this)
  },

  onShow() {
    this.loadData()
    themePage.applyTheme(this)
  },

  loadData() {
    this.setData({
      friends: friendsMock.getFriends()
    })
  }
})
