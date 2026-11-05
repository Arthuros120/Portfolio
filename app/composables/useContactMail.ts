import { resolvePublicEmail } from '~/utils/public-links'

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

    const subject = encodeURIComponent(t('hero.mailSubject'))
    const body = encodeURIComponent(t('hero.mailBody'))

    return `mailto:${email}?subject=${subject}&body=${body}`
  })

  return { mailto }
}
