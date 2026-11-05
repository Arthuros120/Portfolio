/**
 * Saved reading preferences. The boot script applies them before paint
 * so a stored choice does not flash the default font or size.
 */
export const A11Y_STORAGE_KEY = 'portfolio-a11y'

export const a11yFonts = ['default', 'dyslexia'] as const
export const a11yTextSizes = ['md', 'lg', 'xl'] as const
export const a11yContrasts = ['default', 'strong'] as const

export type A11yFont = typeof a11yFonts[number]
export type A11yTextSize = typeof a11yTextSizes[number]
export type A11yContrast = typeof a11yContrasts[number]

export interface A11yPreferences {
  font: A11yFont
  textSize: A11yTextSize
  contrast: A11yContrast
}

export const defaultA11yPreferences: A11yPreferences = {
  font: 'default',
  textSize: 'md',
  contrast: 'default'
}

function isFont(value: unknown): value is A11yFont {
  return value === 'default' || value === 'dyslexia'
}

function isTextSize(value: unknown): value is A11yTextSize {
  return value === 'md' || value === 'lg' || value === 'xl'
}

function isContrast(value: unknown): value is A11yContrast {
  return value === 'default' || value === 'strong'
}

/**
 * Reads a stored preference. Unknown or broken values fall back to the defaults.
 */
export function readA11yPreferences(raw: string | null): A11yPreferences {
  if (!raw) {
    return { ...defaultA11yPreferences }
  }

  try {
    const data: unknown = JSON.parse(raw)

    if (typeof data !== 'object' || data === null) {
      return { ...defaultA11yPreferences }
    }

    const record = data as { font?: unknown, textSize?: unknown, contrast?: unknown }

    return {
      font: isFont(record.font) ? record.font : 'default',
      textSize: isTextSize(record.textSize) ? record.textSize : 'md',
      contrast: isContrast(record.contrast) ? record.contrast : 'default'
    }
  } catch {
    return { ...defaultA11yPreferences }
  }
}

/**
 * Inline script for the document head. It only reads localStorage.
 */
export function a11yBootScript(): string {
  const key = JSON.stringify(A11Y_STORAGE_KEY)

  return `(function(){try{var raw=localStorage.getItem(${key});if(!raw)return;var data=JSON.parse(raw);var root=document.documentElement;if(data.font==="dyslexia")root.setAttribute("data-a11y-font","dyslexia");if(data.textSize==="lg"||data.textSize==="xl")root.setAttribute("data-a11y-text",data.textSize);if(data.contrast==="strong")root.setAttribute("data-a11y-contrast","strong");}catch(e){}})();`
}
