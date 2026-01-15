const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function wipe() {
    try {
        console.log("Deleting ALL client logos...");
        // Bypass schema validation on reads by just deleting everything blindly
        const res = await prisma.clientLogo.deleteMany({});
        console.log("Deleted count:", res.count);

        // Verify
        console.log("Verifying fetch...");
        const items = await prisma.clientLogo.findMany({});
        console.log(`Fetch successful. Count: ${items.length}`);
    } catch (e) {
        console.error("Wipe failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}
wipe();
