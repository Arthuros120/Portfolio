<script setup lang="ts">
/**
 * Switches between French and English.
 * The other language opens on the section currently in view.
 */
const route = useRoute()
const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const active = useActiveSection()
const clientReady = ref(false)

const locales = [
  { code: 'fr', label: 'locale.fr' },
  { code: 'en', label: 'locale.en' }
] as const

onMounted(() => {
  clientReady.value = true
})

function localeTo(code: 'fr' | 'en') {
  const path = switchLocalePath(code).replace(/#.*$/, '')

  if (!clientReady.value) {
    return path
  }

  if (active.value !== 'top') {
    return `${path}#${active.value}`
  }

  return route.hash ? `${path}${route.hash}` : path
}
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
      :aria-current="locale === item.code ? 'true' : undefined"
      :locale="false"
      :to="localeTo(item.code)"
      :variant="locale === item.code ? 'solid' : 'ghost'"
    >
      {{ t(item.label) }}
    </UButton>
  </nav>
</template>
