const prisma = require('./server/utills/db');

async function deleteUserCascade() {
    const email = "admin@singitronic.com";
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("User not found.");
            return;
        }
        console.log("Found user:", user.id);

        // Delete Notifications
        const deletedNotifications = await prisma.notification.deleteMany({
            where: { userId: user.id }
        });
        console.log(`Deleted ${deletedNotifications.count} notifications.`);

        // Delete Wishlist items
        const deletedWishlist = await prisma.wishlist.deleteMany({
            where: { userId: user.id }
        });
        console.log(`Deleted ${deletedWishlist.count} wishlist items.`);

        // Delete Bulk Upload Batches (if strictly required, though optional in schema)
        // Actually, update them to have null userId if possible, or delete. 
        // Since it's 'UserBatches', let's just update to null or delete. 
        // Schema says userId String?, so SetNull behavior is expected but Prisma doesn't always auto-do it on Mongo.
        // Let's safe delete batches if they belong to this user? Or just leave them (SetNull).
        // Let's try deleting user now. If it fails on batches, we will fix batches.

        // Attempt delete user
        await prisma.user.delete({ where: { id: user.id } });
        console.log("User deleted successfully.");

    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

deleteUserCascade();
