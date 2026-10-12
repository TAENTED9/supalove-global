import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user from environment variables
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (adminEmail && adminPassword) {
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
      },
    })
    console.log(`✅ Admin user created: ${adminEmail}`)
  } else {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables')
  }

  // Delivery fee setting
  await prisma.setting.upsert({
    where: { key: 'delivery_fee_default' },
    update: {},
    create: { key: 'delivery_fee_default', value: '150000' }, // ₦1500 in kobo
  })

  // Categories
  const categoriesData = [
    { name: 'Grains & Rice', slug: 'grains-rice', image: null },
    { name: 'Beans & Legumes', slug: 'beans-legumes', image: null },
    { name: 'Flours & Garri', slug: 'flours-garri', image: null },
    { name: 'Oils', slug: 'oils', image: null },
    { name: 'Spices & Seasoning', slug: 'spices-seasoning', image: null },
    { name: 'Tubers & Others', slug: 'tubers-others', image: null },
  ]

  const categories: Record<string, string> = {}
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categories[cat.slug] = c.id
  }
  console.log(`✅ ${categoriesData.length} categories created`)

  // Products
  const products = [
    {
      name: 'Premium Nigerian Rice',
      slug: 'premium-nigerian-rice',
      description: 'High-quality locally sourced Nigerian rice. Perfect for jollof, fried rice, and any meal. Clean, parboiled, and ready to cook.',
      categoryId: categories['grains-rice'],
      images: [],
      isFeatured: true,
      variants: [
        { label: '5kg Bag', unit: 'KG', price: 650000, stock: 100, sku: 'RICE-5KG' },
        { label: '25kg Bag', unit: 'BAG', price: 2800000, stock: 50, sku: 'RICE-25KG' },
        { label: '50kg Bag', unit: 'BAG', price: 5200000, stock: 30, sku: 'RICE-50KG' },
      ],
    },
    {
      name: 'Ofada Rice',
      slug: 'ofada-rice',
      description: 'Authentic Ofada rice, the locally grown Nigerian short-grain rice with a distinctive earthy aroma. Great for Ofada stew.',
      categoryId: categories['grains-rice'],
      images: [],
      isFeatured: true,
      variants: [
        { label: '5kg', unit: 'KG', price: 900000, stock: 80, sku: 'OFADA-5KG' },
        { label: '10kg', unit: 'KG', price: 1700000, stock: 40, sku: 'OFADA-10KG' },
      ],
    },
    {
      name: 'Black-Eyed Beans (Ewa Oloyin)',
      slug: 'black-eyed-beans',
      description: 'Sweet and creamy black-eyed beans, perfect for Akara, Moin-Moin, and porridge. Carefully sorted and stone-free.',
      categoryId: categories['beans-legumes'],
      images: [],
      isFeatured: true,
      variants: [
        { label: '5kg', unit: 'KG', price: 750000, stock: 120, sku: 'BEANS-5KG' },
        { label: '25kg Bag', unit: 'BAG', price: 3200000, stock: 60, sku: 'BEANS-25KG' },
      ],
    },
    {
      name: 'Garri (Ijebu)',
      slug: 'garri-ijebu',
      description: 'Fine-grade Ijebu garri, dried and slightly sour. Great for eba or soaked with cold water and groundnuts.',
      categoryId: categories['flours-garri'],
      images: [],
      isFeatured: false,
      variants: [
        { label: '5kg Bag', unit: 'KG', price: 400000, stock: 200, sku: 'GARRI-5KG' },
        { label: '25kg Bag', unit: 'BAG', price: 1800000, stock: 80, sku: 'GARRI-25KG' },
        { label: '50kg Bag', unit: 'BAG', price: 3400000, stock: 40, sku: 'GARRI-50KG' },
      ],
    },
    {
      name: 'Palm Oil',
      slug: 'palm-oil',
      description: 'Pure red palm oil from the South-South region of Nigeria. Rich colour, fresh aroma. No additives or preservatives.',
      categoryId: categories['oils'],
      images: [],
      isFeatured: true,
      variants: [
        { label: '1 Litre', unit: 'LITRE', price: 180000, stock: 150, sku: 'PALMOIL-1L' },
        { label: '5 Litres', unit: 'LITRE', price: 850000, stock: 80, sku: 'PALMOIL-5L' },
        { label: '25 Litres', unit: 'LITRE', price: 3900000, stock: 20, sku: 'PALMOIL-25L' },
      ],
    },
    {
      name: 'Groundnut Oil',
      slug: 'groundnut-oil',
      description: 'Cold-pressed groundnut oil for frying, cooking, and salad dressings. Light golden colour, mild flavour.',
      categoryId: categories['oils'],
      images: [],
      isFeatured: false,
      variants: [
        { label: '1 Litre', unit: 'LITRE', price: 220000, stock: 100, sku: 'GNUTOIL-1L' },
        { label: '5 Litres', unit: 'LITRE', price: 1050000, stock: 50, sku: 'GNUTOIL-5L' },
      ],
    },
    {
      name: 'Tatashe (Red Bell Pepper) Ground',
      slug: 'tatashe-ground',
      description: 'Sun-dried and finely ground tatashe (red bell pepper). Gives your stews and soups that deep red colour.',
      categoryId: categories['spices-seasoning'],
      images: [],
      isFeatured: false,
      variants: [
        { label: '500g', unit: 'KG', price: 180000, stock: 200, sku: 'TATASHE-500G' },
        { label: '1kg', unit: 'KG', price: 340000, stock: 100, sku: 'TATASHE-1KG' },
      ],
    },
    {
      name: 'Crayfish (Smoked)',
      slug: 'crayfish-smoked',
      description: 'Freshly smoked and ground crayfish from Calabar. The secret ingredient in great Nigerian soups.',
      categoryId: categories['spices-seasoning'],
      images: [],
      isFeatured: false,
      variants: [
        { label: '250g', unit: 'KG', price: 250000, stock: 80, sku: 'CRAYFISH-250G' },
        { label: '500g', unit: 'KG', price: 480000, stock: 50, sku: 'CRAYFISH-500G' },
        { label: '1kg Carton', unit: 'CARTON', price: 920000, stock: 30, sku: 'CRAYFISH-1KG' },
      ],
    },
  ]

  for (const p of products) {
    const { variants, ...productData } = p
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    })
    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: { ...v, productId: product.id, unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE' },
      })
    }
  }
  console.log(`✅ ${products.length} products with variants created`)
  console.log('🎉 Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
