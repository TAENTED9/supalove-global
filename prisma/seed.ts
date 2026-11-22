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

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log(`✅ ${categoriesData.length} categories created`)

  console.log('✅ Product catalog left empty; add products from the admin dashboard')
  console.log('🎉 Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
