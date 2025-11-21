const prisma = require('../utills/db');

async function searchProducts(request, response) {
  try {
    const q = String(request.query.q || request.query.query || "").trim();
    const page = parseInt(request.query.page || "1", 10);
    const limit = parseInt(request.query.limit || "20", 10);
    const skip = (page - 1) * limit;
    const brand = request.query.brand ? String(request.query.brand) : undefined;
    const category = request.query.category ? String(request.query.category) : undefined;
    const isOfferItem = request.query.isOfferItem ? String(request.query.isOfferItem).toLowerCase() === "true" : undefined;

    const where = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { manufacturer: { contains: q, mode: "insensitive" } },
      ];
    }
    if (brand) where.brand = { name: { equals: brand } };
    if (category) where.category = { name: { equals: category } };
    if (isOfferItem !== undefined) where.isOfferItem = isOfferItem;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { brand: true, category: true },
        skip,
        take: limit,
        orderBy: { title: "asc" },
      }),
      prisma.product.count({ where }),
    ]);

    response.set('Cache-Control', 'public, max-age=30, s-maxage=60');
    return response.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("Error searching products:", error);
    return response.status(500).json({ error: "Error searching products" });
  }
}

module.exports = { searchProducts };