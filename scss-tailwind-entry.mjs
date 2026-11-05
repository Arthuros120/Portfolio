import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute } from 'node:path'

/**
 * Load `main.scss` through a `.css` module id.
 * Tailwind's Vite plugin only compiles CSS ids, and Sass cannot parse
 * `@import "tailwindcss"`. The stylesheet on disk stays SCSS; this is not a second file.
 */
export default function scssTailwindEntry() {
  const suffix = '/assets/scss/main.scss'

  return {
    name: 'scss-tailwind-entry',
    enforce: 'pre',
    async resolveId(id, importer) {
      const clean = id.split('?')[0]?.replaceAll('\\', '/') ?? ''

      if (!clean.endsWith(suffix)) {
        return
      }

      const absolute = isAbsolute(clean) && existsSync(clean)
        ? clean
        : await this.resolve(id, importer, { skipSelf: true }).then((resolved) => {
            if (!resolved) {
              return null
            }

            const resolvedId = typeof resolved === 'string' ? resolved : resolved.id
            return resolvedId.split('?')[0]?.replaceAll('\\', '/') ?? null
          })

      if (!absolute) {
        return
      }

      return `${absolute}.css`
    },
    load(id) {
      const file = id.split('?')[0]?.replaceAll('\\', '/') ?? ''

      if (!file.endsWith(`${suffix}.css`)) {
        return
      }

      const source = file.slice(0, -'.css'.length)
      this.addWatchFile(source)
      return readFileSync(source, 'utf8')
    }
  }
}
