const themePage = require('../../utils/themePage')
const friendsMock = require('../../mock/friends')

Page({
  data: {
    themeId: '',
    themeClass: '',
    themeMeta: {},
    themeOptions: [],
    friends: [],
    expandedFriendId: ''
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
  },

  onFriendTap(e) {
    const { id } = e.currentTarget.dataset
    const expandedFriendId = this.data.expandedFriendId === id ? '' : id

    this.setData({
      expandedFriendId
    })
  }
})
