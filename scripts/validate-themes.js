#!/usr/bin/env node

const path = require('path')

const themes = require(path.join(__dirname, '..', 'miniprogram', 'themes'))
const { validateThemeMap } = require(path.join(__dirname, '..', 'miniprogram', 'themes', 'themeSchema'))

try {
  validateThemeMap(themes)
  console.log(`Validated ${Object.keys(themes).length} themes successfully.`)
} catch (error) {
  console.error(`Theme validation failed: ${error.message}`)
  process.exit(1)
}
