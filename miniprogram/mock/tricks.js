/**
 * SkateGoal 招式 Mock 数据
 * 完整的滑板招式库
 */

const tricks = [
  // ========== 必修基础 ==========
  {
    id: 'pushing',
    name: 'Pushing',
    nameCn: '滑行',
    category: 'basics',
    group: '必修基础',
    icon: '🛹',
    description: '滑板最基础的动作，用脚蹬地向前滑行'
  },
  {
    id: 'turning',
    name: 'Turning',
    nameCn: '转弯',
    category: 'basics',
    group: '必修基础',
    icon: '↪️',
    description: '通过重心转移实现转向'
  },
  {
    id: 'tic-tac',
    name: 'Tic Tac',
    nameCn: '点地前进',
    category: 'basics',
    group: '必修基础',
    icon: '⏪',
    description: '抬起板头左右摆动前进'
  },
  {
    id: 'manual',
    name: 'Manual',
    nameCn: '翘板滑行',
    category: 'basics',
    group: '必修基础',
    icon: '⚖️',
    description: '只用后轮滑行，保持平衡'
  },
  {
    id: 'nose-manual',
    name: 'Nose Manual',
    nameCn: '反翘板滑行',
    category: 'basics',
    group: '必修基础',
    icon: '⚖️',
    description: '只用前轮滑行，保持平衡'
  },

  // ========== 平地基础 - Ollie 系列 ==========
  {
    id: 'bs-180',
    name: 'BS 180',
    nameCn: '背转180',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🔄',
    description: 'Ollie 过程中身体和板一起背转180度'
  },
  {
    id: 'fs-180',
    name: 'FS 180',
    nameCn: '前转180',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🔄',
    description: 'Ollie 过程中身体和板一起前转180度'
  },
  {
    id: 'pop-shuvit',
    name: 'Pop Shuvit',
    nameCn: '豚转板',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🔃',
    description: 'Ollie 同时板转180度，身体不转'
  },
  {
    id: 'fs-pop-shuvit',
    name: 'FS Pop Shuvit',
    nameCn: '前豚转板',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🔃',
    description: 'Ollie 同时板前转180度'
  },

  // ========== 平地翻板 - Kickflip 系列 ==========
  {
    id: 'kickflip',
    name: 'Kickflip',
    nameCn: '尖翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🌀',
    description: '前脚尖向板头斜前方踢出，板沿长轴翻转一圈'
  },
  {
    id: 'double-kickflip',
    name: 'Double Kickflip',
    nameCn: '双尖翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🌀',
    description: '板翻转两圈的 Kickflip'
  },
  {
    id: 'kickflip-bs-180',
    name: 'Kickflip BS 180',
    nameCn: '尖翻背转',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🔄',
    description: 'Kickflip 同时身体背转180度'
  },
  {
    id: 'kickflip-fs-180',
    name: 'Kickflip FS 180',
    nameCn: '尖翻前转',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🔄',
    description: 'Kickflip 同时身体前转180度'
  },
  {
    id: 'varial-kickflip',
    name: 'Varial Kickflip',
    nameCn: '转板尖翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🌪️',
    description: 'Pop Shuvit + Kickflip 的组合'
  },

  // ========== 平地翻板 - Heelflip 系列 ==========
  {
    id: 'heelflip',
    name: 'Heelflip',
    nameCn: '跟翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '🌀',
    description: '前脚跟向板头斜前方踢出，板沿长轴反向翻转一圈'
  },
  {
    id: 'double-heelflip',
    name: 'Double Heelflip',
    nameCn: '双跟翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '🌀',
    description: '板翻转两圈的 Heelflip'
  },
  {
    id: 'heelflip-bs-180',
    name: 'Heelflip BS 180',
    nameCn: '跟翻背转',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '🔄',
    description: 'Heelflip 同时身体背转180度'
  },
  {
    id: 'heelflip-fs-180',
    name: 'Heelflip FS 180',
    nameCn: '跟翻前转',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '🔄',
    description: 'Heelflip 同时身体前转180度'
  },
  {
    id: 'varial-heelflip',
    name: 'Varial Heelflip',
    nameCn: '转板跟翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '🌪️',
    description: 'FS Pop Shuvit + Heelflip 的组合'
  },

  // ========== 平地进阶 - 高级翻板 ==========
  {
    id: 'treflip',
    name: '360 Flip',
    nameCn: '大乱',
    category: 'flat',
    group: '高级翻板',
    icon: '💫',
    description: '360 Shuvit + Kickflip，滑板终极招式之一'
  },
  {
    id: 'hardflip',
    name: 'Hardflip',
    nameCn: '硬翻',
    category: 'flat',
    group: '高级翻板',
    icon: '💥',
    description: 'FS Pop Shuvit + Kickflip 的组合'
  },
  {
    id: 'inward-heelflip',
    name: 'Inward Heelflip',
    nameCn: '内跟翻',
    category: 'flat',
    group: '高级翻板',
    icon: '🌪️',
    description: 'BS Pop Shuvit + Heelflip 的组合'
  },
  {
    id: 'laser-flip',
    name: 'Laser Flip',
    nameCn: '激光翻',
    category: 'flat',
    group: '高级翻板',
    icon: '⚡',
    description: '360 FS Shuvit + Heelflip'
  },

  // ========== 道具 - 台子/杆子 ==========
  {
    id: 'bs-boardslide',
    name: 'BS Boardslide',
    nameCn: '背身板滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🎿',
    description: '背对杆子上板，板身垂直于杆滑行'
  },
  {
    id: 'fs-boardslide',
    name: 'FS Boardslide',
    nameCn: '前身板滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🎿',
    description: '面对杆子上板，板身垂直于杆滑行'
  },
  {
    id: '50-50',
    name: '50-50',
    nameCn: '五五磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '两个轮子架在杆上滑行'
  },
  {
    id: '5-0',
    name: '5-0',
    nameCn: '五零磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '只用后轮架在杆上滑行'
  },
  {
    id: 'nosegrind',
    name: 'Nosegrind',
    nameCn: '板头磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '只用前轮架在杆上滑行'
  },
  {
    id: 'crooked-grind',
    name: 'Crooked Grind',
    nameCn: '歪磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '前轮磨杆，板身倾斜'
  },
  {
    id: 'smith-grind',
    name: 'Smith Grind',
    nameCn: '史密斯磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '后轮磨杆，板头下沉'
  },
  {
    id: 'feeble-grind',
    name: 'Feeble Grind',
    nameCn: '微弱磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '后轮磨杆，板头上抬'
  },

  // ========== 弧面 - 碗池/U池 ==========
  {
    id: 'drop-in',
    name: 'Drop In',
    nameCn: '下池',
    category: 'transition',
    group: '弧面基础',
    icon: '⬇️',
    description: '从碗池边缘进入，弧面动作的基础'
  },
  {
    id: 'rock-to-fakie',
    name: 'Rock to Fakie',
    nameCn: '搁板倒滑',
    category: 'transition',
    group: '弧面基础',
    icon: '🪨',
    description: '前轮搁在池边，然后倒滑下来'
  },
  {
    id: 'rock-n-roll',
    name: 'Rock n Roll',
    nameCn: '摇滚',
    category: 'transition',
    group: '弧面基础',
    icon: '🎸',
    description: '前轮搁在池边，转180度正滑下来'
  },
  {
    id: 'axle-stall',
    name: 'Axle Stall',
    nameCn: '轴停',
    category: 'transition',
    group: '弧面基础',
    icon: '⏸️',
    description: '两个轮子停在池边'
  },
  {
    id: 'bs-air',
    name: 'BS Air',
    nameCn: '背身飞',
    category: 'transition',
    group: '飞跃',
    icon: '🚀',
    description: '背转方向腾空抓板'
  },
  {
    id: 'fs-air',
    name: 'FS Air',
    nameCn: '前身飞',
    category: 'transition',
    group: '飞跃',
    icon: '🚀',
    description: '前转方向腾空抓板'
  }
]

