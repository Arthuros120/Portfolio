<script setup lang="ts">
import { en, fr } from '@nuxt/ui/locale'
import { assertLocaleParity } from '~/utils/locale-parity'

assertLocaleParity()
useModalScrollLock()

const { locale } = useI18n()
const uiLocale = computed(() => locale.value === 'en' ? en : fr)

useSiteSeo()
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
