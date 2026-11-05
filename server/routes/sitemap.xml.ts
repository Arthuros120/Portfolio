import type { PortfolioContent } from '~/types/portfolio'
import { sitemapDocument } from '~/utils/site-files'
import { publicOrigin } from '~/utils/site-origin'

/**
 * Sitemap generated with the static build. Two landing URLs, French and English.
 */
export default defineEventHandler((event) => {
  const portfolio = useRuntimeConfig().public.portfolio as PortfolioContent

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return sitemapDocument(publicOrigin(portfolio.profile.siteUrl))
})
