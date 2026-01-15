const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkClientLogos() {
    try {
        console.log("Fetching client logos...");
        const items = await prisma.clientLogo.findMany({ orderBy: { order: "asc" } });
        console.log(`Successfully fetched ${items.length} items.`);
        items.forEach(i => {
            console.log(`- ID: ${i.id}, Alt: ${i.alt}, Image Length: ${i.imageUrl ? i.imageUrl.length : 0}`);
        });
    } catch (error) {
        console.error("Error fetching client logos:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkClientLogos();
