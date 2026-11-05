<script setup lang="ts">
import { navSectionIds } from '~/utils/sections'

/**
 * In-page navigation shared by the header bar and the mobile menu.
 * Links scroll to sections on the home page. They do not change route.
 */
defineProps<{
  orientation: 'horizontal' | 'vertical'
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const active = useActiveSection()

const labels = {
  projects: 'nav.projects',
  career: 'nav.career',
  skills: 'nav.skills',
  about: 'nav.about',
  contact: 'nav.contact'
} as const

const items = computed(() => navSectionIds.map(id => ({
  label: t(labels[id]),
  to: `${localePath('/')}#${id}`,
  active: active.value === id
})))
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
