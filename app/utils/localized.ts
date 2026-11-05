import type { Localized } from '~/types/portfolio'

/**
 * Pick the French or English string from a YAML field.
 * French is the site default when the locale is not English.
 */
export function localized(value: Localized, locale: string): string {
  return locale === 'en' ? value.en : value.fr
}
