const STORAGE_KEY = 'app_theme'
const THEMES = require('../themes')

function getDefaultThemeId() {
  return THEMES.minecraft.id
}

function getThemeById(themeId) {
  return THEMES[themeId] || THEMES[getDefaultThemeId()]
}

function getThemeOptions() {
  return Object.keys(THEMES).map((key) => THEMES[key])
}

function getCurrentThemeId() {
  const themeId = wx.getStorageSync(STORAGE_KEY)
  return THEMES[themeId] ? themeId : getDefaultThemeId()
}

function getCurrentTheme() {
  return getThemeById(getCurrentThemeId())
}

function setCurrentTheme(themeId) {
  const theme = getThemeById(themeId)
  wx.setStorageSync(STORAGE_KEY, theme.id)
  return theme
}

module.exports = {
  STORAGE_KEY,
  THEMES,
  getDefaultThemeId,
  getThemeById,
  getThemeOptions,
  getCurrentThemeId,
  getCurrentTheme,
  setCurrentTheme
}
