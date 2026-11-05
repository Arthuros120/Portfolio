import type { RouterConfig } from '@nuxt/schema'

function normalizePath(path: string) {
  return path.replace(/\/$/, '') || '/'
}

function hashTop(hash: string) {
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  const element = document.getElementById(id)

  if (!element) {
    return 0
  }

  const elementStyles = getComputedStyle(element)
  const rootStyles = getComputedStyle(document.documentElement)

  return (Number.parseFloat(elementStyles.scrollMarginTop) || 0)
    + (Number.parseFloat(rootStyles.scrollPaddingTop) || 0)
}

/**
 * Section links keep scrolling to their anchor.
 * Opening or closing a modal only changes the query, so the page stays put.
 */
export default {
  scrollBehavior(to, from, savedPosition) {
    const samePage = normalizePath(to.path) === normalizePath(from.path)

    if (samePage && to.hash === from.hash) {
      return false
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: import.meta.client ? hashTop(to.hash) : 0,
        behavior: 'auto'
      }
    }

    return savedPosition ?? { left: 0, top: 0 }
  }
} satisfies RouterConfig
