const prisma = require('./server/utills/db');

async function deleteAllOrders() {
    try {
        console.log("Starting deletion of all orders...");

        // 1. Delete all order products first (child records)
        const deletedProducts = await prisma.customer_order_product.deleteMany({});
        console.log(`Deleted ${deletedProducts.count} order items (customer_order_product).`);

        // 2. Delete all orders (parent records)
        const deletedOrders = await prisma.Customer_order.deleteMany({});
        console.log(`Deleted ${deletedOrders.count} orders (Customer_order).`);

        console.log("All orders have been successfully deleted.");
    } catch (error) {
        console.error("Error deleting orders:", error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteAllOrders();
