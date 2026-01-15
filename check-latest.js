
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const banner = await prisma.banner.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        if (banner) {
            console.log('Latest Banner:', banner.title);
            console.log('Position:', banner.position);
            console.log('Active:', banner.active);
            console.log('Created:', banner.createdAt);
        } else {
            console.log('No banners found');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
