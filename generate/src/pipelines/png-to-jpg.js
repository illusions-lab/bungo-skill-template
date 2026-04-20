import sharp from 'sharp'

export async function pngToJpg(pngPath, jpgPath, { quality = 90 } = {}) {
  await sharp(pngPath)
    // PNG の透明部分は黒で埋める（SNS UI と整合）
    .flatten({ background: '#000000' })
    .jpeg({ quality, mozjpeg: true })
    .toFile(jpgPath)
}
