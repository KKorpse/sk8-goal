const minecraft = require('./minecraft')
const stardew = require('./stardew')
const terraria = require('./terraria')

const THEMES = {
  [minecraft.id]: minecraft,
  [stardew.id]: stardew,
  [terraria.id]: terraria
}

module.exports = THEMES
