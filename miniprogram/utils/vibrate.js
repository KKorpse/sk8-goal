/**
 * SkateGoal 震动反馈封装
 * 提供统一的触感反馈 API
 */

/**
 * 轻微震动
 * 用于：常规点击、展开折叠面板
 */
function light() {
  wx.vibrateShort({
    type: 'light',
    fail: () => {
      // 部分设备可能不支持，静默失败
    }
  })
}

/**
 * 中等震动
 * 用于：状态切换（如从"未解锁"变为"体验卡"）
 */
function medium() {
  wx.vibrateShort({
    type: 'medium',
    fail: () => {}
  })
}

/**
 * 重度震动
 * 用于：成就达成（如点亮"一脚一个"）
 */
function heavy() {
  wx.vibrateShort({
    type: 'heavy',
    fail: () => {}
  })
}

/**
 * 成功震动（长震动）
 * 用于：重大成就达成
 */
function success() {
  wx.vibrateLong({
    fail: () => {}
  })
}

/**
 * 根据状态变化自动选择震动强度
 * @param {string} oldStatus - 旧状态
 * @param {string} newStatus - 新状态
 */
function forStatusChange(oldStatus, newStatus) {
  // 如果是取消/降级，使用轻微震动
  if (newStatus === 'none' || 
      (oldStatus === 'mastered' && newStatus !== 'mastered')) {
    light()
    return
  }
  
  // 如果达成"一脚一个"，使用重度震动
  if (newStatus === 'mastered') {
    heavy()
    return
  }
  
  // 其他状态变化使用中等震动
  medium()
}

module.exports = {
  light,
  medium,
  heavy,
  success,
  forStatusChange
}
