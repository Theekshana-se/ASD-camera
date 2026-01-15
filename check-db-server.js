
require('dotenv').config();
const path = require('path');

try {
    const serverPrismaPath = path.join(__dirname, 'server', 'node_modules', '@prisma', 'client');
    console.log('Loading Prisma from:', serverPrismaPath);
    const { PrismaClient } = require(serverPrismaPath);

    const prisma = new PrismaClient();

    async function check() {
        console.log('Connecting...');
        const banners = await prisma.banner.findMany({
            orderBy: { order: "asc" }
        });
        console.log('Banners fetched:', banners.length);
        if (banners.length > 0) {
            console.log('Sample:', banners[0].title);
        }
        await prisma.$disconnect();
    }

    check().catch(e => {
        console.error('Check failed:', e);
        prisma.$disconnect();
    });
} catch (e) {
    console.error('Require failed:', e);
}
