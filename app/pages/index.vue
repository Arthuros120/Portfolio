<script setup lang="ts">
/**
 * The whole portfolio is one page. Header links scroll to these sections.
 */
const { t } = useI18n()

useHead(() => ({
  title: `${t('brand.name')} — ${t('hero.role')}`
}))

bindActiveSection()
</script>

<template>
  <div>
    <HomeHero />
    <HomeProjects />
    <HomeCareer />
    <HomeSkills />
    <HomeAbout />
    <HomeContact />
    <HomeLinkedIn />
  </div>
</template>
