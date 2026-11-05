import type { SkillCategory } from '~/types/portfolio'

export type SkillGroup<T extends { category: SkillCategory }> = {
  category: SkillCategory
  items: T[]
}

/**
 * Group skills by category, keeping the order they first appear in YAML.
 */
export function groupSkills<T extends { category: SkillCategory }>(items: readonly T[]): SkillGroup<T>[] {
  const groups: SkillGroup<T>[] = []

  for (const item of items) {
    const existing = groups.find(group => group.category === item.category)

    if (existing) {
      existing.items.push(item)
      continue
    }

    groups.push({ category: item.category, items: [item] })
  }

  return groups
}
