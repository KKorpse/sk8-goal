const themePage = require('../../utils/themePage')

Page({
  data: {
    themeId: '',
    themeClass: '',
    themeMeta: {},
    themeOptions: [],
    pageContent: {}
  },

  onLoad() {
    this.applyThemeState()
  },

  onShow() {
    this.applyThemeState()
  },

  applyThemeState(themeId) {
    const theme = themeId ? themePage.setTheme(this, themeId) : themePage.applyTheme(this)
    this.setData({
      pageContent: theme.authorContent || {}
    })
    return theme
  },

  copyText(e) {
    const text = e.currentTarget.dataset.text;
    if (!text) return;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'none',
          duration: 1500
        });
      }
    });
  },

  goExternal(e) {
    const url = e.currentTarget.dataset.url;
    if (!url) return;
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'none',
          duration: 1500
        });
      }
    });
  }
});
