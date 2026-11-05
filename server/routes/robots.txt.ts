import type { PortfolioContent } from '~/types/portfolio'
import { robotsDocument } from '~/utils/site-files'
import { publicOrigin } from '~/utils/site-origin'

/**
 * robots.txt generated with the static build.
 */
export default defineEventHandler((event) => {
  const portfolio = useRuntimeConfig().public.portfolio as PortfolioContent

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return robotsDocument(publicOrigin(portfolio.profile.siteUrl))
})
