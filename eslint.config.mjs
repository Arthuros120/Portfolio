// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultAttributes } from 'eslint-plugin-better-tailwindcss/api/defaults'

export default withNuxt(
  betterTailwindcss.configs['correctness-error'],
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/scss/main.scss',
        attributes: [
          ...getDefaultAttributes(),
          ['^v-bind:ui$', [{ match: 'objectValues' }]]
        ]
      }
    },
    rules: {
      // Classes defined in app/assets/scss, loaded from nuxt.config.ts.
      'better-tailwindcss/no-unknown-classes': ['error', {
        ignore: [
          '^site-(shell|main|menu-tools|footer|header|wordmark|nav)$',
          '^header-tools$',
          '^menu-toggle$',
          '^is-scrolled$',
          '^theme-toggle$',
          '^locale-switch$',
          '^footer-(links|tagline|copyright|slot)$',
          '^availability(?:-.+)?$',
          '^skip-link$',
          '^hero(?:-.+)?$',
          '^section(?:-.+)?$',
          '^project(?:-.+)?$',
          '^career(?:-.+)?$',
          '^skill(?:-.+)?$',
          '^about(?:-.+)?$',
          '^contact(?:-.+)?$',
          '^compass(?:-.+)?$',
          '^code-card(?:-.+)?$',
          '^reveal-armed$',
          '^is-visible$'
        ]
      }]
    }
  }
)
