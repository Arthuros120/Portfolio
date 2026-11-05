<script setup lang="ts">
import { resolveHttpsUrl, resolveInstagramUrl } from '~/utils/public-links'

/**
 * Footer with the public profiles. Placeholder slots stay text, not links.
 */
const { t } = useI18n()
const { profile } = usePortfolioContent()
const year = new Date().getFullYear()

const github = computed(() => resolveHttpsUrl(profile.githubUrl))
const linkedin = computed(() => resolveHttpsUrl(profile.linkedinUrl))
const instagram = computed(() => resolveInstagramUrl(profile.instagramHandle))
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
          v-if="github"
          color="neutral"
          :icon="'i-lucide-github'"
          :label="t('footer.github')"
          target="_blank"
          :to="github"
          variant="ghost"
        />
        <p
          v-else
          class="footer-slot"
        >
          {{ t('footer.github') }} — {{ profile.githubUrl }}
        </p>
        <UButton
          v-if="linkedin"
          color="neutral"
          external
          :icon="'i-lucide-linkedin'"
          :label="t('footer.linkedin')"
          :to="linkedin"
          variant="ghost"
        />
        <p
          v-else
          class="footer-slot"
        >
          {{ t('footer.linkedin') }} — {{ profile.linkedinUrl }}
        </p>
        <UButton
          v-if="instagram"
          color="neutral"
          external
          :icon="'i-lucide-instagram'"
          :label="t('footer.instagram')"
          :to="instagram"
          variant="ghost"
        />
        <p
          v-else
          class="footer-slot"
        >
          {{ t('footer.instagram') }} — {{ profile.instagramHandle }}
        </p>
      </nav>
    </div>
  </UFooter>
</template>
