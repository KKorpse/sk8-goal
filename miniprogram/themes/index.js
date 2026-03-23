const minecraft = require('./minecraft')
const stardew = require('./stardew')
const terraria = require('./terraria')
const { validateThemeMap } = require('./themeSchema')

const THEMES = validateThemeMap({
  [minecraft.id]: minecraft,
  [stardew.id]: stardew,
  [terraria.id]: terraria
})

module.exports = THEMES
