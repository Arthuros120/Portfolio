import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const root = join(dirname(fileURLToPath(import.meta.url)))
const localeRoot = join(root, '../i18n/locales')

const requiredSkills = [
  'TypeScript',
  'Kotlin',
  'Nuxt',
  'AdonisJS',
  'Symfony',
  'PostgreSQL',
  'Tauri 2'
]

const interestIds = ['sailing', 'martial-arts', 'climbing', 'games', 'dj']

const interestIcons = [
  'i-lucide-sailboat',
  'i-lucide-swords',
  'i-lucide-mountain',
  'i-lucide-gamepad-2',
  'i-lucide-music'
]

const contentFiles = [
  'profile',
  'experiences',
  'skills',
  'projects',
  'interests',
  'social',
  'availability'
]

const fixtureMarker = '[PLACEHOLDER — layout fixture]'
const placeholderPattern = /^\s*\[(?:TO PROVIDE|PLACEHOLDER)\b/
const internalFigurePattern = /40[\s,.]?000|screenshot|\.(?:png|jpe?g|webp|gif)\b/i

/**
 * Read the portfolio YAML and refuse anything that does not match the schema.
 * Nuxt loads this while reading its config, so an invalid entry fails the build.
 */
export function loadPortfolioContent() {
  assertLocaleFiles()

  const content = {}

  for (const name of contentFiles) {
    content[name] = readYaml(`${name}.yml`)
  }

  assertPortfolioContent(content)

  return JSON.parse(JSON.stringify(content))
}

/**
 * @param {unknown} content
 */
export function assertPortfolioContent(content) {
  if (!isRecord(content)) {
    fail('content must be an object')
  }

  exactKeys(content, contentFiles, 'content')
  assertNoInternalMaterial(content, 'content')
  assertProfile(content.profile)
  assertExperiences(content.experiences)
  assertSkills(content.skills)
  assertProjects(content.projects)
  assertInterests(content.interests)
  assertSocial(content.social)
  assertAvailability(content.availability)
}

/**
 * Fail the build when the French and English message files do not share keys.
 */
function assertLocaleFiles() {
  const fr = readJson('fr.json')
  const en = readJson('en.json')
  assertSameKeys(fr, en, 'locales')
}

/**
 * @param {string} name
 */
function readJson(name) {
  const file = join(localeRoot, name)

  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unreadable JSON'
    fail(`${name} is not valid JSON: ${message}`)
  }
}

/**
 * @param {unknown} left
 * @param {unknown} right
 * @param {string} path
 */
function assertSameKeys(left, right, path) {
  if (!isRecord(left) || !isRecord(right)) {
    fail(`${path} must be an object in both locales`)
  }

  const leftKeys = Object.keys(left).sort()
  const rightKeys = Object.keys(right).sort()

  if (leftKeys.join('|') !== rightKeys.join('|')) {
    fail(`locale keys differ at ${path}`)
  }

  for (const key of leftKeys) {
    const leftValue = left[key]
    const rightValue = right[key]
    const leftTree = isRecord(leftValue)
    const rightTree = isRecord(rightValue)

    if (leftTree !== rightTree) {
      fail(`locale key ${path}.${key} has different shapes`)
    }

    if (leftTree && rightTree) {
      assertSameKeys(leftValue, rightValue, `${path}.${key}`)
    }
  }
}

/**
 * @param {string} name
 */
function readYaml(name) {
  const file = join(root, name)
  let parsed

  try {
    parsed = parse(readFileSync(file, 'utf8'))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unreadable YAML'
    fail(`${name} is not valid YAML: ${message}`)
  }

  if (parsed === null || parsed === undefined) {
    fail(`${name} is empty`)
  }

  return parsed
}

/**
 * @param {string} message
 */
