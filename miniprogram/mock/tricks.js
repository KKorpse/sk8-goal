/**
 * SkateGoal 招式 Mock 数据
 * 完整的滑板招式库
 */

const tricks = [
  // ========== 平衡技巧 ==========
  {
    id: 'manual',
    name: 'Manual',
    nameCn: '翘板滑行',
    category: 'flat',
    group: '平衡技巧',
    icon: '⚖️',
    description: '只用后轮滑行，保持平衡'
  },
  {
    id: 'nose-manual',
    name: 'Nose Manual',
    nameCn: '反翘板滑行',
    category: 'flat',
    group: '平衡技巧',
    icon: '⚖️',
    description: '只用前轮滑行，保持平衡'
  },
  {
    id: 'penguin-walk',
    name: 'Penguin Walk',
    nameCn: '企鹅走',
    category: 'flat',
    group: '平衡技巧',
    icon: '🐧',
    description: 'Manual 状态下用后轮交替前进'
  },
  {
    id: 'wheelie',
    name: 'Wheelie',
    nameCn: '翘板',
    category: 'flat',
    group: '平衡技巧',
    icon: '⚖️',
    description: '短暂抬起板头保持后轮平衡'
  },

  // ========== 平地基础 - Ollie 系列 ==========
  {
    id: 'ollie',
    name: 'Ollie',
    nameCn: '豚跳',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🦘',
    description: '滑板最基础的跳跃技巧，让板离开地面'
  },
  {
    id: 'ollie-north',
    name: 'Ollie North',
    nameCn: '北跳',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '⬆️',
    description: 'Ollie 时前脚伸出板头'
  },
  {
    id: 'ollie-south',
    name: 'Ollie South',
    nameCn: '南跳',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '⬇️',
    description: 'Ollie 时后脚伸出板尾'
  },
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
    id: 'bs-360',
    name: 'BS 360',
    nameCn: '背转360',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🔄',
    description: 'Ollie 过程中身体和板一起背转360度'
  },
  {
    id: 'fs-360',
    name: 'FS 360',
    nameCn: '前转360',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🔄',
    description: 'Ollie 过程中身体和板一起前转360度'
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
  {
    id: 'bs-360-shuvit',
    name: 'BS 360 Shuvit',
    nameCn: '背转360板',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🔃',
    description: '板背转360度，身体不转'
  },
  {
    id: 'fs-360-shuvit',
    name: 'FS 360 Shuvit',
    nameCn: '前转360板',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🔃',
    description: '板前转360度，身体不转'
  },
  {
    id: 'bigspin',
    name: 'Bigspin',
    nameCn: '大转',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '💫',
    description: '板转360度同时身体背转180度'
  },
  {
    id: 'frontside-bigspin',
    name: 'Frontside Bigspin',
    nameCn: '前大转',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '💫',
    description: '板前转360度同时身体前转180度'
  },
  {
    id: 'bs-body-varial',
    name: 'BS Body Varial',
    nameCn: '背身转体',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🧍',
    description: 'Ollie 时身体背转180度，板不转'
  },
  {
    id: 'fs-body-varial',
    name: 'FS Body Varial',
    nameCn: '前转体',
    category: 'flat',
    group: 'Ollie 系列',
    icon: '🧍',
    description: 'Ollie 时身体前转180度，板不转'
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
    id: 'triple-kickflip',
    name: 'Triple Kickflip',
    nameCn: '三尖翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🌀',
    description: '板翻转三圈的 Kickflip'
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
  {
    id: 'treflip',
    name: '360 Flip',
    nameCn: '大乱',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '💫',
    description: '360 Shuvit + Kickflip，滑板终极招式之一'
  },
  {
    id: 'hardflip',
    name: 'Hardflip',
    nameCn: '硬翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '💥',
    description: 'FS Pop Shuvit + Kickflip 的组合'
  },
  {
    id: 'bigflip',
    name: 'Bigflip',
    nameCn: '大翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '💫',
    description: 'Bigspin + Kickflip 的组合'
  },
  {
    id: 'gazelle-flip',
    name: 'Gazelle Flip',
    nameCn: '羚羊翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🦌',
    description: '540 Shuvit + Kickflip + Body Varial'
  },
  {
    id: 'kickflip-underflip',
    name: 'Kickflip Underflip',
    nameCn: '尖翻回翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🔄',
    description: 'Kickflip 后脚勾板翻转回来'
  },
  {
    id: 'late-kickflip',
    name: 'Late Kickflip',
    nameCn: '迟尖翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '⏱️',
    description: 'Ollie 到最高点后再踢出 Kickflip'
  },
  {
    id: 'nightmare-flip',
    name: 'Nightmare Flip',
    nameCn: '噩梦翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '😱',
    description: 'Varial Kickflip + Double Flip'
  },
  {
    id: 'hospital-flip',
    name: 'Hospital Flip',
    nameCn: '医院翻',
    category: 'flat',
    group: 'Kickflip 系列',
    icon: '🏥',
    description: 'Kickflip 半圈后用脚勾回'
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
    id: 'triple-heelflip',
    name: 'Triple Heelflip',
    nameCn: '三跟翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '🌀',
    description: '板翻转三圈的 Heelflip'
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
  {
    id: 'laser-flip',
    name: 'Laser Flip',
    nameCn: '激光翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '⚡',
    description: '360 FS Shuvit + Heelflip'
  },
  {
    id: 'inward-heelflip',
    name: 'Inward Heelflip',
    nameCn: '内跟翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '🌪️',
    description: 'BS Pop Shuvit + Heelflip 的组合'
  },
  {
    id: 'big-heelflip',
    name: 'Big Heelflip',
    nameCn: '大跟翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '💫',
    description: 'Frontside Bigspin + Heelflip'
  },
  {
    id: 'late-heelflip',
    name: 'Late Heelflip',
    nameCn: '迟跟翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '⏱️',
    description: 'Ollie 到最高点后再踢出 Heelflip'
  },
  {
    id: 'heelflip-underflip',
    name: 'Heelflip Underflip',
    nameCn: '跟翻回翻',
    category: 'flat',
    group: 'Heelflip 系列',
    icon: '🔄',
    description: 'Heelflip 后脚勾板翻转回来'
  },

  // ========== 特殊翻板招式 ==========
  {
    id: 'impossible',
    name: 'Impossible',
    nameCn: '不可能',
    category: 'flat',
    group: '特殊翻板',
    icon: '🤯',
    description: '板绕后脚360度翻转，像甜甜圈一样'
  },
  {
    id: 'dolphin-flip',
    name: 'Dolphin Flip',
    nameCn: '海豚翻',
    category: 'flat',
    group: '特殊翻板',
    icon: '🐬',
    description: '前脚踢板头让板向前翻转'
  },
  {
    id: 'forward-flip',
    name: 'Forward Flip',
    nameCn: '前翻',
    category: 'flat',
    group: '特殊翻板',
    icon: '↩️',
    description: '板向前翻转的翻板招式'
  },
  {
    id: 'casper-flip',
    name: 'Casper Flip',
    nameCn: '幽灵翻',
    category: 'flat',
    group: '特殊翻板',
    icon: '👻',
    description: '板翻转后用脚勾住翻转回来'
  },
  {
    id: 'ghetto-bird',
    name: 'Ghetto Bird',
    nameCn: '贫民鸟',
    category: 'flat',
    group: '特殊翻板',
    icon: '🐦',
    description: 'Hardflip + 180 Body Varial'
  },
  {
    id: 'dragon-flip',
    name: 'Dragon Flip',
    nameCn: '龙翻',
    category: 'flat',
    group: '特殊翻板',
    icon: '🐉',
    description: 'Hardflip + Backside Body Varial'
  },
  {
    id: 'mother-flip',
    name: 'Mother Flip',
    nameCn: '母翻',
    category: 'flat',
    group: '特殊翻板',
    icon: '👩',
    description: 'Inward Heelflip + Frontside Body Varial'
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
    id: 'bs-lipslide',
    name: 'BS Lipslide',
    nameCn: '背唇滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🎿',
    description: '背对杆子上板，从另一侧滑行'
  },
  {
    id: 'fs-lipslide',
    name: 'FS Lipslide',
    nameCn: '前唇滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🎿',
    description: '面对杆子上板，从另一侧滑行'
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
    id: 'overcrook',
    name: 'Overcrook',
    nameCn: '过歪磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: 'Crooked Grind 过杆后从另一侧下'
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
  {
    id: 'salad-grind',
    name: 'Salad Grind',
    nameCn: '沙拉磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🥗',
    description: '前轮磨杆，板尾向内倾斜'
  },
  {
    id: 'suski-grind',
    name: 'Suski Grind',
    nameCn: '铃木磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '后轮磨杆，板头向内倾斜'
  },
  {
    id: 'noseblunt',
    name: 'Noseblunt',
    nameCn: '板头钝磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '前轮架在杆上，板身垂直立起'
  },
  {
    id: 'tailblunt',
    name: 'Tailblunt',
    nameCn: '板尾钝磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: '后轮架在杆上，板身垂直立起'
  },
  {
    id: 'k-grind',
    name: 'K Grind',
    nameCn: 'K磨',
    category: 'obstacles',
    group: '滑杆',
    icon: '🛤️',
    description: 'Crooked Grind 的另一种称呼'
  },
  {
    id: 'darkslide',
    name: 'Darkslide',
    nameCn: '暗滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🌑',
    description: '板底朝上滑杆，Rodney Mullen 发明'
  },
  {
    id: 'bs-tailslide',
    name: 'BS Tailslide',
    nameCn: '背板尾滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🎿',
    description: '用板尾在杆上滑行'
  },
  {
    id: 'fs-tailslide',
    name: 'FS Tailslide',
    nameCn: '前板尾滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🎿',
    description: '面对方向用板尾在杆上滑行'
  },
  {
    id: 'bs-noseslide',
    name: 'BS Noseslide',
    nameCn: '背板头滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🎿',
    description: '用板头在杆上滑行'
  },
  {
    id: 'fs-noseslide',
    name: 'FS Noseslide',
    nameCn: '前板头滑',
    category: 'obstacles',
    group: '滑杆',
    icon: '🎿',
    description: '面对方向用板头在杆上滑行'
  },

  // ========== 台阶/落差招式 ==========
  {
    id: 'ollie-stairs',
    name: 'Ollie Stairs',
    nameCn: '跳台阶',
    category: 'obstacles',
    group: '台阶/落差',
    icon: '🪜',
    description: '用 Ollie 跳下台阶'
  },
  {
    id: 'drop',
    name: 'Drop',
    nameCn: '跳落差',
    category: 'obstacles',
    group: '台阶/落差',
    icon: '⬇️',
    description: '从高处直接落下'
  },
  {
    id: 'wallride',
    name: 'Wallride',
    nameCn: '骑墙',
    category: 'obstacles',
    group: '台阶/落差',
    icon: '🧱',
    description: '骑在墙上滑行'
  },
  {
    id: 'wallie',
    name: 'Wallie',
    nameCn: '墙跳',
    category: 'obstacles',
    group: '台阶/落差',
    icon: '🧱',
    description: '从墙上 Ollie 出去'
  },
  {
    id: 'bank-drop',
    name: 'Bank Drop',
    nameCn: '斜坡下落',
    category: 'obstacles',
    group: '台阶/落差',
    icon: '📐',
    description: '从斜坡边缘下落'
  },

  // ========== 抓板招式 ==========
  {
    id: 'indy-grab',
    name: 'Indy Grab',
    nameCn: '印第抓',
    category: 'flat',
    group: '抓板',
    icon: '✋',
    description: '后手抓板脚窝内侧'
  },
  {
    id: 'melon-grab',
    name: 'Melon Grab',
    nameCn: '甜瓜抓',
    category: 'flat',
    group: '抓板',
    icon: '🍈',
    description: '前手抓板脚窝外侧，板向身体靠'
  },
  {
    id: 'mute-grab',
    name: 'Mute Grab',
    nameCn: '哑抓',
    category: 'flat',
    group: '抓板',
    icon: '🤫',
    description: '前手抓板脚窝内侧，双腿交叉'
  },
  {
    id: 'tail-grab',
    name: 'Tail Grab',
    nameCn: '抓板尾',
    category: 'flat',
    group: '抓板',
    icon: '🦎',
    description: '后手抓板尾'
  },
  {
    id: 'nose-grab',
    name: 'Nose Grab',
    nameCn: '抓板头',
    category: 'flat',
    group: '抓板',
    icon: '👃',
    description: '前手抓板头'
  },
  {
    id: 'stalefish-grab',
    name: 'Stalefish Grab',
    nameCn: '臭鱼抓',
    category: 'flat',
    group: '抓板',
    icon: '🐟',
    description: '后手从腿后穿过去抓板脚窝内侧'
  },
  {
    id: 'method-grab',
    name: 'Method Grab',
    nameCn: '方法抓',
    category: 'flat',
    group: '抓板',
    icon: '✋',
    description: '前手抓板脚窝外侧，板背向旋转'
  },
  {
    id: 'seatbelt-grab',
    name: 'Seatbelt Grab',
    nameCn: '安全带抓',
    category: 'flat',
    group: '抓板',
    icon: '🎨',
    description: '前手从腿后穿过去抓板脚窝外侧'
  },
  {
    id: 'crail-grab',
    name: 'Crail Grab',
    nameCn: '克莱抓',
    category: 'flat',
    group: '抓板',
    icon: '✋',
    description: '后手抓板头'
  },
  {
    id: 'japan-grab',
    name: 'Japan Grab',
    nameCn: '日本抓',
    category: 'flat',
    group: '抓板',
    icon: '🇯🇵',
    description: '前手抓板脚窝内侧，后腿向前踢出'
  },
  {
    id: 'benihana-grab',
    name: 'Benihana Grab',
    nameCn: '红花抓',
    category: 'flat',
    group: '抓板',
    icon: '🌺',
    description: '后手抓板尾，后腿向后踢出'
  },
  {
    id: 'madonna-grab',
    name: 'Madonna Grab',
    nameCn: '麦当娜抓',
    category: 'flat',
    group: '抓板',
    icon: '🎤',
    description: '前手抓板尾，后腿向后踢出'
  },
  {
    id: 'christ-air',
    name: 'Christ Air',
    nameCn: '基督飞',
    category: 'flat',
    group: '抓板',
    icon: '✝️',
    description: '空中张开双臂像十字架，松开板'
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
    id: 'roll-in',
    name: 'Roll In',
    nameCn: '滚入',
    category: 'transition',
    group: '弧面基础',
    icon: '🔄',
    description: '从平台边缘滚入弧面'
  },
  {
    id: 'pump',
    name: 'Pump',
    nameCn: '泵行',
    category: 'transition',
    group: '弧面基础',
    icon: '💪',
    description: '在弧面上通过膝盖弯曲获得速度'
  },
  {
    id: 'carve',
    name: 'Carve',
    nameCn: '切弯',
    category: 'transition',
    group: '弧面基础',
    icon: '↪️',
    description: '在弧面上大弧度转向'
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
    id: 'tail-stall',
    name: 'Tail Stall',
    nameCn: '板尾停',
    category: 'transition',
    group: '弧面基础',
    icon: '⏸️',
    description: '用板尾停在池边'
  },
  {
    id: 'nose-stall',
    name: 'Nose Stall',
    nameCn: '板头停',
    category: 'transition',
    group: '弧面基础',
    icon: '⏸️',
    description: '用板头停在池边'
  },
  {
    id: 'blunt-stall',
    name: 'Blunt Stall',
    nameCn: '钝停',
    category: 'transition',
    group: '弧面基础',
    icon: '⏸️',
    description: '后轮卡在池边，板身立起'
  },
  {
    id: 'noseblunt-stall',
    name: 'Noseblunt Stall',
    nameCn: '板头钝停',
    category: 'transition',
    group: '弧面基础',
    icon: '⏸️',
    description: '前轮卡在池边，板身立起'
  },
  {
    id: 'disaster',
    name: 'Disaster',
    nameCn: '灾难',
    category: 'transition',
    group: '弧面基础',
    icon: '💥',
    description: '板身搁在池边，前后轮悬空'
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
  },
  {
    id: 'mc-twist',
    name: 'McTwist',
    nameCn: '麦旋风',
    category: 'transition',
    group: '飞跃',
    icon: '🌪️',
    description: '空中540度旋转加抓板'
  },
  {
    id: 'mute-air',
    name: 'Mute Air',
    nameCn: '哑飞',
    category: 'transition',
    group: '飞跃',
    icon: '🤫',
    description: '空中 Mute Grab'
  },
  {
    id: 'method-air',
    name: 'Method Air',
    nameCn: '方法飞',
    category: 'transition',
    group: '飞跃',
    icon: '✋',
    description: '空中 Method Grab'
  },
  {
    id: 'indy-air',
    name: 'Indy Air',
    nameCn: '印第飞',
    category: 'transition',
    group: '飞跃',
    icon: '✋',
    description: '空中 Indy Grab'
  },
  {
    id: 'melon-air',
    name: 'Melon Air',
    nameCn: '甜瓜飞',
    category: 'transition',
    group: '飞跃',
    icon: '🍈',
    description: '空中 Melon Grab'
  },
  {
    id: 'alley-oop',
    name: 'Alley Oop',
    nameCn: '反向转',
    category: 'transition',
    group: '飞跃',
    icon: '🔄',
    description: '在弧面上向与滑行相反的方向转身'
  },
  {
    id: 'lip-slide',
    name: 'Lip Slide',
    nameCn: '唇滑',
    category: 'transition',
    group: '弧面进阶',
    icon: '🎿',
    description: '板身横在池边滑行'
  },
  {
    id: 'bertlemann-slide',
    name: 'Bertlemann Slide',
    nameCn: '伯特滑',
    category: 'transition',
    group: '弧面进阶',
    icon: '🎿',
    description: '在弧面上侧滑，用手撑地'
  },
  {
    id: 'layback-grind',
    name: 'Layback Grind',
    nameCn: '后仰磨',
    category: 'transition',
    group: '弧面进阶',
    icon: '🛤️',
    description: '后仰用后手撑在池边磨杆'
  },
  {
    id: 'sweeper',
    name: 'Sweeper',
    nameCn: '扫帚',
    category: 'transition',
    group: '弧面进阶',
    icon: '🧹',
    description: '后轮在池边滑行，后手扶地'
  },
  {
    id: 'egg-plant',
    name: 'Egg Plant',
    nameCn: '蛋plant',
    category: 'transition',
    group: '弧面进阶',
    icon: '🥚',
    description: '单手撑地倒立的弧面招式'
  },
  {
    id: 'hand-plant',
    name: 'Hand Plant',
    nameCn: '手倒立',
    category: 'transition',
    group: '弧面进阶',
    icon: '🤸',
    description: '单手撑地倒立'
  },
  {
    id: 'judo-air',
    name: 'Judo Air',
    nameCn: '柔道飞',
    category: 'transition',
    group: '飞跃',
    icon: '🥋',
    description: '空中前脚踢向前方，后手抓板'
  },
  {
    id: 'stalefish',
    name: 'Stalefish',
    nameCn: '臭鱼',
    category: 'transition',
    group: '飞跃',
    icon: '🐟',
    description: '空中 Stalefish Grab'
  },

  // ========== Nollie 招式 ==========
  {
    id: 'nollie',
    name: 'Nollie',
    nameCn: '反脚跳',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🦘',
    description: '用板头起跳的 Ollie'
  },
  {
    id: 'nollie-bs-180',
    name: 'Nollie BS 180',
    nameCn: '反脚背转',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🔄',
    description: 'Nollie 同时背转180度'
  },
  {
    id: 'nollie-fs-180',
    name: 'Nollie FS 180',
    nameCn: '反脚前转',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🔄',
    description: 'Nollie 同时前转180度'
  },
  {
    id: 'nollie-shuvit',
    name: 'Nollie Shuvit',
    nameCn: '反脚转板',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🔃',
    description: 'Nollie 时板转180度'
  },
  {
    id: 'nollie-kickflip',
    name: 'Nollie Kickflip',
    nameCn: '反脚尖翻',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🌀',
    description: 'Nollie 时的 Kickflip'
  },
  {
    id: 'nollie-heelflip',
    name: 'Nollie Heelflip',
    nameCn: '反脚跟翻',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🌀',
    description: 'Nollie 时的 Heelflip'
  },
  {
    id: 'nollie-varial-kickflip',
    name: 'Nollie Varial Kickflip',
    nameCn: '反脚转板尖翻',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🌪️',
    description: 'Nollie 时的 Varial Kickflip'
  },
  {
    id: 'nollie-varial-heelflip',
    name: 'Nollie Varial Heelflip',
    nameCn: '反脚转板跟翻',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🌪️',
    description: 'Nollie 时的 Varial Heelflip'
  },
  {
    id: 'nollie-treflip',
    name: 'Nollie 360 Flip',
    nameCn: '反脚大乱',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '💫',
    description: 'Nollie 时的 360 Flip'
  },
  {
    id: 'nollie-laser-flip',
    name: 'Nollie Laser Flip',
    nameCn: '反脚激光翻',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '⚡',
    description: 'Nollie 时的 Laser Flip'
  },
  {
    id: 'nollie-hardflip',
    name: 'Nollie Hardflip',
    nameCn: '反脚硬翻',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '💥',
    description: 'Nollie 时的 Hardflip'
  },
  {
    id: 'nollie-inward-heelflip',
    name: 'Nollie Inward Heelflip',
    nameCn: '反脚内跟翻',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🌪️',
    description: 'Nollie 时的 Inward Heelflip'
  },
  {
    id: 'nollie-impossible',
    name: 'Nollie Impossible',
    nameCn: '反脚不可能',
    category: 'flat',
    group: 'Nollie 系列',
    icon: '🤯',
    description: 'Nollie 时的 Impossible'
  },

  // ========== Switch 招式 ==========
  {
    id: 'switch-ollie',
    name: 'Switch Ollie',
    nameCn: '反脚豚跳',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🦘',
    description: '反脚站位的 Ollie'
  },
  {
    id: 'switch-bs-180',
    name: 'Switch BS 180',
    nameCn: '反脚背转',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🔄',
    description: '反脚站位背转180度'
  },
  {
    id: 'switch-fs-180',
    name: 'Switch FS 180',
    nameCn: '反脚前转',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🔄',
    description: '反脚站位前转180度'
  },
  {
    id: 'switch-pop-shuvit',
    name: 'Switch Pop Shuvit',
    nameCn: '反脚豚转板',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🔃',
    description: '反脚站位的 Pop Shuvit'
  },
  {
    id: 'switch-kickflip',
    name: 'Switch Kickflip',
    nameCn: '反脚尖翻',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🌀',
    description: '反脚站位的 Kickflip'
  },
  {
    id: 'switch-heelflip',
    name: 'Switch Heelflip',
    nameCn: '反脚跟翻',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🌀',
    description: '反脚站位的 Heelflip'
  },
  {
    id: 'switch-varial-kickflip',
    name: 'Switch Varial Kickflip',
    nameCn: '反脚转板尖翻',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🌪️',
    description: '反脚站位的 Varial Kickflip'
  },
  {
    id: 'switch-varial-heelflip',
    name: 'Switch Varial Heelflip',
    nameCn: '反脚转板跟翻',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🌪️',
    description: '反脚站位的 Varial Heelflip'
  },
  {
    id: 'switch-treflip',
    name: 'Switch 360 Flip',
    nameCn: '反脚大乱',
    category: 'flat',
    group: 'Switch 系列',
    icon: '💫',
    description: '反脚站位的 360 Flip'
  },
  {
    id: 'switch-laser-flip',
    name: 'Switch Laser Flip',
    nameCn: '反脚激光翻',
    category: 'flat',
    group: 'Switch 系列',
    icon: '⚡',
    description: '反脚站位的 Laser Flip'
  },
  {
    id: 'switch-hardflip',
    name: 'Switch Hardflip',
    nameCn: '反脚硬翻',
    category: 'flat',
    group: 'Switch 系列',
    icon: '💥',
    description: '反脚站位的 Hardflip'
  },
  {
    id: 'switch-inward-heelflip',
    name: 'Switch Inward Heelflip',
    nameCn: '反脚内跟翻',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🌪️',
    description: '反脚站位的 Inward Heelflip'
  },
  {
    id: 'switch-bigspin',
    name: 'Switch Bigspin',
    nameCn: '反脚大转',
    category: 'flat',
    group: 'Switch 系列',
    icon: '💫',
    description: '反脚站位的 Bigspin'
  },
  {
    id: 'switch-impossible',
    name: 'Switch Impossible',
    nameCn: '反脚不可能',
    category: 'flat',
    group: 'Switch 系列',
    icon: '🤯',
    description: '反脚站位的 Impossible'
  },

  // ========== Fakie 招式 ==========
  {
    id: 'fakie-ollie',
    name: 'Fakie Ollie',
    nameCn: '倒滑豚跳',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🦘',
    description: '倒滑站位的 Ollie'
  },
  {
    id: 'fakie-bs-180',
    name: 'Fakie BS 180',
    nameCn: '倒滑背转',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🔄',
    description: '倒滑站位背转180度'
  },
  {
    id: 'fakie-fs-180',
    name: 'Fakie FS 180',
    nameCn: '倒滑前转',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🔄',
    description: '倒滑站位前转180度'
  },
  {
    id: 'fakie-pop-shuvit',
    name: 'Fakie Pop Shuvit',
    nameCn: '倒滑豚转板',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🔃',
    description: '倒滑站位的 Pop Shuvit'
  },
  {
    id: 'fakie-kickflip',
    name: 'Fakie Kickflip',
    nameCn: '倒滑尖翻',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🌀',
    description: '倒滑站位的 Kickflip'
  },
  {
    id: 'fakie-heelflip',
    name: 'Fakie Heelflip',
    nameCn: '倒滑跟翻',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🌀',
    description: '倒滑站位的 Heelflip'
  },
  {
    id: 'fakie-varial-kickflip',
    name: 'Fakie Varial Kickflip',
    nameCn: '倒滑转板尖翻',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🌪️',
    description: '倒滑站位的 Varial Kickflip'
  },
  {
    id: 'fakie-varial-heelflip',
    name: 'Fakie Varial Heelflip',
    nameCn: '倒滑转板跟翻',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🌪️',
    description: '倒滑站位的 Varial Heelflip'
  },
  {
    id: 'fakie-treflip',
    name: 'Fakie 360 Flip',
    nameCn: '倒滑大乱',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '💫',
    description: '倒滑站位的 360 Flip'
  },
  {
    id: 'fakie-laser-flip',
    name: 'Fakie Laser Flip',
    nameCn: '倒滑激光翻',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '⚡',
    description: '倒滑站位的 Laser Flip'
  },
  {
    id: 'fakie-hardflip',
    name: 'Fakie Hardflip',
    nameCn: '倒滑硬翻',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '💥',
    description: '倒滑站位的 Hardflip'
  },
  {
    id: 'fakie-inward-heelflip',
    name: 'Fakie Inward Heelflip',
    nameCn: '倒滑内跟翻',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🌪️',
    description: '倒滑站位的 Inward Heelflip'
  },
  {
    id: 'fakie-bigspin',
    name: 'Fakie Bigspin',
    nameCn: '倒滑大转',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '💫',
    description: '倒滑站位的 Bigspin'
  },
  {
    id: 'half-cab',
    name: 'Half Cab',
    nameCn: '半转',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🔄',
    description: 'Fakie BS 180 的经典称呼'
  },
  {
    id: 'full-cab',
    name: 'Full Cab',
    nameCn: '全转',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🔄',
    description: 'Fakie BS 360'
  },
  {
    id: 'caballerial',
    name: 'Caballerial',
    nameCn: '卡巴雷',
    category: 'flat',
    group: 'Fakie 系列',
    icon: '🔄',
    description: 'Fakie BS 360 Ollie，Steve Caballero 发明'
  },

  // ========== Freestyle 自由式招式 ==========
  {
    id: 'pogo',
    name: 'Pogo',
    nameCn: '单脚立板',
    category: 'flat',
    group: 'Freestyle',
    icon: '🎪',
    description: '用板尾立起单脚站立'
  },
  {
    id: 'railstand',
    name: 'Railstand',
    nameCn: '侧立板',
    category: 'flat',
    group: 'Freestyle',
    icon: '🛹',
    description: '板侧立，双脚站在轮轴上'
  },
  {
    id: 'primo',
    name: 'Primo',
    nameCn: '普里莫',
    category: 'flat',
    group: 'Freestyle',
    icon: '🛹',
    description: '板侧立滑行'
  },
  {
    id: 'primo-slide',
    name: 'Primo Slide',
    nameCn: '普里莫滑',
    category: 'flat',
    group: 'Freestyle',
    icon: '🎿',
    description: '板侧立滑行摩擦减速'
  },
  {
    id: 'spacewalk',
    name: 'Spacewalk',
    nameCn: '太空步',
    category: 'flat',
    group: 'Freestyle',
    icon: '🚶',
    description: 'Tic-tac 前进同时转向'
  },
  {
    id: 'end-over',
    name: 'End Over',
    nameCn: '端对端翻',
    category: 'flat',
    group: 'Freestyle',
    icon: '🔄',
    description: '板绕长轴翻转'
  },
  {
    id: 'casper',
    name: 'Casper',
    nameCn: '幽灵',
    category: 'flat',
    group: 'Freestyle',
    icon: '👻',
    description: '板底朝上，前脚勾住板头'
  },
  {
    id: 'truckstand',
    name: 'Truckstand',
    nameCn: '轮架立',
    category: 'flat',
    group: 'Freestyle',
    icon: '🛹',
    description: '用后轮架立起，前脚踩在板底'
  },
  {
    id: 'fingerflip',
    name: 'Fingerflip',
    nameCn: '手翻板',
    category: 'flat',
    group: 'Freestyle',
    icon: '✋',
    description: '用手翻板的招式'
  },
  {
    id: 'toe-side',
    name: 'Toe Side 360',
    nameCn: '脚尖转',
    category: 'flat',
    group: 'Freestyle',
    icon: '🔄',
    description: '用脚尖勾板转360度'
  },

  // ========== Manual 变体 ==========
  {
    id: 'nose-manual-nollie-out',
    name: 'Nose Manual Nollie Out',
    nameCn: '反翘出',
    category: 'flat',
    group: 'Manual 变体',
    icon: '⚖️',
    description: 'Nose Manual 后用 Nollie 离开'
  },
  {
    id: 'manual-kickflip-out',
    name: 'Manual Kickflip Out',
    nameCn: '翘尖翻出',
    category: 'flat',
    group: 'Manual 变体',
    icon: '⚖️',
    description: 'Manual 后用 Kickflip 离开'
  },
  {
    id: 'manual-heelflip-out',
    name: 'Manual Heelflip Out',
    nameCn: '翘跟翻出',
    category: 'flat',
    group: 'Manual 变体',
    icon: '⚖️',
    description: 'Manual 后用 Heelflip 离开'
  },
  {
    id: 'manual-shuvit-out',
    name: 'Manual Shuvit Out',
    nameCn: '翘转板出',
    category: 'flat',
    group: 'Manual 变体',
    icon: '⚖️',
    description: 'Manual 后用 Shuvit 离开'
  },
  {
    id: 'manual-180-out',
    name: 'Manual 180 Out',
    nameCn: '翘转出',
    category: 'flat',
    group: 'Manual 变体',
    icon: '⚖️',
    description: 'Manual 后用 180 Ollie 离开'
  },

  // ========== 组合招式 ==========
  {
    id: 'double-treflip',
    name: 'Double 360 Flip',
    nameCn: '双大乱',
    category: 'flat',
    group: '组合招式',
    icon: '💫',
    description: '板翻转两圈的 360 Flip'
  },
  {
    id: 'double-laser-flip',
    name: 'Double Laser Flip',
    nameCn: '双激光翻',
    category: 'flat',
    group: '组合招式',
    icon: '⚡',
    description: '板翻转两圈的 Laser Flip'
  },
  {
    id: 'bigspin-kickflip',
    name: 'Bigspin Kickflip',
    nameCn: '大转尖翻',
    category: 'flat',
    group: '组合招式',
    icon: '💫',
    description: 'Bigspin + Kickflip'
  },
  {
    id: 'bigspin-heelflip',
    name: 'Bigspin Heelflip',
    nameCn: '大转跟翻',
    category: 'flat',
    group: '组合招式',
    icon: '💫',
    description: 'Bigspin + Heelflip'
  },
  {
    id: 'tornado',
    name: 'Tornado',
    nameCn: '龙卷风',
    category: 'flat',
    group: '组合招式',
    icon: '🌪️',
    description: '360 Shuvit + Body Varial'
  },
  {
    id: 'hurricane',
    name: 'Hurricane',
    nameCn: '飓风',
    category: 'flat',
    group: '组合招式',
    icon: '🌀',
    description: 'BS 270 + FS 90 的组合'
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
