const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

async function processLogo() {
  const inputPath = 'C:/Users/TAENTED/.gemini/antigravity/brain/6d2583c7-3829-4587-bb1c-90d80f196bc6/.user_uploaded/media_1791722200402_f8fd2ac9.png'
  const publicDir = path.join(__dirname, '..', 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  const outputPath = path.join(publicDir, 'logo.png')

  // Read raw pixels
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // Make near-white pixels transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // If pixel is white or almost white, make alpha 0
    if (r > 235 && g > 235 && b > 235) {
      data[i + 3] = 0
    }
  }

  // Trim transparent edges and save
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim()
    .png()
    .toFile(outputPath)

  console.log('✅ Transparent logo saved to:', outputPath)
}

processLogo().catch(console.error)
