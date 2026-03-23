/**
 * MC 效果工具
 * 模拟 Minecraft 风格的视觉和音效反馈
 */

// 成就弹窗队列
let achievementQueue = []
let isShowingAchievement = false

/**
 * 显示 MC 风格成就弹窗
 * @param {Object} achievement - { title: string, description: string, icon?: string }
 */
function showAchievement(achievement) {
  achievementQueue.push(achievement)
  if (!isShowingAchievement) {
    processAchievementQueue()
  }
}

function processAchievementQueue() {
  if (achievementQueue.length === 0) {
    isShowingAchievement = false
    return
  }

  isShowingAchievement = true
  const achievement = achievementQueue.shift()

  const app = getApp()
  if (app && app.showAchievement) {
    app.showAchievement(achievement)
  }

  // 播放成就音效
  playAchievementSound()

  // 每3秒处理一个
  setTimeout(() => {
    processAchievementQueue()
  }, 3000)
}

/**
 * 播放 MC 成就音效
 */
function playAchievementSound() {
  const innerAudioContext = wx.createInnerAudioContext()
  // 使用内置音效（微信不支持直接播放本地mp3，需要用线上地址或本地路径）
  // 这里用网络上的 CC0 音效
  innerAudioContext.src = 'https://assets.mcore.top/SkateGoal/achievement.mp3'
  innerAudioContext.play()
  innerAudioContext.onEnded(() => {
    innerAudioContext.destroy()
  })
  innerAudioContext.onError(() => {
    innerAudioContext.destroy()
  })
}

/**
 * 方块放置效果
 * 在指定位置显示方块出现动画 + 粒子
 * @param {string} selector - wxml 选择器
 * @param {number} index - 格子索引
 */
function playBlockPlace(selector, index) {
  const page = getCurrentPage()
  if (!page) return

  // 创建粒子动画
  createParticles(page, selector, index, 'place')
}

/**
 * 方块破坏效果
 * 在指定位置显示方块破碎动画 + 粒子飞散
 * @param {string} selector - wxml 选择器
 * @param {number} index - 格子索引
 */
function playBlockBreak(selector, index) {
  const page = getCurrentPage()
  if (!page) return

  // 创建粒子动画
  createParticles(page, selector, index, 'break')
}

/**
 * 创建粒子效果
 */
function createParticles(page, selector, index, type) {
  // 使用 wxml 创建动画
  const animation = wx.createAnimation({
    duration: type === 'place' ? 200 : 300,
    timingFunction: type === 'place' ? 'ease-out' : 'ease-in'
  })

  if (type === 'place') {
    // 方块出现：从0放大到1，带弹跳
    animation.scale(0, 0).step()
    animation.scale(1.2, 1.2).step({ duration: 100 })
    animation.scale(1, 1).step({ duration: 100 })
  } else {
    // 方块破碎：缩小并向上飘散
    animation.scale(1, 1).opacity(1).step()
    animation.scale(0, 0).opacity(0).translateY(-20).step({ duration: 300 })
  }

  page.setData({
    [`mcEffect_${index}`]: animation.export()
  })

  // 清理动画
  setTimeout(() => {
    page.setData({
      [`mcEffect_${index}`]: null
    })
  }, 500)
}

/**
 * 获取当前页面实例
 */
function getCurrentPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/**
 * 打卡成功效果
 * MC 风格的泥土方块迸发 + 粒子
 * @param {Object} component - 组件实例
 */
function playCheckinEffect(component) {
  if (!component) return

  // 创建 MC 泥土方块弹出动画
  const blockAnim = wx.createAnimation({
    duration: 300,
    timingFunction: 'ease-out'
  })

  // 方块出现动画
  blockAnim.scale(0, 0).opacity(0).step()
  blockAnim.scale(1.1, 1.1).opacity(1).step({ duration: 150 })
  blockAnim.scale(1, 1).opacity(1).step({ duration: 100 })

  component.setData({ checkinBlockAnim: blockAnim.export() })

  // 播放放置音效
  playPlaceSound()

  // 创建泥土粒子
  setTimeout(() => {
    createCheckinParticles(component)
  }, 100)

  // 清理
  setTimeout(() => {
    component.setData({ checkinBlockAnim: null, checkinParticles: null })
  }, 800)
}

/**
 * 播放方块放置音效
 */
function playPlaceSound() {
  const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.src = 'https://assets.mcore.top/SkateGoal/place.mp3'
  innerAudioContext.play()
  innerAudioContext.onEnded(() => innerAudioContext.destroy())
  innerAudioContext.onError(() => innerAudioContext.destroy())
}

/**
 * 播放方块破坏音效
 */
function playBreakSound() {
  const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.src = 'https://assets.mcore.top/SkateGoal/break.mp3'
  innerAudioContext.play()
  innerAudioContext.onEnded(() => innerAudioContext.destroy())
  innerAudioContext.onError(() => innerAudioContext.destroy())
}

/**
 * 创建打卡粒子效果
 * 模拟 MC 泥土方块被激活时向四周迸发的小碎块
 * @param {Object} component - 组件实例
 */
function createCheckinParticles(component) {
  // 生成 10 个泥土碎块，带一点向上抛出的弧线感
  const particleCount = 10
  const particles = []
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (-Math.PI * 0.9) + (i / (particleCount - 1)) * (Math.PI * 0.8)
    const distance = 36 + Math.random() * 28
    const offsetX = Math.cos(angle) * distance
    const offsetY = Math.sin(angle) * distance - (8 + Math.random() * 12)
    
    // 每个粒子分步动画：先向外爆开，再快速淡出
    const anim = wx.createAnimation({
      duration: 420,
      timingFunction: 'ease-out',
      delay: i * 24
    })
    
    anim.translate(offsetX, offsetY).rotate((Math.random() - 0.5) * 90).scale(1.05).opacity(1).step({ duration: 220 })
    
    anim.translate(offsetX * 1.15, offsetY + 10 + Math.random() * 8).rotate((Math.random() - 0.5) * 140).scale(0.35).opacity(0).step({ duration: 200 })
    
    particles.push({
      animData: anim.export(),
      type: i % 3 === 0 ? 'grass' : 'dirt'
    })
  }
  
  component.setData({ checkinParticles: particles })
  
  // 清理
  setTimeout(() => {
    component.setData({ checkinParticles: null })
  }, 800)
}

module.exports = {
  showAchievement,
  playAchievementSound,
  playBlockPlace,
  playBlockBreak,
  playCheckinEffect,
  playPlaceSound,
  playBreakSound,
  createParticles,
  createCheckinParticles
}
