const themeService = require('../services/themeService')

function buildThemeData(theme) {
  return {
    themeId: theme.id,
    themeClass: theme.className,
    themeMeta: theme,
    themeOptions: themeService.getThemeOptions()
  }
}

function applyNavigationBar(theme) {
  if (!theme || !theme.navigationBar || typeof wx.setNavigationBarColor !== 'function') {
    return
  }

  try {
    wx.setNavigationBarColor({
      frontColor: theme.navigationBar.frontColor,
      backgroundColor: theme.navigationBar.backgroundColor
    })
  } catch (error) {
    console.warn('setNavigationBarColor failed', error)
  }
}

function applyTheme(page) {
  const theme = themeService.getCurrentTheme()
  page.setData(buildThemeData(theme))
  applyNavigationBar(theme)
  return theme
}

function setTheme(page, themeId) {
  const theme = themeService.setCurrentTheme(themeId)
  page.setData(buildThemeData(theme))
  applyNavigationBar(theme)
  return theme
}

module.exports = {
  buildThemeData,
  applyNavigationBar,
  applyTheme,
  setTheme
}
