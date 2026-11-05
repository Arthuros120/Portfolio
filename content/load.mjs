import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const root = join(dirname(fileURLToPath(import.meta.url)))
const localeRoot = join(root, '../i18n/locales')
const publicRoot = join(root, '../public')

const skillCatalog = [
  { id: 'typescript', category: 'languages', label: 'TypeScript', icon: 'i-simple-icons-typescript' },
  { id: 'kotlin', category: 'languages', label: 'Kotlin', icon: 'i-simple-icons-kotlin' },
  { id: 'nuxt', category: 'frameworks', label: 'Nuxt', icon: 'i-simple-icons-nuxt' },
  { id: 'adonisjs', category: 'frameworks', label: 'AdonisJS', icon: 'i-simple-icons-adonisjs' },
  { id: 'symfony', category: 'frameworks', label: 'Symfony', icon: 'i-simple-icons-symfony' },
  { id: 'tauri', category: 'frameworks', label: 'Tauri 2', icon: 'i-simple-icons-tauri' },
  { id: 'postgresql', category: 'data', label: 'PostgreSQL', icon: 'i-simple-icons-postgresql' }
]

const interestIds = ['sailing', 'martial-arts', 'climbing', 'games', 'dj']

const experienceTags = ['education', 'professional', 'retail', 'restaurant']

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
const internalFigurePattern = /40[\s,.]?000|\bscreenshots?\b/i
const mediaFilePattern = /\.(?:png|jpe?g|webp|gif|avif|svg)\b/i
const projectImageSrcPath = /(?:^|\.)images\.\d+\.src$/
const projectAssetPattern = /^\/media\/projects\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:svg|png|jpe?g|webp|avif)$/
const rasterAssetPattern = /\.(?:png|jpe?g|webp|gif|avif)$/i
const modalIdPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,80}$/
const projectImageSpans = ['regular', 'wide', 'tall']

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
 * True for the known internal headcount, the word screenshot, or a media
 * filename outside a project image `src` (those paths are checked on their own).
 *
 * @param {string} value
 * @param {string} path
 */
function hasInternalMaterial(value, path) {
  if (internalFigurePattern.test(value)) {
    return true
  }

  return mediaFilePattern.test(value) && !projectImageSrcPath.test(path)
}

/**
 * Reject screenshots and the known internal headcount.
 * The public names MonOrga and Enedis are allowed.
 *
 * @param {unknown} value
 * @param {string} path
 */
function assertNoInternalMaterial(value, path) {
  if (typeof value === 'string' && hasInternalMaterial(value, path)) {
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

    assertExperienceKeys(step, path)
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
    assertExperienceTags(step, path)
  })
}

/**
 * Required path fields, plus optional category tags.
 * Missing tags become an empty list so the page can read them.
 *
 * @param {Record<string, unknown>} step
 * @param {string} path
 */
function assertExperienceKeys(step, path) {
  const required = ['id', 'organization', 'period', 'title', 'detail']
  const allowed = new Set([...required, 'tags'])

  for (const key of required) {
    if (!Object.hasOwn(step, key)) {
      fail(`${path} must have keys ${required.join(', ')}`)
    }
  }

  for (const key of Object.keys(step)) {
    if (!allowed.has(key)) {
      fail(`${path} must have keys ${required.join(', ')}`)
    }
  }
}

/**
 * @param {Record<string, unknown>} step
 * @param {string} path
 */
function assertExperienceTags(step, path) {
  if (step.tags === undefined) {
    step.tags = []
  }

  if (!Array.isArray(step.tags)) {
    fail(`${path}.tags must be a list`)
  }

  const seen = new Set()

  step.tags.forEach((tag, index) => {
    if (typeof tag !== 'string' || !experienceTags.includes(tag)) {
      fail(`${path}.tags.${index} must be one of ${experienceTags.join(', ')}`)
    }

    if (seen.has(tag)) {
      fail(`${path}.tags.${index} is duplicated`)
    }

    seen.add(tag)
  })
}

/**
 * Logos and usage notes. Category headings are locale strings, not YAML copy.
 *
 * @param {unknown} skills
 */
