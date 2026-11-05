import type { PortfolioContent } from '~/types/portfolio'

/**
 * Portfolio YAML validated when Nuxt loads its config.
 */
export function usePortfolioContent(): PortfolioContent {
  return useRuntimeConfig().public.portfolio as PortfolioContent
}
