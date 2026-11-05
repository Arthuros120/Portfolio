<script setup lang="ts">
/**
 * Footer with the public profiles. Placeholder slots stay text, not links.
 */
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <UFooter>
    <div class="site-footer">
      <div>
        <p class="footer-copyright">
          {{ t('footer.copyright', { year, name: t('brand.name') }) }}
        </p>
        <p class="footer-tagline">
          {{ t('footer.tagline') }}
        </p>
      </div>
      <nav
        class="footer-links"
        :aria-label="t('footer.label')"
      >
        <SocialLinks />
      </nav>
    </div>
  </UFooter>
</template>
