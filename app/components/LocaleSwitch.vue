<script setup lang="ts">
/**
 * Switches between the two supported locales. The URL keeps the choice.
 */
const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const locales = [
  { code: 'fr', label: 'locale.fr' },
  { code: 'en', label: 'locale.en' }
] as const
</script>

<template>
  <nav
    class="locale-switch"
    :aria-label="t('locale.label')"
  >
    <UButton
      v-for="item in locales"
      :key="item.code"
      color="neutral"
      size="sm"
      :aria-current="locale === item.code ? 'true' : undefined"
      :to="switchLocalePath(item.code)"
      :variant="locale === item.code ? 'solid' : 'ghost'"
    >
      {{ t(item.label) }}
    </UButton>
  </nav>
</template>
