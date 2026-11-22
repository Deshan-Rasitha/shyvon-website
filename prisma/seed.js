const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SHYVON Database...');

  // 1. Initialize Website Settings
  const settings = await prisma.websiteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      brandName: 'SHYVON',
      brandTagline: 'Pure • Healthy • Delicious',
      brandDescription: 'SHYVON brings you the goodness of nature with pure and authentic Sri Lankan herbs. Pure by Nature, for a Healthier You.',
      logoUrl: '/images/branding/logo.png',
      contactPhone: '+94 71 477 0176',
      whatsappNumber: '+94 71 477 0176',
      businessEmail: 'info@shyvon.com',
      businessAddress: 'Shylie Global Pvt Ltd, Gampaha, Sri Lanka',
      bankName: 'Commercial Bank of Ceylon',
      bankAccountName: 'Shylie Global Pvt Ltd',
      bankAccountNumber: '100012345678',
      bankBranch: 'Gampaha Branch',
      bankInstructions: 'Please deposit the total order amount to the bank account above and upload the deposit slip during checkout or send it via WhatsApp.',
      isBankTransferEnabled: true,
      isCodEnabled: true,
      deliveryFeeStandard: 350.0,
      deliveryFeeFreeThreshold: 5000.0,
      announcementText: 'Complimentary Island-wide Delivery on Orders Over Rs. 5,000',
      announcementActive: true,
      facebookUrl: 'https://facebook.com/shyvonfoods',
      instagramUrl: 'https://instagram.com/shyvonfoods',
      qrTargetUrl: 'https://shyvon.com',
    },
  });
  console.log('✓ Website settings configured');

  // 2. Initialize Authorized Admin Account for Local Development
  const passwordHash = await bcrypt.hash('shyvon2026', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@shyvon.com' },
    update: {
      passwordHash,
    },
    create: {
      email: 'admin@shyvon.com',
      name: 'SHYVON Administrator',
      role: 'SUPER_ADMIN',
      passwordHash,
      isActive: true,
    },
  });
  console.log(`✓ Admin user initialized: ${admin.email}`);

  // 3. Initialize Product Categories
  const catHerbalTea = await prisma.category.upsert({
    where: { slug: 'herbal-teas' },
    update: {},
    create: {
      slug: 'herbal-teas',
      name: 'Herbal Teas & Infusions',
      description: 'Hand-picked organic herbal teas from the lush tropical soils of Sri Lanka.',
      displayOrder: 1,
      isActive: true,
    },
  });

  const catDriedFlowers = await prisma.category.upsert({
    where: { slug: 'dried-flowers' },
    update: {},
    create: {
      slug: 'dried-flowers',
      name: 'Dried Petals & Flowers',
      description: 'Pristine dried floral botanicals for wellness, teas, and soothing aromatherapy.',
      displayOrder: 2,
      isActive: true,
    },
  });

  const catWellness = await prisma.category.upsert({
    where: { slug: 'wellness' },
    update: {},
    create: {
      slug: 'wellness',
      name: 'Wellness & Relaxation',
      description: 'Natural calming remedies to restore balance, peace, and restorative sleep.',
      displayOrder: 3,
      isActive: true,
    },
  });
  console.log('✓ Categories initialized');

  // 4. Seed the initial ONLY ONE real product: Organic Dried Blue Lotus Petals (50g)
  const productBenefits = JSON.stringify([
    'Promotes Relaxation',
    'Supports Better Sleep',
    'Helps Reduce Stress & Anxiety',
    'Rich in Natural Antioxidants',
    'Supports Overall Well-being',
  ]);

  const usageInstructions = JSON.stringify([
    'Prepare a calming herbal tea: Place 3–5 dried petals into a cup or teapot.',
    'Pour 200ml of freshly boiled water (approx. 85°C – 90°C) over the petals.',
    'Cover and steep for 5 to 7 minutes until fragrant and deeply infused.',
    'Enjoy warm as a peaceful evening ritual or blend into your favorite green or white teas.',
  ]);

  const blueLotus = await prisma.product.upsert({
    where: { slug: 'organic-dried-blue-lotus-petals-50g' },
    update: {
      images: {
        deleteMany: {},
        create: [
          {
            url: '/images/products/blue-lotus-petals.jpg',
            alt: 'SHYVON Organic Dried Blue Lotus Petals 50g packaging and tea',
            displayOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
    create: {
      slug: 'organic-dried-blue-lotus-petals-50g',
      name: 'Organic Dried Blue Lotus Petals',
      brand: 'SHYVON',
      netWeight: '50g',
      price: 1850.0,
      discountPrice: 1650.0,
      stock: 65,
      sku: 'SHY-BLP-050',
      isActive: true,
      isFeatured: true,
      shortDescription: 'Pure and authentic Sri Lankan organic dried blue lotus petals, hand-harvested and crafted for a calming, restorative herbal tea experience.',
      description: 'SHYVON brings you the pure goodness of nature with our authentic Sri Lankan Organic Dried Blue Lotus Petals (Nymphaea caerulea). Revered for centuries in traditional Ayurvedic wellness, our blue lotus flowers are sustainably gathered from pristine Sri Lankan freshwater sanctuaries and sun-cured with care to preserve their delicate bioactive essence, subtle sweet floral aroma, and natural purple-blue tones. Prepare a soothing cup before bed to quiet the mind, release day-long tension, and support deep restorative relaxation.',
      ingredients: '100% Pure Organic Dried Blue Lotus Petals (Nymphaea caerulea). Free from artificial colors, flavors, preservatives, and caffeine.',
      benefits: productBenefits,
      usageInstructions: usageInstructions,
      storageInstructions: 'Keep in a cool, dry place, away from direct sunlight.',
      manufacturingInfo: 'Manufactured & Packed by: Shylie Global Pvt Ltd. Gampaha, Sri Lanka. Made in Sri Lanka.',
      metaTitle: 'Organic Dried Blue Lotus Petals 50g | SHYVON Sri Lanka',
      metaDescription: 'Shop authentic Sri Lankan Organic Dried Blue Lotus Petals by SHYVON. Pure, calming, antioxidant-rich herbal tea. Islandwide delivery.',
      images: {
        create: [
          {
            url: '/images/products/blue-lotus-petals.jpg',
            alt: 'SHYVON Organic Dried Blue Lotus Petals 50g packaging and tea',
            displayOrder: 0,
            isPrimary: true,
          },
        ],
      },
      categories: {
        create: [
          { categoryId: catHerbalTea.id },
          { categoryId: catDriedFlowers.id },
          { categoryId: catWellness.id },
        ],
      },
      inventoryAdjustments: {
        create: {
          changeQuantity: 65,
          previousStock: 0,
          newStock: 65,
          reason: 'RESTOCK',
          notes: 'Initial production inventory batch - Shylie Global Pvt Ltd',
        },
      },
    },
  });

  console.log(`✓ Product created: ${blueLotus.name} (${blueLotus.sku})`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
