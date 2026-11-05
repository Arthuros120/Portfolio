import { buildMailto, resolvePublicEmail } from '~/utils/public-links'

/**
 * Mailto target for the contact actions.
 * Null while the public address is missing or still a placeholder.
 */
export function useContactMail() {
  const { t } = useI18n()
  const { profile } = usePortfolioContent()

  const mailto = computed(() => {
    const email = resolvePublicEmail(profile.email)

    if (!email) {
      return null
    }

    return buildMailto(email, t('contact.mailSubject'), t('contact.mailBody'))
  })

  return { mailto }
}
