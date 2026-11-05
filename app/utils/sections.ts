/**
 * In-page section ids. Navigation uses these anchors on the home page.
 */
export const sectionIds = ['top', 'projects', 'career', 'skills', 'about', 'contact'] as const

export const navSectionIds = ['projects', 'career', 'skills', 'about', 'contact'] as const

export type SectionId = typeof sectionIds[number]

export type NavSectionId = typeof navSectionIds[number]
