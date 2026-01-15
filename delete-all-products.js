const prisma = require('./server/utills/db');

async function deleteAllProducts() {
    try {
        console.log("Starting deletion of all products...");

        // 1. Delete all Wishlist items (related to products)
        const deletedWishlist = await prisma.wishlist.deleteMany({});
        console.log(`Deleted ${deletedWishlist.count} wishlist items.`);

        // 2. Delete all Bulk Upload Items (related to products)
        // Note: If we want to keep batches but remove items linked to products
        const deletedBulkItems = await prisma.bulk_upload_item.deleteMany({});
        console.log(`Deleted ${deletedBulkItems.count} bulk upload items.`);

        // 3. Delete all Product Images (separate model)
        const deletedImages = await prisma.image.deleteMany({});
        console.log(`Deleted ${deletedImages.count} product images.`);

        // 4. Delete Order Products (just in case any remain)
        const deletedOrderProducts = await prisma.customer_order_product.deleteMany({});
        console.log(`Deleted ${deletedOrderProducts.count} order product associations.`);

        // 5. Delete Products
        const deletedProducts = await prisma.product.deleteMany({});
        console.log(`Deleted ${deletedProducts.count} products.`);

        console.log("All products have been successfully deleted.");
    } catch (error) {
        console.error("Error deleting products:", error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteAllProducts();
