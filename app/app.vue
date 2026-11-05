<script setup lang="ts">
import { en, fr } from '@nuxt/ui/locale'
import { assertLocaleParity } from '~/utils/locale-parity'

assertLocaleParity()
useModalScrollLock()

const { locale, locales } = useI18n()
const uiLocale = computed(() => locale.value === 'en' ? en : fr)

useHead(() => {
  const current = locales.value.find(entry => entry.code === locale.value)
  const language = current && 'language' in current ? current.language : locale.value

  return {
    htmlAttrs: {
      lang: language,
      dir: 'ltr'
    }
  }
})
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
