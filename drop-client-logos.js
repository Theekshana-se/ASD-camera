const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function drop() {
    try {
        console.log("Dropping ClientLogo collection...");

        try {
            const res = await prisma.$runCommandRaw({ drop: "ClientLogo" });
            console.log("Dropped ClientLogo:", res);
        } catch (e) { console.log("ClientLogo drop failed or not found"); }

        try {
            const res2 = await prisma.$runCommandRaw({ drop: "clientLogos" }); // Plural default?
            console.log("Dropped clientLogos:", res2);
        } catch (e) { console.log("clientLogos drop failed or not found"); }

        try {
            const res3 = await prisma.$runCommandRaw({ drop: "ClientLogos" });
            console.log("Dropped ClientLogos:", res3);
        } catch (e) { console.log("ClientLogos drop failed or not found"); }

        console.log("Verifying fetch...");
        const items = await prisma.clientLogo.findMany({});
        console.log(`Fetch successful. Count: ${items.length}`);

    } catch (e) {
        console.error("Final Verification Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}
drop();
