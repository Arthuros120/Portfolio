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
