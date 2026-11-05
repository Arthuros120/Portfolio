import type { LinkedInPost } from '~/types/portfolio'

const placeholderPrefix = /^\s*\[(?:TO PROVIDE|PLACEHOLDER)\b/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const httpsPattern = /^https:\/\/\S+$/
const handlePattern = /^[A-Za-z0-9._]{1,30}$/

/**
 * Return a mailbox only when the content value is a real address.
 * Placeholders and anything that is not an email stay closed.
 */
export function resolvePublicEmail(value: string): string | null {
  const email = value.trim()

  if (placeholderPrefix.test(email) || !emailPattern.test(email)) {
    return null
  }

  return email
}

/**
 * Return an https URL, or null while the slot is still a placeholder.
 */
export function resolveHttpsUrl(value: string | null): string | null {
  if (value === null) {
    return null
  }

  const url = value.trim()

  if (placeholderPrefix.test(url) || !httpsPattern.test(url)) {
    return null
  }

  return url
}

/**
 * Build an Instagram profile URL from a public handle.
 * Placeholders and anything that is not a handle stay closed.
 */
export function resolveInstagramUrl(handle: string): string | null {
  const value = handle.trim()

  if (placeholderPrefix.test(value) || !handlePattern.test(value)) {
    return null
  }

  return `https://instagram.com/${value}`
}

/**
 * Pre-filled mailto URL. Call it only with a real mailbox.
 */
export function buildMailto(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export type LinkedInPostLink = {
  url: string
  title: string
}

/**
 * Fallback links for posts that already have an https URL.
 * Placeholders and empty lists contribute nothing. Nothing is embedded.
 */
export function resolveLinkedInPosts(posts: readonly LinkedInPost[], locale: string): LinkedInPostLink[] {
  const links: LinkedInPostLink[] = []

  for (const post of posts) {
    const url = resolveHttpsUrl(post.url)

    if (!url) {
      continue
    }

    links.push({
      url,
      title: locale === 'en' ? post.title.en : post.title.fr
    })
  }

  return links
}
