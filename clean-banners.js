
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        // Select only ID (should work even if other fields are corrupt)
        const banners = await prisma.banner.findMany({ select: { id: true } });
        console.log(`Found ${banners.length} records. Checking integrity...`);

        for (const b of banners) {
            try {
                await prisma.banner.findUnique({ where: { id: b.id } });
            } catch (e) {
                console.log('CORRUPT RECORD FOUND:', b.id);
                console.log('Error:', e.message.split('\n')[0]); // Print first line
                // Try to delete it
                try {
                    await prisma.banner.delete({ where: { id: b.id } });
                    console.log('Deleted corrupt record:', b.id);
                } catch (delErr) {
                    console.log('Failed to delete:', delErr.message.split('\n')[0]);
                }
            }
        }
    } catch (e) {
        console.error('List failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
