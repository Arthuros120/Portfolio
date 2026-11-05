import {
  A11Y_STORAGE_KEY,
  readA11yPreferences,
  type A11yContrast,
  type A11yFont,
  type A11yTextSize
} from '~/utils/accessibility'

/**
 * Reading preferences for the accessibility panel.
 * The choice is stored in localStorage and mirrored onto the document element.
 */
export function useAccessibility() {
  const font = useState<A11yFont>('a11y-font', () => 'default')
  const textSize = useState<A11yTextSize>('a11y-text', () => 'md')
  const contrast = useState<A11yContrast>('a11y-contrast', () => 'default')

  function apply() {
    if (!import.meta.client) {
      return
    }

    const root = document.documentElement

    if (font.value === 'dyslexia') {
      root.setAttribute('data-a11y-font', 'dyslexia')
    } else {
      root.removeAttribute('data-a11y-font')
    }

    if (textSize.value === 'md') {
      root.removeAttribute('data-a11y-text')
    } else {
      root.setAttribute('data-a11y-text', textSize.value)
    }

    if (contrast.value === 'strong') {
      root.setAttribute('data-a11y-contrast', 'strong')
    } else {
      root.removeAttribute('data-a11y-contrast')
    }
  }

  function persist() {
    if (!import.meta.client) {
      return
    }

    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify({
      font: font.value,
      textSize: textSize.value,
      contrast: contrast.value
    }))
    apply()
  }

  onMounted(() => {
    const saved = readA11yPreferences(localStorage.getItem(A11Y_STORAGE_KEY))
    font.value = saved.font
    textSize.value = saved.textSize
    contrast.value = saved.contrast
    apply()
  })

  function setFont(value: A11yFont) {
    font.value = value
    persist()
  }

  function setTextSize(value: A11yTextSize) {
    textSize.value = value
    persist()
  }

  function setContrast(value: A11yContrast) {
    contrast.value = value
    persist()
  }

  return {
    font,
    textSize,
    contrast,
    setFont,
    setTextSize,
    setContrast
  }
}
