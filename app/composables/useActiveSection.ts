import { sectionIds } from '~/utils/sections'

/**
 * Which home-page section is in view. The header reads it; the page binds it.
 */
export function useActiveSection() {
  return useState('active-section', () => 'top')
}

/**
 * Keep the header in step with scroll.
 * The last section is marked current at the bottom of the page, where it
 * cannot travel up to the marker line.
 */
export function bindActiveSection() {
  const active = useActiveSection()

  onMounted(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight

      if (max > 48 && window.scrollY >= max - 32) {
        active.value = 'contact'
        return
      }

      const header = document.querySelector('header')
      const line = window.scrollY + (header?.getBoundingClientRect().height ?? 0) + 24
      let current = 'top'

      for (const id of sectionIds) {
        const node = document.getElementById(id)

        if (!node) {
          continue
        }

        const top = node.getBoundingClientRect().top + window.scrollY

        if (top <= line) {
          current = id
        }
      }

      active.value = current
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    onUnmounted(() => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    })
  })
}
