const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
    try {
        console.log("Deleting ClientLogos with missing imageUrl...");
        // Now that schema allows nulls, we can safely find/delete them
        // Or just use deleteMany with where clause
        const { count } = await prisma.clientLogo.deleteMany({
            where: {
                OR: [
                    { imageUrl: { isSet: false } },
                    { imageUrl: null },
                    { imageUrl: "" }
                ]
            }
        });
        console.log("Deleted count:", count);

        // Verify
        const items = await prisma.clientLogo.findMany({});
        console.log(`Remaining valid items: ${items.length}`);
    } catch (e) {
        console.error("Cleanup failed:", e);
        // Fallback if isSet not supported for Mongo in this prisma version
        try {
            const all = await prisma.clientLogo.findMany();
            const badIds = all.filter(x => !x.imageUrl || x.imageUrl.length < 5).map(x => x.id);
            if (badIds.length > 0) {
                console.log(`Found ${badIds.length} bad records manually. Deleting...`);
                await prisma.clientLogo.deleteMany({
                    where: { id: { in: badIds } }
                });
                console.log("Deleted manually.");
            }
        } catch (e2) {
            console.error("Manual fallback failed:", e2);
        }
    } finally {
        await prisma.$disconnect();
    }
}
clean();
