#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function toPascalLikeLabel(themeId) {
  return themeId
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function main() {
  const themeId = process.argv[2]

  if (!themeId) {
    console.error('Usage: npm run theme:create -- <theme-id>')
    process.exit(1)
  }

  if (!/^[a-z0-9-]+$/.test(themeId)) {
    console.error('Theme id must use lowercase letters, numbers, and hyphens only.')
    process.exit(1)
  }

  const themeFilePath = path.join(__dirname, '..', 'miniprogram', 'themes', `${themeId}.js`)

  if (fs.existsSync(themeFilePath)) {
    console.error(`Theme file already exists: ${themeFilePath}`)
    process.exit(1)
  }

  const label = toPascalLikeLabel(themeId)
  const fileContent = `module.exports = {
  id: '${themeId}',
  name: '${label}',
  description: '补一句主题描述',
  preview: '补一句预览文案',
  className: 'theme-${themeId}',
  navigationBar: {
    frontColor: '#ffffff',
    backgroundColor: '#000000'
  },
  sceneConfig: {
    avatarIcon: '🛹',
    startIcon: '🚩',
    startLabel: '起点',
    endIcon: '🏁',
    endLabel: '继续挑战',
    emptyEmoji: '✨',
    emptyHint: '补一句空状态提示'
  },
  authorContent: {
    heroIcon: '🧩',
    heroTitle: '关于作者',
    avatarIcon: '🛹',
    roleText: '开发者 / 滑手',
    introText: '补一句作者页介绍',
    socialIcon: '📡',
    socialTitle: '找到我',
    tipText: '补一句提示文案',
    tipSub: '补一句补充说明'
  }
}
`

  fs.writeFileSync(themeFilePath, fileContent, 'utf8')

  console.log(`Created theme file: ${themeFilePath}`)
  console.log('Next steps:')
  console.log(`1. Register it in miniprogram/themes/index.js`)
  console.log(`2. Add .theme-${themeId} tokens in miniprogram/styles/theme.wxss`)
  console.log('3. Run npm run theme:validate')
}

main()
