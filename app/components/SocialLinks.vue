<script setup lang="ts">
import { resolveHttpsUrl, resolveInstagramUrl } from '~/utils/public-links'

/**
 * GitHub, LinkedIn, and the DJ Instagram account.
 * A missing URL stays icon and text. It is not a link.
 */
const { t } = useI18n()
const { social } = usePortfolioContent()

const items = computed(() => [
  {
    id: 'github',
    icon: 'i-lucide-github',
    label: t('footer.github'),
    href: resolveHttpsUrl(social.githubUrl),
    pending: social.githubUrl
  },
  {
    id: 'linkedin',
    icon: 'i-lucide-linkedin',
    label: t('footer.linkedin'),
    href: resolveHttpsUrl(social.linkedinUrl),
    pending: social.linkedinUrl
  },
  {
    id: 'instagram',
    icon: 'i-lucide-instagram',
    label: t('footer.instagram'),
    href: resolveInstagramUrl(social.instagramHandle),
    pending: social.instagramHandle
  }
])
</script>

<template>
  <ul class="social-links">
    <li
      v-for="item in items"
      :key="item.id"
    >
      <UButton
        v-if="item.href"
        color="neutral"
        external
        :aria-label="t('footer.external', { name: item.label })"
        :icon="item.icon"
        :label="item.label"
        target="_blank"
        :to="item.href"
        variant="ghost"
      />
      <p
        v-else
        class="social-pending"
      >
        <UIcon
          :name="item.icon"
          class="social-pending-icon"
          aria-hidden="true"
        />
        <span>{{ item.label }} — {{ item.pending }}</span>
      </p>
    </li>
  </ul>
</template>
