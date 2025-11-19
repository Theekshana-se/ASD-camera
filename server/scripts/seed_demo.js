const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const bcrypt = require("bcryptjs");
const prisma = require("../utills/db");

async function upsertCategories(names) {
  const categories = [];
  for (const name of names) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(cat);
  }
  return categories;
}

async function ensureMerchant(name) {
  const existing = await prisma.merchant.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.merchant.create({
    data: { name, status: "ACTIVE" },
  });
}

async function upsertBrands(names) {
  const brands = [];
  for (const name of names) {
    const brand = await prisma.brand.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    brands.push(brand);
  }
  return brands;
}

async function upsertSiteSettings(data) {
  const existing = await prisma.siteSettings.findFirst({});
  if (existing) {
    return prisma.siteSettings.update({ where: { id: existing.id }, data });
  }
  return prisma.siteSettings.create({ data });
}

async function upsertAdmin(email, password) {
  const hashed = await bcrypt.hash(password, 14);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== "admin") {
      await prisma.user.update({ where: { id: existing.id }, data: { role: "admin" } });
    }
    return existing;
  }
  return prisma.user.create({
    data: { email, password: hashed, role: "admin" },
  });
}

async function upsertProducts(items, categoryMap, merchantId) {
  for (const p of items) {
    const categoryId = categoryMap.get(p.categoryName);
    if (!categoryId) {
      console.warn(`Skip product ${p.slug}: missing category ${p.categoryName}`);
      continue;
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        mainImage: p.mainImage,
        price: p.price,
        rating: p.rating ?? 0,
        description: p.description,
        manufacturer: p.manufacturer,
        inStock: p.inStock ?? 1,
        categoryId,
        merchantId,
      },
    });
  }
}

async function main() {
  console.log("Seeding demo data...");

  const adminEmail = "admin@singitronic.com";
  const adminPassword = "Admin12345!"; // Provided to user for login

  const categoryNames = [
    "smart-phones",
    "cameras",
    "mixer-grinders",
    "phone-gimbals",
    "tablet-keyboards",
    "earbuds",
    "speakers",
    "juicers",
    "headphones",
    "watches",
    "laptops",
  ];

  const categories = await upsertCategories(categoryNames);
  console.log(`Categories upserted: ${categories.length}`);
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  const merchant = await ensureMerchant("Demo Merchant");
  console.log(`Merchant ready: ${merchant.name} (${merchant.id})`);

  const brandNames = [
    "Canon",
    "Samsung",
    "DJI",
    "Bosch",
    "HP",
    "Sony",
  ];
  const brands = await upsertBrands(brandNames);
  console.log(`Brands upserted: ${brands.length}`);

  const products = [
    { title: "Smart phone", price: 699, description: "Android smartphone with 128GB", mainImage: "product1.webp", slug: "smart-phone-demo", manufacturer: "Samsung", categoryName: "smart-phones", inStock: 10 },
    { title: "SLR camera", price: 899, description: "DSLR camera 24MP", mainImage: "product2.webp", slug: "slr-camera-demo", manufacturer: "Canon", categoryName: "cameras", inStock: 5 },
    { title: "Mixer grinder", price: 129, description: "3-jar mixer grinder", mainImage: "product3.webp", slug: "mixed-grinder-demo", manufacturer: "ZunVolt", categoryName: "mixer-grinders", inStock: 8 },
    { title: "Phone gimbal", price: 149, description: "3-axis smartphone gimbal", mainImage: "product4.webp", slug: "phone-gimbal-demo", manufacturer: "DJI", categoryName: "phone-gimbals", inStock: 6 },
    { title: "Tablet keyboard", price: 79, description: "Magnetic keyboard for tablets", mainImage: "product5.webp", slug: "tablet-keyboard-demo", manufacturer: "Samsung", categoryName: "tablet-keyboards", inStock: 12 },
    { title: "Wireless earbuds", price: 99, description: "Bluetooth earbuds with ANC", mainImage: "product6.webp", slug: "wireless-earbuds-demo", manufacturer: "Samsung", categoryName: "earbuds", inStock: 20 },
    { title: "Party speakers", price: 249, description: "Portable party speaker", mainImage: "product7.webp", slug: "party-speakers-demo", manufacturer: "SOWO", categoryName: "speakers", inStock: 7 },
    { title: "Slow juicer", price: 159, description: "Cold press slow juicer", mainImage: "product8.webp", slug: "slow-juicer-demo", manufacturer: "Bosch", categoryName: "juicers", inStock: 9 },
    { title: "Wireless headphones", price: 129, description: "Over-ear wireless headphones", mainImage: "product9.webp", slug: "wireless-headphones-demo", manufacturer: "Sony", categoryName: "headphones", inStock: 11 },
    { title: "Smart watch", price: 199, description: "Smartwatch with heart-rate monitor", mainImage: "product10.webp", slug: "smart-watch-demo", manufacturer: "Samsung", categoryName: "watches", inStock: 15 },
    { title: "Notebook horizon", price: 999, description: "Ultrabook 16GB RAM, 512GB SSD", mainImage: "product11.webp", slug: "notebook-horizon-demo", manufacturer: "HP", categoryName: "laptops", inStock: 4 },
    { title: "Mens trimmer", price: 49, description: "Waterproof beard trimmer", mainImage: "product12.webp", slug: "mens-trimmer-demo", manufacturer: "Gillette", categoryName: "speakers", inStock: 18 },
  ];

  await upsertProducts(products, categoryMap, merchant.id);
  console.log(`Products upserted: ${products.length}`);

  const admin = await upsertAdmin(adminEmail, adminPassword);
  console.log(`Admin user ready: ${admin.email}`);

  const siteSettings = await upsertSiteSettings({
    logoUrl: "/logo.png",
    contactPhone: "+1 234 567 890",
    contactEmail: "info@example.com",
    heroTitle: "Welcome to Our Store",
    heroSubtitle: "Shop the latest electronics",
    heroImageUrl: "/hero-image.webp",
    footerSale: [
      { name: "Hot Deals", href: "/deals" },
      { name: "New Arrivals", href: "/new" },
    ],
    footerAbout: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    footerBuy: [
      { name: "How To Buy", href: "/how-to-buy" },
      { name: "Payment Methods", href: "/payments" },
    ],
    footerHelp: [
      { name: "Support", href: "/support" },
      { name: "FAQs", href: "/faq" },
    ],
  });
  console.log("Site settings upserted");

  console.log("Demo data seeding complete.");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });