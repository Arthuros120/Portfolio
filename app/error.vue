<script setup lang="ts">
import type { NuxtError } from '#app'
import { en as uiEn, fr as uiFr } from '@nuxt/ui/locale'
import { isEnglishPath } from '~/utils/error-locale'

/**
 * Branded error page in the language of the requested path.
 * Messages are loaded before the first paint so the static 404 is not stuck in French.
 */
const props = defineProps<{
  error: NuxtError
}>()

const status = computed(() => props.error.statusCode || 500)
const notFound = computed(() => status.value === 404)
const heading = ref<HTMLElement | null>(null)
const path = import.meta.server ? useRequestURL().pathname : window.location.pathname
const lang = isEnglishPath(path) ? 'en' as const : 'fr' as const
const { t, loadLocaleMessages } = useI18n()

await loadLocaleMessages(lang)

const uiLocale = computed(() => lang === 'en' ? uiEn : uiFr)
const title = computed(() => t(notFound.value ? 'error.title404' : 'error.title', {}, { locale: lang }))
const body = computed(() => t(notFound.value ? 'error.body404' : 'error.body', {}, { locale: lang }))
const home = lang === 'en' ? '/en' : '/'

useHead(() => ({
  title: `${title.value} — ${t('brand.name', {}, { locale: lang })}`,
  htmlAttrs: {
    lang: lang === 'en' ? 'en-US' : 'fr-FR'
  },
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
}))

onMounted(() => {
  heading.value?.focus({ preventScroll: true })
})

function onHome(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return
  }

  event.preventDefault()
  clearError({ redirect: home })
}
</script>

<template>
  <UApp :locale="uiLocale">
    <main
      id="main-content"
      class="error-page"
    >
      <a
        class="error-mark"
        :href="home"
        :lang="lang"
        @click="onHome"
      >
        {{ t('brand.name', {}, { locale: lang }) }}
      </a>
      <p class="error-code">
        {{ status }}
      </p>
      <h1
        ref="heading"
        class="error-title"
        tabindex="-1"
      >
        {{ title }}
      </h1>
      <p class="error-body">
        {{ body }}
      </p>
      <div
        class="error-horizon"
        aria-hidden="true"
      />
      <UButton
        class="error-home"
        color="primary"
        :label="t('error.home', {}, { locale: lang })"
        :to="home"
        @click="onHome"
      />
    </main>
  </UApp>
</template>
