import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const root = join(dirname(fileURLToPath(import.meta.url)))

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

/**
 * Read the portfolio YAML and refuse anything that does not match the schema.
 * Nuxt loads this while reading its config, so an invalid entry fails the build.
 */
export function loadPortfolioContent() {
  const content = {
    profile: readYaml('profile.yml'),
    projects: readYaml('projects.yml'),
    career: readYaml('career.yml'),
    skills: readYaml('skills.yml'),
    interests: readYaml('interests.yml')
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

  exactKeys(content, ['profile', 'projects', 'career', 'skills', 'interests'], 'content')
  assertNoConfidential(content, 'content')
  assertProfile(content.profile)
  assertProjects(content.projects)
  assertCareer(content.career)
  assertSkills(content.skills)
  assertInterests(content.interests)
}

/**
 * @param {string} name
 */
function readYaml(name) {
  const file = join(root, name)
  const parsed = parse(readFileSync(file, 'utf8'))

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
 * @param {unknown} value
 * @param {string} path
 */
function assertNoConfidential(value, path) {
  if (typeof value === 'string' && /monorga|enedis/i.test(value)) {
    fail(`${path} contains confidential project details`)
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoConfidential(item, `${path}.${index}`))
    return
  }

  if (isRecord(value)) {
    for (const [key, item] of Object.entries(value)) {
      assertNoConfidential(item, `${path}.${key}`)
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
 * @param {unknown} profile
 */
function assertProfile(profile) {
  if (!isRecord(profile)) {
    fail('profile must be an object')
  }

  exactKeys(profile, [
    'email',
    'githubUrl',
    'linkedinUrl',
    'instagramHandle',
    'linkedinPosts',
    'availability'
  ], 'profile')

  assertEmail(profile.email, 'profile.email')
  assertSlotOrHttps(profile.githubUrl, 'profile.githubUrl')
  assertSlotOrHttps(profile.linkedinUrl, 'profile.linkedinUrl')
  assertHandle(profile.instagramHandle, 'profile.instagramHandle')

  if (!Array.isArray(profile.linkedinPosts) || profile.linkedinPosts.length === 0) {
    fail('profile.linkedinPosts must list at least one URL or [TO PROVIDE] slot')
  }

  profile.linkedinPosts.forEach((post, index) => {
    assertSlotOrHttps(post, `profile.linkedinPosts.${index}`)
  })

  if (!isRecord(profile.availability)) {
    fail('profile.availability must be an object')
  }

  exactKeys(profile.availability, ['untilDate', 'timeZone'], 'profile.availability')
  assertDate(profile.availability.untilDate, 'profile.availability.untilDate')
  assertTimeZone(profile.availability.timeZone, 'profile.availability.timeZone')
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

  if (/^\s*\[(?:TO PROVIDE|PLACEHOLDER)\b/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return
  }

  fail(`${path} must be an email address or a [TO PROVIDE] slot`)
}

function assertSlotOrHttps(value, path) {
  nonEmptyString(value, path)

  if (typeof value !== 'string') {
    return
  }

  if (/^\s*\[(?:TO PROVIDE|PLACEHOLDER)\b/.test(value) || /^https:\/\/\S+$/.test(value)) {
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

  if (/^\s*\[(?:TO PROVIDE|PLACEHOLDER)\b/.test(value) || /^[A-Za-z0-9._]{1,30}$/.test(value)) {
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
 * @param {unknown} projects
 */
function assertProjects(projects) {
  if (!isRecord(projects)) {
    fail('projects must be an object')
  }

  exactKeys(projects, ['lead', 'items'], 'projects')
  localized(projects.lead, 'projects.lead')

  if (!Array.isArray(projects.items) || projects.items.length < 3 || projects.items.length > 4) {
    fail('projects.items must contain 3 or 4 projects')
  }

  const ids = new Set()

  projects.items.forEach((item, index) => {
    const path = `projects.items.${index}`

    if (!isRecord(item)) {
      fail(`${path} must be an object`)
    }

    exactKeys(item, ['id', 'placeholder', 'title', 'description', 'stack', 'link'], path)
    nonEmptyString(item.id, `${path}.id`)

    if (typeof item.id === 'string' && ids.has(item.id)) {
      fail(`${path}.id is duplicated`)
    }

    if (typeof item.id === 'string') {
      ids.add(item.id)
    }

    if (typeof item.placeholder !== 'boolean') {
      fail(`${path}.placeholder must be a boolean`)
    }

    localized(item.title, `${path}.title`)
    localized(item.description, `${path}.description`)

    if (!Array.isArray(item.stack) || item.stack.length === 0) {
      fail(`${path}.stack must list at least one technology`)
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
  })
}

/**
 * @param {unknown} career
 */
function assertCareer(career) {
  if (!isRecord(career)) {
    fail('career must be an object')
  }

  exactKeys(career, ['lead', 'steps'], 'career')
  localized(career.lead, 'career.lead')

  if (!Array.isArray(career.steps) || career.steps.length === 0) {
    fail('career.steps must contain at least one step')
  }

  career.steps.forEach((step, index) => {
    const path = `career.steps.${index}`

    if (!isRecord(step)) {
      fail(`${path} must be an object`)
    }

    exactKeys(step, ['id', 'organization', 'period', 'title', 'detail'], path)
    nonEmptyString(step.id, `${path}.id`)
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
