<script setup lang="ts">
/**
 * The whole portfolio is one page. Header links scroll to these sections.
 * The document title lives in useSiteSeo.
 */
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
