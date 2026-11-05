/**
 * Public profile URLs shown in the site footer.
 * LinkedIn and the contact email stay literal placeholders until Arthur provides them.
 */
export const githubUrl = 'https://github.com/Arthuros120'

export const linkedinUrl = '[TO PROVIDE]'

/**
 * Public mailbox for the contact mailto.
 * Stays the literal placeholder until Arthur provides an address.
 */
export const contactEmail = '[TO PROVIDE]'

const placeholderPrefix = /^\s*\[(?:TO PROVIDE|PLACEHOLDER)\b/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
