/**
 * Visual reference: primary sky, neutral slate, pill buttons.
 * Light, dark, and system themes stay on Nuxt color mode.
 */
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'slate'
    },
    button: {
      slots: {
        base: 'rounded-full'
      }
    }
  }
})