module.exports = {
  tricks,
  
  /**
   * 获取所有招式
   * @returns {Array}
   */
  getAllTricks() {
    return tricks
  },
  
  /**
   * 按分类获取招式
   * @param {string} category - 分类 ID
   * @returns {Array}
   */
  getTricksByCategory(category) {
    if (category === 'all') {
      return tricks
    }
    return tricks.filter(t => t.category === category)
  },
  
  /**
   * 按分组整理招式
   * @param {Array} trickList - 招式列表
   * @returns {Array} - [{ group: string, tricks: Array }]
   */
  groupTricks(trickList) {
    const groups = {}
    trickList.forEach(trick => {
      if (!groups[trick.group]) {
        groups[trick.group] = []
      }
      groups[trick.group].push(trick)
    })
    
    return Object.entries(groups).map(([group, tricks]) => ({
      group,
      tricks
    }))
  },
  
  /**
   * 搜索招式
   * @param {string} query - 搜索词
   * @returns {Array}
   */
  searchTricks(query) {
    if (!query) return tricks
    
    const q = query.toLowerCase()
    return tricks.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.nameCn.includes(q) ||
      t.id.includes(q)
    )
  },
  
  /**
   * 根据 ID 获取招式
   * @param {string} id - 招式 ID
   * @returns {Object|null}
   */
  getTrickById(id) {
    return tricks.find(t => t.id === id) || null
  }
}
