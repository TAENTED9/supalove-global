import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Server-side client (service role — never expose to client)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Client-side client (anon key)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const PRODUCT_BUCKET = 'products'

export async function uploadProductImage(
  file: File | Blob,
  path: string
): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured')
  }
  const { data, error } = await supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data: urlData } = supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .getPublicUrl(data.path)
  return urlData.publicUrl
}
