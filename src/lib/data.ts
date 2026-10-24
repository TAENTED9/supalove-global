import { prisma } from '@/lib/prisma'

export interface CategoryItem {
  id: string
  name: string
  slug: string
  image?: string | null
  description?: string
}

export interface VariantItem {
  id: string
  label: string
  unit: 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE'
  price: number // in kobo
  compareAtPrice?: number | null // original price before discount (in kobo)
  stock: number
  minOrderQty?: number // minimum order quantity
  sku: string
  priceTiers?: PriceTierItem[]
}

export interface PriceTierItem {
  id: string
  minQty: number
  price: number // in kobo
}

export interface ProductItem {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  category: { id: string; name: string; slug: string }
  images: string[]
  isActive: boolean
  isFeatured: boolean
  variants: VariantItem[]
}

export interface ProductFilterParams {
  category?: string
  unit?: string
  search?: string
  minPrice?: number // in Naira
  maxPrice?: number // in Naira
  sort?: string // 'price_asc' | 'price_desc' | 'newest' | 'featured'
  page?: number
  limit?: number
}

export const FALLBACK_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'Grains & Cereals', slug: 'grains-cereals', description: 'Rice, maize, millet, sesame & sorghum' },
  { id: 'cat-2', name: 'Cooking Oils', slug: 'cooking-oils', description: 'Pure red palm oil & golden groundnut oil' },
  { id: 'cat-3', name: 'Legumes & Beans', slug: 'legumes-beans', description: 'Oloyin sweet beans, brown beans & soya' },
  { id: 'cat-4', name: 'Root Crops & Flours', slug: 'root-crops', description: 'Ijebu garri, fermented fufu & cocoyam flour' },
  { id: 'cat-5', name: 'Spices & Seasonings', slug: 'spices-seasonings', description: 'Calabar smoked crayfish, tatashe & locust bean' },
  { id: 'cat-6', name: 'Beverages & Dried Herbs', slug: 'beverages', description: 'Zobo flowers, raw honey & tiger nuts' },
]

export const ALL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Premium Nigerian Rice (Parboiled)',
    slug: 'premium-nigerian-rice',
    description: 'High-quality locally sourced Nigerian rice. Perfect for jollof, fried rice, and any meal. Clean, parboiled, 100% stone-free, and ready to cook.',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Grains & Cereals', slug: 'grains-cereals' },
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: 'var-1a', label: '5kg Retail Bag', unit: 'KG', price: 650000, stock: 120, minOrderQty: 1, sku: 'RICE-5KG' },
      { id: 'var-1b', label: '25kg Half Bag', unit: 'BAG', price: 2800000, stock: 50, minOrderQty: 1, sku: 'RICE-25KG' },
      { id: 'var-1c', label: '50kg Full Wholesale Bag', unit: 'BAG', price: 5200000, stock: 35, minOrderQty: 1, sku: 'RICE-50KG' },
    ],
  },
  {
    id: 'prod-2',
    name: 'Pure South-South Red Palm Oil',
    slug: 'palm-oil',
    description: 'Pure red palm oil from the South-South region of Nigeria. Rich colour, fresh aroma, unadulterated with zero artificial coloring. Export grade.',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Cooking Oils', slug: 'cooking-oils' },
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: 'var-2a', label: '1 Litre Bottle', unit: 'LITRE', price: 180000, stock: 150, minOrderQty: 1, sku: 'PALM-1L' },
      { id: 'var-2b', label: '5 Litres Jerrycan', unit: 'LITRE', price: 850000, stock: 80, minOrderQty: 1, sku: 'PALM-5L' },
      { id: 'var-2c', label: '25 Litres Bulk Export Drum', unit: 'LITRE', price: 3900000, stock: 25, minOrderQty: 1, sku: 'PALM-25L' },
    ],
  },
  {
    id: 'prod-3',
    name: 'Black-Eyed Beans (Ewa Oloyin Sweet)',
    slug: 'black-eyed-beans',
    description: 'Sweet and creamy honey beans, perfect for Akara, Moin-Moin, and beans porridge. Carefully sorted, stone-free, and pesticide-safe.',
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Legumes & Beans', slug: 'legumes-beans' },
    images: ['https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: 'var-3a', label: '5kg Pack', unit: 'KG', price: 750000, stock: 120, minOrderQty: 1, sku: 'BEANS-5KG' },
      { id: 'var-3b', label: '25kg Wholesale Bag', unit: 'BAG', price: 3200000, stock: 60, minOrderQty: 1, sku: 'BEANS-25KG' },
    ],
  },
  {
    id: 'prod-4',
    name: 'Authentic Ijebu Garri (Crispy & Dry)',
    slug: 'garri-ijebu',
    description: 'Fine-grade Ijebu garri, roasted to a dry, crispy, and delightfully sour perfection. Great for soaking with cold water & groundnuts or making smooth eba.',
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Root Crops & Flours', slug: 'root-crops' },
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: 'var-4a', label: '5kg Bag', unit: 'KG', price: 400000, stock: 200, minOrderQty: 1, sku: 'GARRI-5KG' },
      { id: 'var-4b', label: '25kg Wholesale Bag', unit: 'BAG', price: 1800000, stock: 80, minOrderQty: 1, sku: 'GARRI-25KG' },
      { id: 'var-4c', label: '50kg Bulk Bag', unit: 'BAG', price: 3400000, stock: 40, minOrderQty: 1, sku: 'GARRI-50KG' },
    ],
  },
  {
    id: 'prod-5',
    name: 'Calabar Smoked Crayfish (Whole & Dried)',
    slug: 'crayfish-smoked',
    description: 'Freshly harvested sea crayfish from Calabar, traditionally hardwood-smoked and sun-dried. The authentic secret ingredient for traditional Nigerian soups.',
    categoryId: 'cat-5',
    category: { id: 'cat-5', name: 'Spices & Seasonings', slug: 'spices-seasonings' },
    images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: 'var-5a', label: '250g Retail Bag', unit: 'KG', price: 250000, stock: 80, minOrderQty: 1, sku: 'CRAY-250G' },
      { id: 'var-5b', label: '500g Chef Pack', unit: 'KG', price: 480000, stock: 50, minOrderQty: 1, sku: 'CRAY-500G' },
      { id: 'var-5c', label: '1kg Carton Box', unit: 'CARTON', price: 920000, stock: 30, minOrderQty: 1, sku: 'CRAY-1KG' },
    ],
  },
  {
    id: 'prod-6',
    name: 'Pure Raw Nigerian Forest Honey',
    slug: 'raw-honey',
    description: 'Unprocessed, pure raw honey harvested from natural forest apiaries across Nigeria. Rich in natural floral antioxidants. Zero added sugar.',
    categoryId: 'cat-6',
    category: { id: 'cat-6', name: 'Beverages & Dried Herbs', slug: 'beverages' },
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: 'var-6a', label: '250ml Glass Jar', unit: 'LITRE', price: 350000, stock: 50, minOrderQty: 1, sku: 'HONEY-250ML' },
      { id: 'var-6b', label: '500ml Glass Jar', unit: 'LITRE', price: 650000, stock: 30, minOrderQty: 1, sku: 'HONEY-500ML' },
      { id: 'var-6c', label: '1 Litre Bottle', unit: 'LITRE', price: 1200000, stock: 15, minOrderQty: 1, sku: 'HONEY-1L' },
    ],
  },
  {
    id: 'prod-7',
    name: 'Special Ofada Rice (Aromatic Short Grain)',
    slug: 'ofada-rice',
    description: 'Authentic Ofada rice, locally grown short-grain rice with its distinctive earthy aroma and wholesome bran intact. Perfect for native Ofada stew (Ayamase).',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Grains & Cereals', slug: 'grains-cereals' },
    images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: 'var-7a', label: '5kg Pack', unit: 'KG', price: 900000, stock: 80, minOrderQty: 1, sku: 'OFADA-5KG' },
      { id: 'var-7b', label: '10kg Bag', unit: 'KG', price: 1700000, stock: 40, minOrderQty: 1, sku: 'OFADA-10KG' },
    ],
  },
  {
    id: 'prod-8',
    name: 'Sun-Dried Hibiscus Flowers (Zobo Leaves)',
    slug: 'zobo-dry-leaves',
    description: 'Premium whole dried hibiscus calyces (zobo) for making revitalizing Nigerian zobo beverages. Dust-sifted, deep ruby color, high acidity.',
    categoryId: 'cat-6',
    category: { id: 'cat-6', name: 'Beverages & Dried Herbs', slug: 'beverages' },
    images: ['https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: true,
    variants: [
      { id: 'var-8a', label: '500g Bag', unit: 'KG', price: 150000, stock: 120, minOrderQty: 1, sku: 'ZOBO-500G' },
      { id: 'var-8b', label: '1kg Bulk Bag', unit: 'KG', price: 280000, stock: 60, minOrderQty: 1, sku: 'ZOBO-1KG' },
    ],
  },
  {
    id: 'prod-9',
    name: 'Cold-Pressed Groundnut Oil',
    slug: 'groundnut-oil',
    description: 'Cold-pressed golden groundnut oil for healthy frying, stews, and baking. High smoke point, mild nutty aroma, 100% cholesterol-free.',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Cooking Oils', slug: 'cooking-oils' },
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-9a', label: '1 Litre Bottle', unit: 'LITRE', price: 220000, stock: 100, minOrderQty: 1, sku: 'GNUT-1L' },
      { id: 'var-9b', label: '5 Litres Jerrycan', unit: 'LITRE', price: 1050000, stock: 50, minOrderQty: 1, sku: 'GNUT-5L' },
    ],
  },
  {
    id: 'prod-10',
    name: 'Finely Ground Tatashe (Red Bell Pepper)',
    slug: 'tatashe-ground',
    description: 'Sun-dried and finely ground premium red tatashe bell peppers. Imparts vivid red color and sweet pepper richness to stews and jollof rice.',
    categoryId: 'cat-5',
    category: { id: 'cat-5', name: 'Spices & Seasonings', slug: 'spices-seasonings' },
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-10a', label: '500g Pack', unit: 'KG', price: 180000, stock: 200, minOrderQty: 1, sku: 'TATA-500G' },
      { id: 'var-10b', label: '1kg Bulk Pack', unit: 'KG', price: 340000, stock: 100, minOrderQty: 1, sku: 'TATA-1KG' },
    ],
  },
  {
    id: 'prod-11',
    name: 'High-Protein Soya Beans',
    slug: 'soya-beans',
    description: 'Cleaned and sorted golden soya beans. High in plant protein, ideal for soy milk, tofu (beske/awara), baby weaning food, and poultry feed formulation.',
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Legumes & Beans', slug: 'legumes-beans' },
    images: ['https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-11a', label: '5kg Pack', unit: 'KG', price: 500000, stock: 100, minOrderQty: 1, sku: 'SOYA-5KG' },
      { id: 'var-11b', label: '25kg Wholesale Bag', unit: 'BAG', price: 2200000, stock: 40, minOrderQty: 1, sku: 'SOYA-25KG' },
    ],
  },
  {
    id: 'prod-12',
    name: 'Fermented Cassava Flour (Fufu / Akpu)',
    slug: 'cassava-flour-fufu',
    description: 'Carefully fermented and odorless dried cassava flour for lump-free, silky fufu swallow. Fast to cook, consistent texture every single time.',
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Root Crops & Flours', slug: 'root-crops' },
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-12a', label: '1kg Retail Pack', unit: 'KG', price: 200000, stock: 150, minOrderQty: 1, sku: 'FUFU-1KG' },
      { id: 'var-12b', label: '5kg Family Pack', unit: 'KG', price: 950000, stock: 60, minOrderQty: 1, sku: 'FUFU-5KG' },
    ],
  },
  {
    id: 'prod-13',
    name: 'Cleaned Pearl Millet (Maiwa)',
    slug: 'millet',
    description: 'Screened and stone-free pearl millet grains. Used for making nutritious breakfast pap (akamu/ogi baba), fura da nono, and wholesome baking.',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Grains & Cereals', slug: 'grains-cereals' },
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-13a', label: '5kg Pack', unit: 'KG', price: 450000, stock: 80, minOrderQty: 1, sku: 'MILLET-5KG' },
      { id: 'var-13b', label: '25kg Wholesale Bag', unit: 'BAG', price: 2000000, stock: 30, minOrderQty: 1, sku: 'MILLET-25KG' },
    ],
  },
  {
    id: 'prod-14',
    name: 'Cocoyam Flour (Ede Soup Thickener)',
    slug: 'cocoyam',
    description: 'Dried and ground cocoyam flour, the quintessential soup thickener for native Igbo soups including Ofe Onugbu (Bitterleaf) and Ofe Oha.',
    categoryId: 'cat-4',
    category: { id: 'cat-4', name: 'Root Crops & Flours', slug: 'root-crops' },
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-14a', label: '2kg Pack', unit: 'KG', price: 300000, stock: 60, minOrderQty: 1, sku: 'COCO-2KG' },
      { id: 'var-14b', label: '5kg Chef Pack', unit: 'KG', price: 680000, stock: 30, minOrderQty: 1, sku: 'COCO-5KG' },
    ],
  },
  {
    id: 'prod-15',
    name: 'Fresh Bitter Kola (Garcinia Kola)',
    slug: 'bitter-kola',
    description: 'Premium whole bitter kola nuts with potent astringent and health benefits. Sourced fresh from Southwest forests, moist and well preserved.',
    categoryId: 'cat-5',
    category: { id: 'cat-5', name: 'Spices & Seasonings', slug: 'spices-seasonings' },
    images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-15a', label: '250g Pouch', unit: 'KG', price: 400000, stock: 40, minOrderQty: 1, sku: 'KOLA-250G' },
      { id: 'var-15b', label: '500g Pack', unit: 'KG', price: 750000, stock: 20, minOrderQty: 1, sku: 'KOLA-500G' },
    ],
  },
  {
    id: 'prod-16',
    name: 'Fermented Locust Bean (Ogiri / Iru)',
    slug: 'ogiri-locust-bean',
    description: 'Traditional fermented African locust bean paste (ogiri/iru). Imparts rich savory umami and depth to traditional Nigerian egusi and native soups.',
    categoryId: 'cat-5',
    category: { id: 'cat-5', name: 'Spices & Seasonings', slug: 'spices-seasonings' },
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-16a', label: '100g Wrap', unit: 'PIECE', price: 80000, stock: 200, minOrderQty: 1, sku: 'IRU-100G' },
      { id: 'var-16b', label: '500g Sealed Container', unit: 'KG', price: 380000, stock: 80, minOrderQty: 1, sku: 'IRU-500G' },
    ],
  },
  {
    id: 'prod-17',
    name: 'Yellow Maize (Dry Corn Grains)',
    slug: 'corn-maize',
    description: 'Whole dried yellow corn grains. Ideal for ogi (corn pap), cornmeal, pop corn, and livestock feed formulations. Stone-free and dry.',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Grains & Cereals', slug: 'grains-cereals' },
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-17a', label: '5kg Pack', unit: 'KG', price: 380000, stock: 100, minOrderQty: 1, sku: 'CORN-5KG' },
      { id: 'var-17b', label: '25kg Wholesale Bag', unit: 'BAG', price: 1700000, stock: 50, minOrderQty: 1, sku: 'CORN-25KG' },
      { id: 'var-17c', label: '50kg Bulk Bag', unit: 'BAG', price: 3200000, stock: 20, minOrderQty: 1, sku: 'CORN-50KG' },
    ],
  },
  {
    id: 'prod-18',
    name: 'Natural White Sesame Seeds (Benne)',
    slug: 'sesame-seeds',
    description: 'Premium white sesame seeds sourced from Benue and Nasarawa farms. Clean, high oil content, export grade for cooking, bakery, and oil pressing.',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Grains & Cereals', slug: 'grains-cereals' },
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-18a', label: '1kg Pouch', unit: 'KG', price: 350000, stock: 80, minOrderQty: 1, sku: 'SESAME-1KG' },
      { id: 'var-18b', label: '5kg Bag', unit: 'KG', price: 1600000, stock: 30, minOrderQty: 1, sku: 'SESAME-5KG' },
    ],
  },
  {
    id: 'prod-19',
    name: 'Nigerian Brown Cowpea Beans',
    slug: 'cowpea-brown-beans',
    description: 'Wholesome brown cowpeas. Soft boiling, full of natural earthy flavour. Excellent for beans and plantain or porridge.',
    categoryId: 'cat-3',
    category: { id: 'cat-3', name: 'Legumes & Beans', slug: 'legumes-beans' },
    images: ['https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-19a', label: '5kg Pack', unit: 'KG', price: 700000, stock: 80, minOrderQty: 1, sku: 'COWPEA-5KG' },
      { id: 'var-19b', label: '25kg Wholesale Bag', unit: 'BAG', price: 3000000, stock: 30, minOrderQty: 1, sku: 'COWPEA-25KG' },
    ],
  },
  {
    id: 'prod-20',
    name: 'Sun-Dried Tiger Nuts (Ofio / Aya)',
    slug: 'tiger-nuts',
    description: 'Naturally sweet dried tiger nuts. High fiber, ideal for making rich creamy kunnu aya tiger nut milk or healthy snacking.',
    categoryId: 'cat-6',
    category: { id: 'cat-6', name: 'Beverages & Dried Herbs', slug: 'beverages' },
    images: ['https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'],
    isActive: true,
    isFeatured: false,
    variants: [
      { id: 'var-20a', label: '500g Pouch', unit: 'KG', price: 250000, stock: 100, minOrderQty: 1, sku: 'TIGER-500G' },
      { id: 'var-20b', label: '1kg Pack', unit: 'KG', price: 450000, stock: 50, minOrderQty: 1, sku: 'TIGER-1KG' },
    ],
  },
]

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    if (categories && categories.length > 0) {
      return categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image,
      }))
    }
  } catch {
    // Fallback if DB is not populated
  }
  return FALLBACK_CATEGORIES
}

