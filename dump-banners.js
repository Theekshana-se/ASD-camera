
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const banners = await prisma.banner.findMany();
    console.log('Banners:', JSON.stringify(banners, null, 2));
    await prisma.$disconnect();
}
check();
