# Theme Template

新增主题时，至少补这几层：

1. 新建 `miniprogram/themes/<theme-id>.js`
2. 在 `miniprogram/themes/index.js` 注册
3. 在 `miniprogram/styles/theme.wxss` 增加 `.theme-<theme-id>`
4. 如有页面内容差异，直接补到主题文件里的：
   - `sceneConfig`
   - `authorContent`
5. 如有组件结构差异，在 `components/<theme-id>/` 下新增变体组件，并在主题文件的 `componentMap` 里声明路径
6. 执行 `npm run theme:validate`

主题配置最小字段：

```js
module.exports = {
  id: 'theme-id',
  name: '主题名',
  description: '一句描述',
  preview: '预览文案',
  className: 'theme-theme-id',
  navigationBar: {
    frontColor: '#ffffff',
    backgroundColor: '#000000'
  },
  componentMap: {
    trickCard: '/components/trick-card/trick-card',
    achievementScene: '/components/achievement-scene/achievement-scene',
    profileLayout: '/components/profile-default/profile-default'
  },
  sceneConfig: {
    avatarIcon: '',
    startIcon: '',
    startLabel: '',
    endIcon: '',
    endLabel: '',
    emptyEmoji: '',
    emptyHint: ''
  },
  authorContent: {
    heroIcon: '',
    heroTitle: '',
    avatarIcon: '',
    roleText: '',
    introText: '',
    socialIcon: '',
    socialTitle: '',
    tipText: '',
    tipSub: ''
  }
}
```
