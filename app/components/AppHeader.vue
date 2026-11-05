<script setup lang="ts">
/**
 * Site header: brand, primary navigation, locale switch, and theme control.
 */
const { t } = useI18n()
const localePath = useLocalePath()
const homeHash = computed(() => `${localePath('/')}#top`)
</script>

<template>
  <UHeader
    :title="t('brand.name')"
    :to="homeHash"
  >
    <SiteNav orientation="horizontal" />

    <template #right>
      <div class="header-tools">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </template>

    <template #body>
      <SiteNav orientation="vertical" />
      <div class="site-menu-tools">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </template>
  </UHeader>
</template>
