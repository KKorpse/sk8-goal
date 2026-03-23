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
 * MC 风格的方块放置 + 粒子
 */
function playCheckinEffect(selector = '#checkin-btn') {
  const page = getCurrentPage()
  if (!page) return

  // 创建 MC 方块动画
  const blockAnim = wx.createAnimation({
    duration: 300,
    timingFunction: 'ease-out'
  })

  // 方块出现动画
  blockAnim.scale(0, 0).opacity(0).step()
  blockAnim.scale(1.1, 1.1).opacity(1).step({ duration: 150 })
  blockAnim.scale(1, 1).opacity(1).step({ duration: 100 })

  page.setData({ checkinBlockAnim: blockAnim.export() })

  // 播放放置音效
  playPlaceSound()

  // 创建粒子
  setTimeout(() => {
    createCheckinParticles(page)
  }, 100)

  // 清理
  setTimeout(() => {
    page.setData({ checkinBlockAnim: null, checkinParticles: null })
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
 */
function createCheckinParticles(page) {
  // 生成8个粒子，初始在中心
  const particleCount = 8
  const particles = []
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    const distance = 40 + Math.random() * 20
    
    // 每个粒子分步动画：先扩大距离，再缩小消失
    const anim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out',
      delay: i * 30  // 错开延迟
    })
    
    // 第一步：从中心向外移动
    anim.translate(
      Math.cos(angle) * distance, 
      Math.sin(angle) * distance
    ).scale(1).opacity(1).step({ duration: 200 })
    
    // 第二步：缩小消失
    anim.scale(0.3).opacity(0).step({ duration: 200 })
    
    particles.push({
      animData: anim.export(),
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    })
  }
  
  page.setData({ checkinParticles: particles })
  
  // 清理
  setTimeout(() => {
    page.setData({ checkinParticles: null })
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
