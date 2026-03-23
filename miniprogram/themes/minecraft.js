const { DEFAULT_COMPONENT_MAP } = require('./componentRegistry')

module.exports = {
  id: 'minecraft',
  name: '方块冒险',
  description: '像素、硬边框、地下城式 UI',
  preview: '像素矿洞',
  className: 'theme-minecraft',
  navigationBar: {
    frontColor: '#ffffff',
    backgroundColor: '#3b2818'
  },
  componentMap: DEFAULT_COMPONENT_MAP,
  sceneConfig: {
    avatarIcon: '⛏️',
    startIcon: '🚩',
    startLabel: '起点',
    endIcon: '🏰',
    endLabel: '继续挑战',
    emptyEmoji: '🎮',
    emptyHint: '去动作库点亮你的第一个招式吧！'
  },
  authorContent: {
    heroIcon: '⚔️',
    heroTitle: '关于作者',
    avatarIcon: '🛹',
    roleText: '开发者 / 滑手',
    introText: '一个喜欢滑板和写代码的人。做这个小程序是因为想记录自己学动作的过程，顺便帮到更多滑手。希望能把喜欢的两件事结合在一起。',
    socialIcon: '📡',
    socialTitle: '找到我',
    tipText: '💡 可在小红书给我提意见和反馈',
    tipSub: '你的建议会让这个工具变得更好'
  }
}