function fail(message) {
  throw new Error(`Invalid portfolio content: ${message}`)
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * @param {Record<string, unknown>} value
 * @param {string[]} keys
 * @param {string} path
 */
function exactKeys(value, keys, path) {
  const actual = Object.keys(value).sort()
  const expected = [...keys].sort()

  if (actual.join('|') !== expected.join('|')) {
    fail(`${path} must have keys ${expected.join(', ')}`)
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @returns {{ fr: string, en: string }}
 */
function localized(value, path) {
  if (!isRecord(value)) {
    fail(`${path} must be an object with fr and en`)
  }

  exactKeys(value, ['fr', 'en'], path)

  if (typeof value.fr !== 'string' || value.fr.trim() === '') {
    fail(`${path}.fr must be a non-empty string`)
  }

  if (typeof value.en !== 'string' || value.en.trim() === '') {
    fail(`${path}.en must be a non-empty string`)
  }

  return { fr: value.fr, en: value.en }
}

/**
 * Reject screenshots and the known internal headcount.
 * The public names MonOrga and Enedis are allowed.
 *
 * @param {unknown} value
 * @param {string} path
 */
function assertNoInternalMaterial(value, path) {
  if (typeof value === 'string' && internalFigurePattern.test(value)) {
    fail(`${path} contains internal figures or screenshot material`)
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoInternalMaterial(item, `${path}.${index}`))
    return
  }

  if (isRecord(value)) {
    for (const [key, item] of Object.entries(value)) {
      assertNoInternalMaterial(item, `${path}.${key}`)
    }
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function nonEmptyString(value, path) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${path} must be a non-empty string`)
  }
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isPlaceholder(value) {
  return typeof value === 'string' && placeholderPattern.test(value)
}

/**
 * @param {unknown} profile
 */
function assertProfile(profile) {
  if (!isRecord(profile)) {
    fail('profile must be an object')
  }

  exactKeys(profile, ['email'], 'profile')
  assertEmail(profile.email, 'profile.email')
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function assertEmail(value, path) {
  nonEmptyString(value, path)

  if (typeof value !== 'string') {
    return
  }

  if (isPlaceholder(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return
  }

  fail(`${path} must be an email address or a [TO PROVIDE] slot`)
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function assertSlotOrHttps(value, path) {
  nonEmptyString(value, path)

  if (typeof value !== 'string') {
    return
  }

  if (isPlaceholder(value) || /^https:\/\/\S+$/.test(value)) {
    return
  }

  fail(`${path} must be an https URL or a [TO PROVIDE] slot`)
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function assertHandle(value, path) {
  nonEmptyString(value, path)

  if (typeof value !== 'string') {
    return
  }

  if (isPlaceholder(value) || /^[A-Za-z0-9._]{1,30}$/.test(value)) {
    return
  }

  fail(`${path} must be an Instagram handle or a [TO PROVIDE] slot`)
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function assertDate(value, path) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail(`${path} must be a YYYY-MM-DD date`)
  }

  if (typeof value !== 'string') {
    return
  }

  const [year, month, day] = value.split('-').map(Number)
  const probe = new Date(Date.UTC(year, month - 1, day))

  if (
    probe.getUTCFullYear() !== year
    || probe.getUTCMonth() !== month - 1
    || probe.getUTCDate() !== day
  ) {
    fail(`${path} is not a real calendar date`)
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function assertTimeZone(value, path) {
  nonEmptyString(value, path)

  if (typeof value !== 'string') {
    return
  }

  try {
    Intl.DateTimeFormat('en-US', { timeZone: value })
  } catch {
    fail(`${path} must be an IANA time zone`)
  }
}

/**
 * @param {unknown} social
 */
function assertSocial(social) {
  if (!isRecord(social)) {
    fail('social must be an object')
  }

  exactKeys(social, [
    'githubUrl',
    'linkedinUrl',
    'instagramHandle',
    'linkedinPosts'
  ], 'social')

  assertSlotOrHttps(social.githubUrl, 'social.githubUrl')
  assertSlotOrHttps(social.linkedinUrl, 'social.linkedinUrl')
  assertHandle(social.instagramHandle, 'social.instagramHandle')

  if (!Array.isArray(social.linkedinPosts) || social.linkedinPosts.length === 0) {
    fail('social.linkedinPosts must list at least one URL or [TO PROVIDE] slot')
  }

  social.linkedinPosts.forEach((post, index) => {
    assertSlotOrHttps(post, `social.linkedinPosts.${index}`)
  })
}

/**
 * @param {unknown} availability
 */
function assertAvailability(availability) {
  if (!isRecord(availability)) {
    fail('availability must be an object')
  }

  exactKeys(availability, ['untilDate', 'timeZone'], 'availability')
  assertDate(availability.untilDate, 'availability.untilDate')
  assertTimeZone(availability.timeZone, 'availability.timeZone')
}

/**
 * @param {unknown} experiences
 */
function assertExperiences(experiences) {
  if (!isRecord(experiences)) {
    fail('experiences must be an object')
  }

  exactKeys(experiences, ['lead', 'steps'], 'experiences')
  localized(experiences.lead, 'experiences.lead')

  if (!Array.isArray(experiences.steps) || experiences.steps.length === 0) {
    fail('experiences.steps must contain at least one step')
  }

  const ids = new Set()

  experiences.steps.forEach((step, index) => {
    const path = `experiences.steps.${index}`

    if (!isRecord(step)) {
      fail(`${path} must be an object`)
    }

    exactKeys(step, ['id', 'organization', 'period', 'title', 'detail'], path)
    nonEmptyString(step.id, `${path}.id`)

    if (typeof step.id === 'string' && ids.has(step.id)) {
      fail(`${path}.id is duplicated`)
    }

    if (typeof step.id === 'string') {
      ids.add(step.id)
    }

    nonEmptyString(step.organization, `${path}.organization`)
    nonEmptyString(step.period, `${path}.period`)
    localized(step.title, `${path}.title`)
    localized(step.detail, `${path}.detail`)
  })
}

/**
 * @param {unknown} skills
 */
function assertSkills(skills) {
  if (!isRecord(skills)) {
    fail('skills must be an object')
  }

  exactKeys(skills, ['lead', 'groups'], 'skills')
  localized(skills.lead, 'skills.lead')

  if (!Array.isArray(skills.groups) || skills.groups.length === 0) {
    fail('skills.groups must contain at least one group')
  }

  const names = []

  skills.groups.forEach((group, index) => {
    const path = `skills.groups.${index}`

    if (!isRecord(group)) {
      fail(`${path} must be an object`)
    }

    exactKeys(group, ['id', 'title', 'items'], path)
    nonEmptyString(group.id, `${path}.id`)
    localized(group.title, `${path}.title`)

    if (!Array.isArray(group.items) || group.items.length === 0) {
      fail(`${path}.items must list at least one skill`)
    }

    group.items.forEach((item, itemIndex) => {
      nonEmptyString(item, `${path}.items.${itemIndex}`)

      if (typeof item === 'string') {
        names.push(item)
      }
    })
  })

  const unique = [...new Set(names)].sort()
  const expected = [...requiredSkills].sort()

  if (unique.join('|') !== expected.join('|')) {
    fail(`skills must list exactly ${expected.join(', ')}`)
  }
}

/**
 * @param {unknown} projects
 */
function assertProjects(projects) {
  if (!isRecord(projects)) {
    fail('projects must be an object')
  }

  exactKeys(projects, ['lead', 'items'], 'projects')
  localized(projects.lead, 'projects.lead')

  if (!Array.isArray(projects.items) || projects.items.length === 0) {
    fail('projects.items must contain at least one project')
  }

  const ids = new Set()

  projects.items.forEach((item, index) => {
    const path = `projects.items.${index}`

    if (!isRecord(item)) {
      fail(`${path} must be an object`)
    }

    exactKeys(item, [
      'id',
      'restricted',
      'placeholder',
      'organization',
      'title',
      'summary',
      'description',
      'stack',
      'link',
      'images'
    ], path)

    nonEmptyString(item.id, `${path}.id`)

    if (typeof item.id === 'string' && ids.has(item.id)) {
      fail(`${path}.id is duplicated`)
    }

    if (typeof item.id === 'string') {
      ids.add(item.id)
    }

    if (typeof item.restricted !== 'boolean') {
      fail(`${path}.restricted must be a boolean`)
    }

    if (typeof item.placeholder !== 'boolean') {
      fail(`${path}.placeholder must be a boolean`)
    }

    nonEmptyString(item.organization, `${path}.organization`)
    const title = localized(item.title, `${path}.title`)
    const summary = localized(item.summary, `${path}.summary`)
    const description = localized(item.description, `${path}.description`)

    if (!Array.isArray(item.stack)) {
      fail(`${path}.stack must be a list`)
    }

    const seen = new Set()

    item.stack.forEach((tech, techIndex) => {
      nonEmptyString(tech, `${path}.stack.${techIndex}`)

      if (typeof tech === 'string' && seen.has(tech)) {
        fail(`${path}.stack.${techIndex} is duplicated`)
      }

      if (typeof tech === 'string') {
        seen.add(tech)
      }
    })

    if (item.link !== null) {
      assertSlotOrHttps(item.link, `${path}.link`)
    }

    if (!Array.isArray(item.images)) {
      fail(`${path}.images must be a list`)
    }

    if (item.images.length > 0) {
      fail(`${path}.images must stay empty until public assets are provided`)
    }

    if (item.placeholder === true) {
      assertLayoutFixture(title, summary, description, path)
    }

    if (item.restricted === true) {
      assertRestrictedProject(item, title, summary, description, path)
    }
  })

  if (!ids.has('monorga')) {
    fail('projects.items must include monorga')
  }
}

/**
 * Layout fixtures are allowed only when every visible string carries the marker.
 *
 * @param {{ fr: string, en: string }} title
 * @param {{ fr: string, en: string }} summary
 * @param {{ fr: string, en: string }} description
 * @param {string} path
 */
function assertLayoutFixture(title, summary, description, path) {
  for (const [field, value] of Object.entries({ title, summary, description })) {
    if (!value.fr.includes(fixtureMarker) || !value.en.includes(fixtureMarker)) {
      fail(`${path}.${field} must include ${fixtureMarker} in fr and en`)
    }
  }
}

/**
 * Restricted entries keep the public name and placeholder framing only.
 *
 * @param {Record<string, unknown>} item
 * @param {{ fr: string, en: string }} title
 * @param {{ fr: string, en: string }} summary
 * @param {{ fr: string, en: string }} description
 * @param {string} path
 */
function assertRestrictedProject(item, title, summary, description, path) {
  if (item.placeholder === true) {
    fail(`${path} cannot be both restricted and a layout fixture`)
  }

  if (item.id !== 'monorga') {
    fail(`${path}.id restricted projects are limited to monorga`)
  }

  if (item.organization !== 'Enedis') {
    fail(`${path}.organization must stay Enedis`)
  }

  if (title.fr !== 'MonOrga' || title.en !== 'MonOrga') {
    fail(`${path}.title must stay MonOrga in both locales`)
  }

  assertRestrictedCopy(summary.fr, `${path}.summary.fr`)
  assertRestrictedCopy(summary.en, `${path}.summary.en`)
  assertRestrictedCopy(description.fr, `${path}.description.fr`)
  assertRestrictedCopy(description.en, `${path}.description.en`)

  if (item.link !== null && !isPlaceholder(item.link)) {
    fail(`${path}.link must stay a placeholder`)
  }

  if (!Array.isArray(item.stack)) {
    return
  }

  item.stack.forEach((tech, index) => {
    if (!isPlaceholder(tech)) {
      fail(`${path}.stack.${index} must stay a placeholder`)
    }
  })
}

/**
 * @param {string} value
 * @param {string} path
 */
function assertRestrictedCopy(value, path) {
  if (!isPlaceholder(value)) {
    fail(`${path} must stay a placeholder`)
  }

  if (/\d/.test(value) || /https?:\/\//i.test(value)) {
    fail(`${path} must not include figures or links`)
  }
}

/**
 * @param {unknown} interests
 */
function assertInterests(interests) {
  if (!isRecord(interests)) {
    fail('interests must be an object')
  }

  exactKeys(interests, ['lead', 'items'], 'interests')
  localized(interests.lead, 'interests.lead')

  if (!Array.isArray(interests.items)) {
    fail('interests.items must be a list')
  }

  const ids = []

  interests.items.forEach((item, index) => {
    const path = `interests.items.${index}`

    if (!isRecord(item)) {
      fail(`${path} must be an object`)
    }

    exactKeys(item, ['id', 'icon', 'wide', 'title', 'detail'], path)
    nonEmptyString(item.id, `${path}.id`)

    if (typeof item.id === 'string') {
      ids.push(item.id)
    }

    if (typeof item.icon !== 'string' || !interestIcons.includes(item.icon)) {
      fail(`${path}.icon is not a bundled interest icon`)
    }

    if (typeof item.wide !== 'boolean') {
      fail(`${path}.wide must be a boolean`)
    }

    localized(item.title, `${path}.title`)
    localized(item.detail, `${path}.detail`)
  })

  if (ids.join('|') !== interestIds.join('|')) {
    fail(`interests.items must be ${interestIds.join(', ')} in that order`)
  }
}
