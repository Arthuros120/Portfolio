<script setup lang="ts">
/**
 * Site header: brand, primary navigation, locale switch, and theme control.
 */
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <UHeader
    :title="t('brand.name')"
    :to="localePath('/')"
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
