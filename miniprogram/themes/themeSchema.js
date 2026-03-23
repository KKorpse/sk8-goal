const REQUIRED_STRING_FIELDS = [
  'id',
  'name',
  'description',
  'preview',
  'className'
]

const REQUIRED_SCENE_FIELDS = [
  'avatarIcon',
  'startIcon',
  'startLabel',
  'endIcon',
  'endLabel',
  'emptyEmoji',
  'emptyHint'
]

const REQUIRED_AUTHOR_FIELDS = [
  'heroIcon',
  'heroTitle',
  'avatarIcon',
  'roleText',
  'introText',
  'socialIcon',
  'socialTitle',
  'tipText',
  'tipSub'
]

function assertNonEmptyString(value, fieldPath) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Theme field "${fieldPath}" must be a non-empty string`)
  }
}

function validateFieldGroup(theme, groupName, requiredFields) {
  const group = theme[groupName]

  if (!group || typeof group !== 'object') {
    throw new Error(`Theme "${theme.id || 'unknown'}" is missing "${groupName}" object`)
  }

  requiredFields.forEach((fieldName) => {
    assertNonEmptyString(group[fieldName], `${groupName}.${fieldName}`)
  })
}

function validateNavigationBar(theme) {
  const navigationBar = theme.navigationBar

  if (!navigationBar || typeof navigationBar !== 'object') {
    throw new Error(`Theme "${theme.id || 'unknown'}" is missing "navigationBar" object`)
  }

  assertNonEmptyString(navigationBar.frontColor, 'navigationBar.frontColor')
  assertNonEmptyString(navigationBar.backgroundColor, 'navigationBar.backgroundColor')
}

function validateComponentMap(theme) {
  const { componentMap } = theme

  if (componentMap === undefined) {
    return
  }

  if (!componentMap || typeof componentMap !== 'object' || Array.isArray(componentMap)) {
    throw new Error(`Theme "${theme.id || 'unknown'}" field "componentMap" must be an object`)
  }

  Object.keys(componentMap).forEach((key) => {
    assertNonEmptyString(componentMap[key], `componentMap.${key}`)
  })
}

function validateTheme(theme) {
  if (!theme || typeof theme !== 'object') {
    throw new Error('Theme definition must be an object')
  }

  REQUIRED_STRING_FIELDS.forEach((fieldName) => {
    assertNonEmptyString(theme[fieldName], fieldName)
  })

  validateNavigationBar(theme)
  validateComponentMap(theme)
  validateFieldGroup(theme, 'sceneConfig', REQUIRED_SCENE_FIELDS)
  validateFieldGroup(theme, 'authorContent', REQUIRED_AUTHOR_FIELDS)

  return theme
}

function validateThemeMap(themeMap) {
  if (!themeMap || typeof themeMap !== 'object') {
    throw new Error('Theme registry must be an object')
  }

  Object.keys(themeMap).forEach((themeId) => {
    const theme = validateTheme(themeMap[themeId])

    if (theme.id !== themeId) {
      throw new Error(`Theme registry key "${themeId}" must match theme.id "${theme.id}"`)
    }
  })

  return themeMap
}

module.exports = {
  REQUIRED_STRING_FIELDS,
  REQUIRED_SCENE_FIELDS,
  REQUIRED_AUTHOR_FIELDS,
  validateTheme,
  validateThemeMap
}
