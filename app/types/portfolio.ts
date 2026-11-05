/**
 * Bilingual copy stored in the portfolio YAML files.
 * French and English use the same keys. A missing key fails the build.
 */
export type Localized = {
  fr: string
  en: string
}

/** Bento cell size. `regular` is one cell, `wide` spans columns, `tall` spans rows. */
export type ProjectImageSpan = 'regular' | 'wide' | 'tall'

/**
 * One public visual.
 * `src` is a `[TO PROVIDE]` slot or a file under `public/media/projects/`.
 */
export type ProjectImage = {
  id: string
  src: string
  span: ProjectImageSpan
  alt: Localized
}

export type Project = {
  id: string
  restricted: boolean
  placeholder: boolean
  organization: string
  title: Localized
  summary: Localized
  description: Localized
  stack: string[]
  link: string | null
  images: ProjectImage[]
}

export type ProjectFile = {
  lead: Localized
  items: Project[]
}

/** Categories a path step may carry. Retail and restaurant stay readable, but quiet. */
export const experienceTags = ['education', 'professional', 'retail', 'restaurant'] as const

export type ExperienceTag = typeof experienceTags[number]

export type ExperienceStep = {
  id: string
  organization: string
  period: string
  title: Localized
  detail: Localized
  tags: ExperienceTag[]
}

export type ExperienceFile = {
  lead: Localized
  steps: ExperienceStep[]
}

export type SkillGroup = {
  id: string
  title: Localized
  items: string[]
}

export type SkillFile = {
  lead: Localized
  groups: SkillGroup[]
}

export type Interest = {
  id: string
  icon: string
  wide: boolean
  title: Localized
  detail: Localized
}

export type InterestFile = {
  lead: Localized
  items: Interest[]
}

export type Profile = {
  email: string
}

export type Social = {
  githubUrl: string
  linkedinUrl: string
  instagramHandle: string
  linkedinPosts: string[]
}

export type Availability = {
  untilDate: string
  timeZone: string
}

export type PortfolioContent = {
  profile: Profile
  experiences: ExperienceFile
  skills: SkillFile
  projects: ProjectFile
  interests: InterestFile
  social: Social
  availability: Availability
}
