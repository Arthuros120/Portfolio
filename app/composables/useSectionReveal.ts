import type { Ref } from 'vue'

/**
 * Fade a section in when it enters the viewport.
 * Reduced motion and the first paint stay visible: nothing is hidden up front.
 */
export function useSectionReveal(root: Readonly<Ref<HTMLElement | null>>) {
  onMounted(() => {
    const node = root.value

    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const rect = node.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0

    if (inView) {
      return
    }

    node.classList.add('reveal-armed')

    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        node.classList.add('is-visible')
        observer.disconnect()
      }
    }, { threshold: 0.18 })

    observer.observe(node)

    onUnmounted(() => {
      observer.disconnect()
    })
  })
}
