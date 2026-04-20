import opentype from 'opentype.js'

const cache = new Map()

export function loadOpentypeFont(ttfPath) {
  let font = cache.get(ttfPath)
  if (!font) {
    font = opentype.loadSync(ttfPath)
    cache.set(ttfPath, font)
  }
  return font
}
