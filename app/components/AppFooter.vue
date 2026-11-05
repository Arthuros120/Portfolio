<script setup lang="ts">
import { githubUrl, linkedinUrl } from '~/utils/public-links'

/**
 * Footer with the public GitHub profile and the LinkedIn placeholder.
 */
const { t } = useI18n()
</script>

<template>
  <UFooter>
    <div class="site-footer">
      <p>{{ t('brand.name') }}</p>
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
