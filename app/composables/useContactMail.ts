import { contactEmail, resolvePublicEmail } from '~/utils/public-links'

/**
 * Mailto target for the contact actions.
 * Null while the public address is missing or still a placeholder.
 */
export function useContactMail() {
  const { t } = useI18n()

  const mailto = computed(() => {
    const email = resolvePublicEmail(contactEmail)

    if (!email) {
      return null
    }

    const subject = encodeURIComponent(t('hero.mailSubject'))
    const body = encodeURIComponent(t('hero.mailBody'))

    return `mailto:${email}?subject=${subject}&body=${body}`
  })

  return { mailto }
}
