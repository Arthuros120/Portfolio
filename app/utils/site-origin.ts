const httpsOrigin = /^https:\/\/[A-Za-z0-9.-]+(?::\d+)?$/
const ogImage = /^\/og\.(?:svg|png|jpe?g|webp|avif)$/

/**
 * https origin from profile.siteUrl.
 * A [TO PROVIDE] slot, or any other value, returns undefined.
 * Keep the pattern in sync with assertSiteUrl in content/load.mjs.
 */
export function publicOrigin(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim().replace(/\/$/, '')

  if (!httpsOrigin.test(trimmed)) {
    return undefined
  }

  return trimmed
}

/**
 * Public Open Graph image path.
 * A [TO PROVIDE] slot returns undefined. Only /og.* is accepted,
 * so a portrait of Arthur is never invented here.
 * Keep the pattern in sync with assertOgImage in content/load.mjs.
 */
export function publicOgImage(value: unknown): string | undefined {
  if (typeof value !== 'string' || !ogImage.test(value)) {
    return undefined
  }

  return value
}
