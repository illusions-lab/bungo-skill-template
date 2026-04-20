// フォントは @font-face data URI ではなく JS API で渡す（resvg は CSS 内 @font-face を解釈しない）

import fs from 'node:fs'
import { Resvg } from '@resvg/resvg-js'
import { DEFAULT_DESIGN } from '../config.js'

/**
 * @param {string} svgString
 * @param {string} outputPath
 * @param {object} options
 * @param {Buffer[]} options.fontBuffers
 * @param {string} [options.defaultFontFamily]
 * @param {number} [options.fitToWidth]
 */
export function svgToPng(svgString, outputPath, options = {}) {
  const {
    fontBuffers = [],
    defaultFontFamily = DEFAULT_DESIGN.font_body,
    fitToWidth,
    resourcesDir,
  } = options

  const resvgOpts = {
    font: {
      fontBuffers,
      loadSystemFonts: false,
      defaultFontFamily,
    },
  }
  if (fitToWidth) {
    resvgOpts.fitTo = { mode: 'width', value: fitToWidth }
  }
  if (resourcesDir) {
    resvgOpts.resourcesDir = resourcesDir
  }

  const resvg = new Resvg(svgString, resvgOpts)
  const pngBuffer = resvg.render().asPng()
  fs.writeFileSync(outputPath, pngBuffer)
  return { width: resvg.width, height: resvg.height, bytes: pngBuffer.length }
}
