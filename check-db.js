
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const bannerCount = await prisma.banner.count();
        console.log('Banners count:', bannerCount);
        const userCount = await prisma.user.count();
        console.log('Users count:', userCount);
        const productCount = await prisma.product.count();
        console.log('Products count:', productCount);
    } catch (e) {
        console.error('Error connecting to DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
