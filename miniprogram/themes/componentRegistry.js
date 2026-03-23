const DEFAULT_COMPONENT_MAP = {
  trickCard: '/components/trick-card/trick-card',
  achievementScene: '/components/achievement-scene/achievement-scene',
  profileLayout: '/components/profile-default/profile-default'
}

const TERRARIA_COMPONENT_MAP = {
  trickCard: '/components/terraria/trick-card-terraria/trick-card-terraria',
  achievementScene: '/components/terraria/achievement-scene-terraria/achievement-scene-terraria',
  profileLayout: '/components/terraria/profile-terraria/profile-terraria'
}

function getDefaultComponentMap() {
  return Object.assign({}, DEFAULT_COMPONENT_MAP)
}

function getTerrariaComponentMap() {
  return Object.assign({}, TERRARIA_COMPONENT_MAP)
}

function resolveComponentMap(theme) {
  return Object.assign({}, DEFAULT_COMPONENT_MAP, theme && theme.componentMap ? theme.componentMap : {})
}

module.exports = {
  DEFAULT_COMPONENT_MAP,
  TERRARIA_COMPONENT_MAP,
  getDefaultComponentMap,
  getTerrariaComponentMap,
  resolveComponentMap
}