export async function getFeaturedProducts(): Promise<ProductItem[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          include: {
            priceTiers: {
              orderBy: { minQty: 'asc' },
            },
          },
        },
      },
      take: 8,
    })
    if (products && products.length > 0) {
      return products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
      }))
    }
  } catch {
    // Fallback if DB is not populated
  }
  return ALL_PRODUCTS.filter((p) => p.isFeatured)
}

export async function getProducts(params: ProductFilterParams = {}): Promise<{
  products: ProductItem[]
  total: number
  totalPages: number
  currentPage: number
}> {
  const { category, unit, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = params

  try {
    // Build Prisma query where clause
    const whereClause: Record<string, unknown> = {
      isActive: true,
    }

    if (category) {
      whereClause.category = { slug: category }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (unit) {
      whereClause.variants = {
        some: {
          unit: unit,
        },
      }
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where: whereClause }),
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          variants: {
            orderBy: { price: 'asc' },
            include: {
              priceTiers: {
                orderBy: { minQty: 'asc' },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    if (products && products.length > 0) {
      const mapped = products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
      }))

      // Apply client-side price filter if specified
      let filtered = mapped
      if (minPrice != null) {
        filtered = filtered.filter((p) => p.variants.some((v) => v.price >= minPrice * 100))
      }
      if (maxPrice != null) {
        filtered = filtered.filter((p) => p.variants.some((v) => v.price <= maxPrice * 100))
      }

      // Apply sorting
      if (sort === 'price_asc') {
        filtered.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0))
      } else if (sort === 'price_desc') {
        filtered.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0))
      }

      return {
        products: filtered,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
      }
    }
  } catch {
    // Fallback mode using ALL_PRODUCTS array
  }

  // Filter in memory from ALL_PRODUCTS
  let filtered = [...ALL_PRODUCTS]

  if (category) {
    filtered = filtered.filter((p) => p.category.slug === category)
  }

  if (unit) {
    filtered = filtered.filter((p) => p.variants.some((v) => v.unit === unit))
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  }

  if (minPrice != null) {
    filtered = filtered.filter((p) => p.variants.some((v) => v.price >= minPrice * 100))
  }

  if (maxPrice != null) {
    filtered = filtered.filter((p) => p.variants.some((v) => v.price <= maxPrice * 100))
  }

  if (sort === 'price_asc') {
    filtered.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0))
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0))
  } else if (sort === 'newest') {
    filtered.reverse()
  }

  const total = filtered.length
  const startIndex = (page - 1) * limit
  const paginated = filtered.slice(startIndex, startIndex + limit)

  return {
    products: paginated,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    currentPage: page,
  }
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          include: {
            priceTiers: {
              orderBy: { minQty: 'asc' },
            },
          },
        },
      },
    })

    if (product) {
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        category: product.category,
        images: product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        variants: product.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
      }
    }
  } catch {
    // Fallback if DB error
  }

  const found = ALL_PRODUCTS.find((p) => p.slug === slug)
  return found || null
}

export async function getRelatedProducts(currentId: string, categoryId: string): Promise<ProductItem[]> {
  try {
    const related = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentId },
        isActive: true,
      },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          include: {
            priceTiers: {
              orderBy: { minQty: 'asc' },
            },
          },
        },
      },
      take: 4,
    })

    if (related && related.length > 0) {
      return related.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
      }))
    }
  } catch {
    // Fallback if DB error
  }

  return ALL_PRODUCTS.filter((p) => p.id !== currentId && (p.categoryId === categoryId || p.category.slug === categoryId)).slice(0, 4)
}
