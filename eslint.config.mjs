// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultAttributes } from 'eslint-plugin-better-tailwindcss/api/defaults'

export default withNuxt(
  betterTailwindcss.configs['correctness-error'],
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
        attributes: [
          ...getDefaultAttributes(),
          ['^v-bind:ui$', [{ match: 'objectValues' }]]
        ]
      }
    },
    rules: {
      // Classes defined in app/assets/css, loaded from nuxt.config.ts.
      'better-tailwindcss/no-unknown-classes': ['error', {
        ignore: [
          '^site-(shell|main|menu-tools|footer)$',
          '^page-title$',
          '^header-tools$',
          '^theme-toggle$',
          '^locale-switch$',
          '^footer-links$',
          '^skip-link$'
        ]
      }]
    }
  }
)
