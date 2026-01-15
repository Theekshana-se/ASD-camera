const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
    try {
        console.log("Attempting to clean corrupt entries from ClientLogo collection...");
        // Try to delete documents where imageUrl is missing or null
        // Using raw command to bypass Prisma validation schema
        const res = await prisma.$runCommandRaw({
            delete: "ClientLogo",
            deletes: [
                {
                    q: {
                        $or: [
                            { imageUrl: { $exists: false } },
                            { imageUrl: null },
                            { imageUrl: "" }
                        ]
                    },
                    limit: 0
                }
            ]
        });
        console.log("Cleanup result:", JSON.stringify(res, null, 2));

        // Verify by fetching
        console.log("Verifying fetch...");
        const items = await prisma.clientLogo.findMany({});
        console.log(`Fetch successful. Count: ${items.length}`);
    } catch (e) {
        console.error("Cleanup/Verify failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}
clean();
