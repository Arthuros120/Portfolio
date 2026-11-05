/**
 * The static 404 is one file. The language follows the requested path.
 */
export function isEnglishPath(path: string): boolean {
  const clean = path.split(/[?#]/)[0] || '/'

  return clean === '/en' || clean.startsWith('/en/')
}
