export interface ProductSpecs {
  origin: string
  packaging: string
  shelfLife: string
  storage: string
}

export const EMPTY_PRODUCT_SPECS: ProductSpecs = {
  origin: '',
  packaging: '',
  shelfLife: '',
  storage: '',
}

export const productSpecsSettingKey = (productId: string) => `product_specs_${productId}`

export function parseProductSpecs(value: string | null | undefined): ProductSpecs | undefined {
  if (!value) return undefined

  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Stored product specifications are not an object')
    }

    const specs = parsed as Record<string, unknown>
    const result = {
      origin: typeof specs.origin === 'string' ? specs.origin.trim() : '',
      packaging: typeof specs.packaging === 'string' ? specs.packaging.trim() : '',
      shelfLife: typeof specs.shelfLife === 'string' ? specs.shelfLife.trim() : '',
      storage: typeof specs.storage === 'string' ? specs.storage.trim() : '',
    }

    return Object.values(result).some(Boolean) ? result : undefined
  } catch (error) {
    console.error('Unable to read product specifications:', error)
    return undefined
  }
}