function assertSkills(skills) {
  if (!isRecord(skills)) {
    fail('skills must be an object')
  }

  exactKeys(skills, ['lead', 'items'], 'skills')
  localized(skills.lead, 'skills.lead')

  if (!Array.isArray(skills.items) || skills.items.length === 0) {
    fail('skills.items must contain at least one skill')
  }

  const ids = new Set()

  skills.items.forEach((item, index) => {
    const path = `skills.items.${index}`

    if (!isRecord(item)) {
      fail(`${path} must be an object`)
    }

    exactKeys(item, ['id', 'category', 'label', 'icon', 'blurb'], path)
    nonEmptyString(item.id, `${path}.id`)

    const known = skillCatalog.find(entry => entry.id === item.id)

    if (!known) {
      fail(`${path}.id is not a known skill`)
    }

    if (typeof item.id === 'string' && ids.has(item.id)) {
      fail(`${path}.id is duplicated`)
    }

    if (typeof item.id === 'string') {
      ids.add(item.id)
    }

    if (!known) {
      return
    }

    if (item.category !== known.category) {
      fail(`${path}.category must be ${known.category}`)
    }

    if (item.label !== known.label) {
      fail(`${path}.label must stay ${known.label}`)
    }

    if (item.icon !== known.icon) {
      fail(`${path}.icon must be the bundled ${known.icon} icon`)
    }

    localized(item.blurb, `${path}.blurb`)
  })

  const expected = skillCatalog.map(entry => entry.id).sort()
  const actual = [...ids].sort()

  if (actual.join('|') !== expected.join('|')) {
    fail(`skills.items must list ${skillCatalog.map(entry => entry.label).join(', ')}`)
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
  const imageIds = new Set()

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

    assertProjectImages(item, path, imageIds)

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
 * Public visuals. An empty list is valid. A restricted project may only
 * carry a placeholder or a public SVG, never a raster screenshot.
 *
 * @param {Record<string, unknown>} item
 * @param {string} path
 * @param {Set<string>} imageIds
 */
function assertProjectImages(item, path, imageIds) {
  if (!Array.isArray(item.images)) {
    fail(`${path}.images must be a list`)
  }

  item.images.forEach((image, index) => {
    const imagePath = `${path}.images.${index}`

    if (!isRecord(image)) {
      fail(`${imagePath} must be an object`)
    }

    exactKeys(image, ['id', 'src', 'span', 'alt'], imagePath)
    nonEmptyString(image.id, `${imagePath}.id`)

    if (typeof image.id !== 'string' || !modalIdPattern.test(image.id)) {
      fail(`${imagePath}.id must be a modal id`)
    }

    if (imageIds.has(image.id)) {
      fail(`${imagePath}.id is duplicated`)
    }

    imageIds.add(image.id)

    if (typeof image.span !== 'string' || !projectImageSpans.includes(image.span)) {
      fail(`${imagePath}.span must be regular, wide, or tall`)
    }

    const alt = localized(image.alt, `${imagePath}.alt`)
    assertImageSrc(image.src, item.restricted === true, imagePath)

    if (item.placeholder === true) {
      if (!alt.fr.includes(fixtureMarker) || !alt.en.includes(fixtureMarker)) {
        fail(`${imagePath}.alt must include ${fixtureMarker} in fr and en`)
      }
    }

    if (item.restricted === true) {
      assertRestrictedCopy(alt.fr, `${imagePath}.alt.fr`)
      assertRestrictedCopy(alt.en, `${imagePath}.alt.en`)
    }
  })
}

/**
 * @param {unknown} src
 * @param {boolean} restricted
 * @param {string} path
 */
function assertImageSrc(src, restricted, path) {
  const srcPath = `${path}.src`
  nonEmptyString(src, srcPath)

  if (typeof src !== 'string' || isPlaceholder(src)) {
    return
  }

  if (!projectAssetPattern.test(src)) {
    fail(`${srcPath} must be a public /media/projects path or a [TO PROVIDE] slot`)
  }

  if (restricted && rasterAssetPattern.test(src)) {
    fail(`${srcPath} cannot be a raster image on a restricted project`)
  }

  const relative = src.replace(/^\//, '')
  const file = join(publicRoot, relative)
  const rootWithSep = publicRoot.endsWith('/') ? publicRoot : `${publicRoot}/`

  if (!file.startsWith(rootWithSep)) {
    fail(`${srcPath} must stay inside public assets`)
  }

  if (!existsSync(file)) {
    fail(`${srcPath} file is missing`)
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
