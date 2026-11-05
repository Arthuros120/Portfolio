<script setup lang="ts">
/**
 * Temporary control that proves a shared link can open a dialog.
 * The project and timeline slices replace it. It is not a project.
 */
const { t } = useI18n()
const project = useModalLayer('project')
const image = useModalLayer('image')
</script>

<template>
  <div class="modal-placeholder">
    <p class="modal-placeholder-flag">
      {{ t('modal.placeholderFlag') }}
    </p>
    <UButton
      id="modal-placeholder-open"
      :aria-controls="project.isOpen ? 'site-modal-project' : undefined"
      :aria-expanded="project.isOpen"
      aria-haspopup="dialog"
      color="neutral"
      :label="t('modal.placeholderOpen')"
      variant="outline"
      @click="project.open('placeholder')"
    />
    <ClientOnly>
      <SiteModal
        :description="t('modal.placeholderBody')"
        layer="project"
        :title="t('modal.placeholderTitle')"
      >
        <template #default="{ id }">
          <p
            v-if="id"
            class="modal-placeholder-id"
          >
            {{ t('modal.placeholderId', { id }) }}
          </p>
          <UButton
            id="modal-placeholder-image"
            color="neutral"
            :label="t('modal.placeholderImageOpen')"
            variant="outline"
            @click="image.open('placeholder')"
          />
        </template>
      </SiteModal>
      <SiteModal
        :description="t('modal.placeholderImageBody')"
        layer="image"
        :title="t('modal.placeholderImageTitle')"
      >
        <template #default="{ id }">
          <p
            v-if="id"
            class="modal-placeholder-id"
          >
            {{ t('modal.placeholderId', { id }) }}
          </p>
        </template>
      </SiteModal>
    </ClientOnly>
  </div>
</template>
