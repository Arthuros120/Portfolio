<script setup lang="ts">
import type { ModalQueryKey } from '~/utils/modal-query'

/**
 * Glass dialog for one query layer.
 * Sections pass a title and a body; they open it with `useModalLayer`.
 */
const props = defineProps<{
  layer: ModalQueryKey
  title: string
  description?: string
  /**
   * Fill the viewport. The image layer uses this for the lightbox.
   */
  fullscreen?: boolean
}>()

const { t } = useI18n()
const { isOpen, id, close } = useModalLayer(props.layer)
const { stack } = useModalStack()

const sheetQuery = '(max-width: 47.99rem)'
const reducedQuery = '(prefers-reduced-motion: reduce)'
const isSheet = ref(false)
const reducedMotion = ref(false)

if (import.meta.client) {
  isSheet.value = window.matchMedia(sheetQuery).matches
  reducedMotion.value = window.matchMedia(reducedQuery).matches
}

onMounted(() => {
  const sheet = window.matchMedia(sheetQuery)
  const reduced = window.matchMedia(reducedQuery)

  const sync = () => {
    isSheet.value = sheet.matches
    reducedMotion.value = reduced.matches
  }

  sync()
  sheet.addEventListener('change', sync)
  reduced.addEventListener('change', sync)

  onUnmounted(() => {
    sheet.removeEventListener('change', sync)
    reduced.removeEventListener('change', sync)
  })
})

const dialogId = computed(() => `site-modal-${props.layer}`)
const fillScreen = computed(() => props.fullscreen === true || isSheet.value)
const isTop = computed(() => stack.value[stack.value.length - 1]?.key === props.layer)

const ui = computed(() => ({
  overlay: `site-modal-overlay site-modal-layer-${props.layer}`,
  content: [
    'site-modal-panel',
    `site-modal-layer-${props.layer}`,
    fillScreen.value ? 'site-modal-sheet' : '',
    props.fullscreen ? 'site-modal-lightbox' : ''
  ].filter(Boolean).join(' '),
  body: 'site-modal-body'
}))

function labelDialog(node?: EventTarget | null) {
  const panel = node instanceof HTMLElement
    ? node
    : document.querySelector<HTMLElement>(`.site-modal-panel.site-modal-layer-${props.layer}`)

  if (!panel) {
    return
  }

  panel.id = dialogId.value
  panel.setAttribute('aria-modal', 'true')
  panel.tabIndex = -1
}

function onAfterEnter() {
  labelDialog()
  revealTop()
}

function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  labelDialog(event.target)
  revealTop()

  if (!isTop.value || !(event.target instanceof HTMLElement)) {
    return
  }

  event.target.focus()
}

const dialogContent = computed(() => ({
  onOpenAutoFocus
}))

/**
 * Two dialogs that open together can each mark the other `aria-hidden`.
 * The top layer must stay available to assistive technology.
 */
function revealTop() {
  if (!import.meta.client || !isOpen.value || !isTop.value) {
    return
  }

  const panel = document.getElementById(dialogId.value)

  panel?.removeAttribute('aria-hidden')
}

watch([isOpen, isTop], ([open]) => {
  if (!open || !import.meta.client) {
    return
  }

  nextTick(() => {
    labelDialog()
    revealTop()
    requestAnimationFrame(revealTop)
    window.setTimeout(revealTop, 0)
  })
}, { immediate: true })

/**
 * Ignore a close that belongs to a dialog underneath the top layer.
 * Escape and the backdrop then leave the upper dialog in place.
 */
function onUpdateOpen(next: boolean) {
  if (next || !isOpen.value) {
    return
  }

  const top = stack.value[stack.value.length - 1]

  if (top && top.key !== props.layer) {
    return
  }

  close()
}

function onAfterLeave() {
  if (!import.meta.client) {
    return
  }

  const active = document.activeElement

  if (active instanceof HTMLElement && active !== document.body && active !== document.documentElement) {
    return
  }

  const dialog = document.querySelector<HTMLElement>('[role="dialog"]')

  if (dialog) {
    dialog.focus()
    return
  }

  document.getElementById('main-content')?.focus()
}
</script>

<template>
  <UModal
    :content="dialogContent"
    :description="description"
    :dismissible="isTop"
    :fullscreen="fillScreen"
    :open="isOpen"
    :title="title"
    :transition="!reducedMotion"
    :ui="ui"
    @after:enter="onAfterEnter"
    @after:leave="onAfterLeave"
    @update:open="onUpdateOpen"
  >
    <template #close>
      <UButton
        :aria-label="t('modal.close')"
        class="site-modal-close"
        color="neutral"
        icon="i-lucide-x"
        variant="ghost"
      />
    </template>
    <template #body>
      <slot
        :id="id"
        :close="close"
      />
    </template>
  </UModal>
</template>
