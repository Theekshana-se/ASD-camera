const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const getCounts = asyncHandler(async (req, res) => {
  const [productsTotal, offerActive, ordersTotal, notificationsTotal] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isOfferItem: true, availabilityStatus: "AVAILABLE" } }),
    prisma.customer_order.count(),
    prisma.notification.count(),
  ]);

  const statusKeys = ["PENDING", "CONFIRMED", "RENTED", "RETURNED", "COMPLETED", "CANCELED"];
  const ordersByStatus = {};
  await Promise.all(
    statusKeys.map(async (s) => {
      ordersByStatus[s] = await prisma.customer_order.count({ where: { status: s } });
    })
  );

  res.json({
    products: { total: productsTotal, offerActive },
    orders: { total: ordersTotal, byStatus: ordersByStatus },
    notifications: { total: notificationsTotal },
  });
});

const getTrends = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days || "30", 10);
  const since = new Date();
  since.setDate(since.getDate() - days + 1);

  const orders = await prisma.customer_order.findMany({
    where: { dateTime: { gte: since } },
    orderBy: { dateTime: "asc" },
    select: { id: true, dateTime: true },
  });

  const byDay = new Map();
  for (const o of orders) {
    const d = new Date(o.dateTime);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    byDay.set(key, (byDay.get(key) || 0) + 1);
  }

  const series = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    series.push({ date: key, count: byDay.get(key) || 0 });
  }

  res.json({ ordersPerDay: series });
});

module.exports = { getCounts, getTrends };