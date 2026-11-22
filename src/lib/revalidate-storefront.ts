import { revalidatePath, revalidateTag } from 'next/cache'

export function revalidateStorefrontProducts() {
  revalidateTag('products')
  revalidateTag('settings')
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/products/[slug]', 'page')
}

export function revalidateStorefrontCategories() {
  revalidateTag('categories')
  revalidateTag('products')
  revalidatePath('/')
  revalidatePath('/products')
}
