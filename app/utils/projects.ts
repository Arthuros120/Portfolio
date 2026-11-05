import type { ProjectImage } from '../types/portfolio'
import { localized } from './localized'

const placeholderPrefix = /^\s*\[(?:TO PROVIDE|PLACEHOLDER)\b/
const assetPattern = /^\/media\/projects\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:svg|png|jpe?g|webp|avif)$/

/**
 * One image ready for a card, a bento tile, or the lightbox.
 * `src` is null while the file is still a placeholder.
 */
export type ProjectImageView = {
  id: string
  src: string | null
  alt: string
  span: ProjectImage['span']
}

/**
 * Return a local public asset path.
 * Placeholders and anything that is not a project file stay closed.
 */
export function projectAssetSrc(src: string): string | null {
  const value = src.trim()

  if (placeholderPrefix.test(value) || !assetPattern.test(value)) {
    return null
  }

  return value
}

/**
 * Pick the locale string and hide a missing file.
 */
export function toProjectImageView(image: ProjectImage, locale: string): ProjectImageView {
  return {
    id: image.id,
    src: projectAssetSrc(image.src),
    alt: localized(image.alt, locale),
    span: image.span
  }
}
