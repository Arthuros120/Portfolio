<script setup lang="ts">
/**
 * One technology logo and its short usage note.
 * Hover and keyboard focus reveal the same note. A touch tap toggles it,
 * because a hover-only tooltip never opens from a finger.
 */
const props = defineProps<{
  skillId: string
  label: string
  icon: string
  blurb: string
}>()

const root = ref<HTMLElement | null>(null)
const hovered = ref(false)
const focused = ref(false)
const pinned = ref(false)
const pointerType = ref('')

const noteId = computed(() => `skill-note-${props.skillId}`)
const open = computed(() => hovered.value || focused.value || pinned.value)

/**
 * @param event Pointer that started the gesture. Touch is handled on click.
 */
function onPointerDown(event: PointerEvent) {
  pointerType.value = event.pointerType
}

/**
 * @param event Fine pointer entering the logo. Touch uses the tap toggle.
 */
function onPointerEnter(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    return
  }

  hovered.value = true
}

/**
 * @param event Fine pointer leaving the logo.
 */
function onPointerLeave(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    return
  }

  hovered.value = false
}

/**
 * Keyboard focus opens the note. A tap focuses too, but it is not :focus-visible.
 *
 * @param event Focus moving onto the logo button.
 */
function onFocus(event: FocusEvent) {
  const target = event.target

  if (target instanceof HTMLElement && target.matches(':focus-visible')) {
    focused.value = true
  }
}

function onBlur() {
  focused.value = false
}

/**
 * First tap reveals the note. The next tap hides it.
 * There is no skill link to follow.
 */
function onClick() {
  if (pointerType.value !== 'touch') {
    return
  }

  pinned.value = !pinned.value
}

/**
 * @param event Key pressed while the logo button is focused.
 */
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') {
    return
  }

  pinned.value = false
  hovered.value = false

  if (event.target instanceof HTMLElement) {
    event.target.blur()
  }
}

/**
 * @param event Pointer down anywhere. A tap outside closes a pinned note.
 */
function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target

  if (target instanceof Node && root.value?.contains(target)) {
    return
  }

  pinned.value = false
}

watch(pinned, (value) => {
  if (!import.meta.client) {
    return
  }

  if (value) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<template>
  <div
    ref="root"
    class="skill-logo"
    :class="{ 'skill-logo-open': open }"
  >
    <button
      type="button"
      class="skill-trigger"
      :aria-describedby="noteId"
      @pointerdown="onPointerDown"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
      @focus="onFocus"
      @blur="onBlur"
      @click="onClick"
      @keydown="onKeydown"
    >
      <UIcon
        :name="icon"
        class="skill-mark"
        aria-hidden="true"
      />
      <span class="skill-label">{{ label }}</span>
    </button>
    <p
      :id="noteId"
      class="skill-note"
      :class="{ 'skill-note-open': open }"
      role="tooltip"
    >
      {{ blurb }}
    </p>
  </div>
</template>
