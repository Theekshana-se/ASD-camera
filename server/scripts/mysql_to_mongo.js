// Minimal ETL script to migrate data from MySQL to MongoDB
// Usage:
//   node server/scripts/mysql_to_mongo.js "mysql://user:pass@host:3306/db" "mongodb://localhost:27017/singitronic_nextjs"
// This script migrates core tables: categories, merchants, products, users, wishlists, orders, order_items.

const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');

async function main() {
  const [mysqlUrl, mongoUrl] = process.argv.slice(2);
  if (!mysqlUrl || !mongoUrl) {
    console.error('Usage: node server/scripts/mysql_to_mongo.js <MYSQL_URL> <MONGODB_URL>');
    process.exit(1);
  }

  const mysqlConn = await mysql.createConnection(mysqlUrl);
  const mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  const db = mongoClient.db();

  try {
    // Helper to upsert collection documents
    async function upsertMany(collection, docs, key = 'id') {
      if (!docs.length) return;
      const ops = docs.map((doc) => ({
        updateOne: {
          filter: { [key]: doc[key] },
          update: { $set: doc },
          upsert: true,
        },
      }));
      await db.collection(collection).bulkWrite(ops);
      console.log(`Upserted ${docs.length} into ${collection}`);
    }

    // Categories
    const [categories] = await mysqlConn.query('SELECT id, name FROM Category');
    await upsertMany('Category', categories);

    // Merchants
    const [merchants] = await mysqlConn.query(
      'SELECT id, name, description, email, phone, address, status, createdAt, updatedAt FROM Merchant'
    );
    await upsertMany('Merchant', merchants);

    // Products
    const [products] = await mysqlConn.query(
      'SELECT id, slug, title, mainImage, price, rating, description, manufacturer, inStock, categoryId, merchantId FROM Product'
    );
    await upsertMany('Product', products);

    // Users
    const [users] = await mysqlConn.query('SELECT id, email, password, role FROM User');
    await upsertMany('User', users);

    // Wishlists
    const [wishlists] = await mysqlConn.query('SELECT id, productId, userId FROM Wishlist');
    await upsertMany('Wishlist', wishlists);

    // Orders
    const [orders] = await mysqlConn.query(
      'SELECT id, name, lastname, phone, email, company, adress, apartment, postalCode, dateTime, status, city, country, orderNotice, total FROM Customer_order'
    );
    await upsertMany('Customer_order', orders);

    // Order items
    const [orderItems] = await mysqlConn.query(
      'SELECT id, customerOrderId, productId, quantity FROM customer_order_product'
    );
    await upsertMany('customer_order_product', orderItems);

    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await mysqlConn.end();
    await mongoClient.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});