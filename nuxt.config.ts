import { loadPortfolioContent } from './content/load.mjs'
import scssTailwindEntry from './scss-tailwind-entry.mjs'

const portfolio = loadPortfolioContent()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: [
    '~/assets/scss/main.scss',
    '~/assets/scss/layout.scss',
    '~/assets/scss/focus.scss',
    '~/assets/scss/hero.scss',
    '~/assets/scss/sections.scss'
  ],

  // Apply the saved or system theme before paint. An empty suffix matches Nuxt UI.
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode',
    disableTransition: true
  },

  runtimeConfig: {
    public: {
      portfolio
    }
  },

  routeRules: {
    '/**': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  vite: {
    plugins: [scssTailwindEntry()]
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    langDir: 'locales',
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ]
  },

  // Icons ship in the build. Nothing is fetched from a remote icon service.
  icon: {
    provider: 'none',
    serverBundle: 'local',
    fallbackToApi: false,
    clientBundle: {
      scan: true,
      icons: [
        'lucide:github',
        'lucide:linkedin',
        'lucide:sun',
        'lucide:moon',
        'lucide:monitor',
        'lucide:menu',
        'lucide:x',
        'lucide:sailboat',
        'lucide:swords',
        'lucide:mountain',
        'lucide:gamepad-2',
        'lucide:music',
        'lucide:instagram'
      ]
    }
  }
})
