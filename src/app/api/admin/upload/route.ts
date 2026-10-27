import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { supabaseAdmin, PRODUCT_BUCKET } from '@/lib/supabase'
import { requireAdmin } from '@/lib/security'

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function hasValidImageMagic(buffer: Buffer) {
  const signature = buffer.subarray(0, 12)
  return (
    (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) ||
    (signature[0] === 0x89 && signature[1] === 0x50 && signature[2] === 0x4e && signature[3] === 0x47) ||
    (signature[0] === 0x52 && signature[1] === 0x49 && signature[2] === 0x46 && signature[3] === 0x46 && signature[8] === 0x57 && signature[9] === 0x45 && signature[10] === 0x42 && signature[11] === 0x50)
  )
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const mime = file.type || ''
    if (!ALLOWED_MIME_TYPES.has(mime)) {
      return NextResponse.json({ success: false, error: 'Unsupported file type' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File exceeds 5MB limit' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (!hasValidImageMagic(buffer)) {
      return NextResponse.json({ success: false, error: 'Image content is invalid' }, { status: 400 })
    }

    const optimizedBuffer = await sharp(buffer)
      .rotate()
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`

    try {
      if (supabaseAdmin) {
        const { error: uploadError } = await supabaseAdmin.storage
          .from(PRODUCT_BUCKET)
          .upload(filename, optimizedBuffer, {
            contentType: 'image/webp',
            upsert: true,
          })

        if (!uploadError) {
          const { data: urlData } = supabaseAdmin.storage
            .from(PRODUCT_BUCKET)
            .getPublicUrl(filename)

          return NextResponse.json({ success: true, url: urlData.publicUrl })
        }
      }
    } catch (supabaseErr) {
      console.warn('Supabase storage unavailable, falling back to local storage:', supabaseErr)
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const localFilePath = path.join(uploadDir, filename)
    fs.writeFileSync(localFilePath, optimizedBuffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/products/${filename}`,
    })
  } catch (err) {
    console.error('Image upload failed:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to process and upload image' },
      { status: 500 }
    )
  }
}
