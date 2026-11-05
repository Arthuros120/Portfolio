import { seedModalHistory } from '~/utils/modal-query'

/**
 * Runs before the router plugin so a shared modal link already has
 * a same-page history entry under it.
 */
export default defineNuxtPlugin({
  name: 'modal-history',
  enforce: 'pre',
  order: -25,
  setup() {
    seedModalHistory()
  }
})
