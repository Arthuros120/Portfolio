import type { LocationQuery, RouteLocationRaw } from 'vue-router'
import type { ModalQueryKey } from '~/utils/modal-query'
import {
  isModalHistoryParent,
  isModalId,
  modalQueryKeys,
  omitModalKeys,
  readModalStack,
  withoutInvalidModalKeys
} from '~/utils/modal-query'

let closeLocked = false
let closeTicket = 0

/**
 * Open, close, and read the modal stack. The query string is the source of truth.
 */
export function useModalStack() {
  const route = useRoute()
  const router = useRouter()

  const stack = computed(() => readModalStack(route.query))

  function location(query: LocationQuery): RouteLocationRaw {
    return {
      path: route.path,
      query,
      hash: route.hash
    }
  }

  /**
   * Push one layer. The section hash is left as it is.
   * Layers above the opened key are dropped so the stack stays ordered.
   */
  function open(key: ModalQueryKey, id: string) {
    if (!isModalId(id)) {
      return
    }

    const current = readModalStack(route.query)
    const top = current[current.length - 1]

    if (top?.key === key && top.id === id) {
      return
    }

    const index = modalQueryKeys.indexOf(key)
    const query: LocationQuery = {
      ...omitModalKeys(route.query, modalQueryKeys.slice(index + 1)),
      [key]: id
    }

    void router.push(location(query))
  }

  /**
   * Close the top layer through history when this page pushed it,
   * so Forward opens that same layer again.
   */
  function closeTop() {
    if (closeLocked) {
      return
    }

    const current = readModalStack(route.query)
    const top = current[current.length - 1]

    if (!top) {
      return
    }

    closeLocked = true
    const ticket = closeTicket + 1
    closeTicket = ticket

    const release = () => {
      if (closeTicket !== ticket) {
        return
      }

      closeLocked = false
    }

    const stop = router.afterEach(() => {
      stop()
      release()
    })

    if (import.meta.client) {
      window.setTimeout(release, 400)
    }

    const back = import.meta.client ? window.history.state?.back : null

    if (isModalHistoryParent(back, route.path, route.query)) {
      router.back()
      return
    }

    void router.replace(location(omitModalKeys(route.query, [top.key])))
  }

  /**
   * Close one layer. The top layer uses Back. A deeper layer drops itself
   * and everything above it in a single history entry.
   */
  function close(key?: ModalQueryKey) {
    const current = readModalStack(route.query)
    const top = current[current.length - 1]

    if (!top) {
      return
    }

    if (!key || key === top.key) {
      closeTop()
      return
    }

    if (!current.some(layer => layer.key === key)) {
      return
    }

    const index = modalQueryKeys.indexOf(key)

    void router.push(location(omitModalKeys(route.query, modalQueryKeys.slice(index))))
  }

  return {
    stack,
    open,
    close,
    closeTop
  }
}

/**
 * One layer, for a section that opens its own dialog.
 */
export function useModalLayer(key: ModalQueryKey) {
  const { stack, open, close } = useModalStack()
  const id = computed(() => stack.value.find(layer => layer.key === key)?.id ?? null)
  const isOpen = computed(() => id.value !== null)

  return {
    id,
    isOpen,
    open: (value: string) => open(key, value),
    close: () => close(key)
  }
}

/**
 * Keep the page behind the dialog from scrolling, and ignore unsafe query values.
 */
export function useModalScrollLock() {
  const route = useRoute()
  const router = useRouter()
  const depth = computed(() => readModalStack(route.query).length)

  onMounted(() => {
    const stop = watch(depth, (value) => {
      document.documentElement.classList.toggle('has-site-modal', value > 0)
    }, { immediate: true })

    onUnmounted(() => {
      stop()
      document.documentElement.classList.remove('has-site-modal')
    })

    const cleaned = withoutInvalidModalKeys(route.query)

    if (!cleaned) {
      return
    }

    void router.replace({
      path: route.path,
      query: cleaned,
      hash: route.hash
    })
  })
}
