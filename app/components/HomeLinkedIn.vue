<script setup lang="ts">
import { resolveLinkedInPosts } from '~/utils/public-links'

/**
 * Selected LinkedIn posts as ordinary links.
 * An empty list stays a placeholder. Real URLs are not embedded.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { social } = usePortfolioContent()

const posts = computed(() => resolveLinkedInPosts(social.linkedinPosts, locale.value))
</script>

<template>
  <section
    id="linkedin"
    ref="root"
    class="section"
    aria-labelledby="linkedin-title"
  >
    <SectionHeading
      :kicker="t('sections.postsKicker')"
      :title="t('contact.postsTitle')"
      title-id="linkedin-title"
    />
    <ul
      v-if="posts.length"
      class="linkedin-posts"
    >
      <li
        v-for="post in posts"
        :key="post.url"
      >
        <a
          class="linkedin-fallback"
          :aria-label="t('footer.external', { name: post.title })"
          :href="post.url"
          rel="noopener noreferrer"
          target="_blank"
        >
          <UIcon
            name="i-lucide-linkedin"
            class="linkedin-fallback-icon"
            aria-hidden="true"
          />
          <span>{{ post.title }}</span>
        </a>
      </li>
    </ul>
    <p
      v-else
      class="section-lead"
    >
      {{ t('contact.postsPending') }}
    </p>
  </section>
</template>
