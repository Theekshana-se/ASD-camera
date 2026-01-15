
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        console.log('Recent Banners:', JSON.stringify(banners, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
