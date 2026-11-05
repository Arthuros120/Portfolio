/**
 * Bilingual copy stored in the portfolio YAML files.
 */
export type Localized = {
  fr: string
  en: string
}

export type Project = {
  id: string
  placeholder: boolean
  title: Localized
  description: Localized
  stack: string[]
  link: string | null
}

export type ProjectFile = {
  lead: Localized
  items: Project[]
}

export type CareerStep = {
  id: string
  organization: string
  period: string
  title: Localized
  detail: Localized
}

export type CareerFile = {
  lead: Localized
  steps: CareerStep[]
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
  githubUrl: string
  linkedinUrl: string
  instagramHandle: string
  linkedinPosts: string[]
  availability: {
    untilDate: string
    timeZone: string
  }
}

export type PortfolioContent = {
  profile: Profile
  projects: ProjectFile
  career: CareerFile
  skills: SkillFile
  interests: InterestFile
}
