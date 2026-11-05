import { publicOgImage, publicOrigin } from '~/utils/site-origin'

/**
 * Document title, description, language, hreflang, and Open Graph.
 * The image tag stays off while profile.ogImage is [TO PROVIDE].
 * Links stay root-relative until profile.siteUrl is an https origin.
 */
export function useSiteSeo() {
  const { t, locale } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const { profile } = usePortfolioContent()
  const origin = publicOrigin(profile.siteUrl)
  const imagePath = publicOgImage(profile.ogImage)
  const image = origin && imagePath ? new URL(imagePath, `${origin}/`).toString() : undefined

  function absolute(path: string): string {
    if (!origin) {
      return path
    }

    return path === '/' ? `${origin}/` : `${origin}${path}`
  }

  useHead(() => {
    const fr = absolute(switchLocalePath('fr') || '/')
    const en = absolute(switchLocalePath('en') || '/en')
    const current = locale.value === 'en' ? en : fr
    const language = locale.value === 'en' ? 'en-US' : 'fr-FR'

    return {
      title: t('seo.title'),
      htmlAttrs: {
        lang: language,
        dir: 'ltr'
      },
      link: [
        { rel: 'alternate', hreflang: 'x-default', href: fr },
        { rel: 'alternate', hreflang: 'fr-FR', href: fr },
        { rel: 'alternate', hreflang: 'en-US', href: en },
        { rel: 'canonical', href: current }
      ],
      meta: [
        { property: 'og:url', content: current },
        { property: 'og:locale', content: language.replace('-', '_') },
        { property: 'og:locale:alternate', content: locale.value === 'en' ? 'fr_FR' : 'en_US' },
        ...(image
          ? [
              { property: 'og:image', content: image },
              { property: 'og:image:alt', content: t('seo.ogImageAlt') }
            ]
          : [])
      ]
    }
  })

  useSeoMeta({
    description: () => t('seo.description'),
    ogDescription: () => t('seo.description'),
    ogSiteName: () => t('brand.name'),
    ogTitle: () => t('seo.title'),
    ogType: 'website'
  })
}
