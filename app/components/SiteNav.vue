<script setup lang="ts">
/**
 * Primary navigation shared by the header bar and the mobile menu.
 */
defineProps<{
  orientation: 'horizontal' | 'vertical'
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const items = computed(() => [
  { label: t('nav.home'), to: localePath('/'), exact: true },
  { label: t('nav.projects'), to: localePath('/projects'), exact: true },
  { label: t('nav.about'), to: localePath('/about'), exact: true },
  { label: t('nav.contact'), to: localePath('/contact'), exact: true }
])
</script>

<template>
  <UNavigationMenu
    :aria-label="t('nav.label')"
    color="primary"
    :highlight="false"
    :items="items"
    :orientation="orientation"
    variant="pill"
  />
</template>
