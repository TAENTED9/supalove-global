import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { auth } from '@/lib/auth'
import { supabaseAdmin, PRODUCT_BUCKET } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Compress & convert to optimized WebP
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`

    // Attempt Supabase Storage upload
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

    // Fallback: save to public/uploads/products
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
