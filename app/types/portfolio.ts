/**
 * Bilingual copy stored in the portfolio YAML files.
 * French and English use the same keys. A missing key fails the build.
 */
export type Localized = {
  fr: string
  en: string
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
  images: string[]
}

export type ProjectFile = {
  lead: Localized
  items: Project[]
}

export type ExperienceStep = {
  id: string
  organization: string
  period: string
  title: Localized
  detail: Localized
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
