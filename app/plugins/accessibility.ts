import { a11yBootScript } from '~/utils/accessibility'

/**
 * Puts the saved reading choice on the document before the page paints.
 */
export default defineNuxtPlugin({
  name: 'accessibility',
  enforce: 'pre',
  setup() {
    useHead({
      script: [
        {
          key: 'portfolio-a11y',
          innerHTML: a11yBootScript(),
          tagPriority: 'critical'
        }
      ]
    })
  }
})
