<script setup lang="ts">
import { githubUrl, linkedinUrl } from '~/utils/public-links'

/**
 * Footer with the public GitHub profile and the LinkedIn placeholder.
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
        <UButton
          color="neutral"
          :icon="'i-lucide-github'"
          :label="t('footer.github')"
          target="_blank"
          :to="githubUrl"
          variant="ghost"
        />
        <UButton
          color="neutral"
          external
          :icon="'i-lucide-linkedin'"
          :label="t('footer.linkedin')"
          :to="linkedinUrl"
          variant="ghost"
        />
      </nav>
    </div>
  </UFooter>
</template>
