<script setup lang="ts">
import type { ProjectImageView } from '~/utils/projects'

/**
 * Mixed-size visuals for one project.
 * Each real or pending image is a button. An empty list is one placeholder tile.
 */
defineProps<{
  images: ProjectImageView[]
  emptyLabel: string
  label: string
  openId: string | null
}>()

const emit = defineEmits<{
  open: [id: string]
}>()
</script>

<template>
  <ul
    class="project-bento"
    :aria-label="label"
  >
    <li
      v-if="images.length === 0"
      class="project-bento-item project-span-wide"
    >
      <ProjectMediaTile
        :alt="emptyLabel"
        :src="null"
      />
    </li>
    <li
      v-for="image in images"
      :key="image.id"
      class="project-bento-item"
      :class="{
        'project-span-wide': image.span === 'wide',
        'project-span-tall': image.span === 'tall'
      }"
    >
      <button
        :id="`project-image-${image.id}`"
        type="button"
        class="project-bento-button"
        :class="{ 'project-zoomable': image.src !== null }"
        :aria-controls="openId === image.id ? 'site-modal-image' : undefined"
        :aria-expanded="openId === image.id"
        aria-haspopup="dialog"
        @click="emit('open', image.id)"
      >
        <ProjectMediaTile
          :alt="image.alt"
          :src="image.src"
        />
      </button>
    </li>
  </ul>
</template>
