const prisma = require("../utills/db");
const path = require("path");
const fs = require("fs");

async function getSingleProductImages(request, response) {
  const { id } = request.params;
  const images = await prisma.image.findMany({
    where: { productID: id },
  });
  if (!images) {
    return response.json({ error: "Images not found" }, { status: 404 });
  }
  // Cache product images briefly
  response.set('Cache-Control', 'public, max-age=60, s-maxage=120');
  return response.json(images);
}

async function createImage(request, response) {
  try {
    const { productID, image } = request.body;
    const createImage = await prisma.image.create({
      data: {
        productID,
        image,
      },
    });
    return response.status(201).json(createImage);
  } catch (error) {
    console.error("Error creating image:", error);
    return response.status(500).json({ error: "Error creating image" });
  }
}

async function updateImage(request, response) {
  try {
    const { id } = request.params; // Getting product id from params
    const { productID, image } = request.body;

    // Checking whether photo exists for the given product id
    const existingImage = await prisma.image.findFirst({
      where: {
        productID: id, // Finding photo with a product id
      },
    });

    // if photo doesn't exist, return coresponding status code
    if (!existingImage) {
      return response
        .status(404)
        .json({ error: "Image not found for the provided productID" });
    }

    // Updating photo using coresponding imageID
    const updatedImage = await prisma.image.update({
      where: {
        imageID: existingImage.imageID, // Using imageID of the found existing image
      },
      data: {
        productID: productID,
        image: image,
      },
    });

    return response.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return response.status(500).json({ error: "Error updating image" });
  }
}

async function deleteImage(request, response) {
  try {
    const { id } = request.params;
    await prisma.image.deleteMany({
      where: {
        productID: String(id), // Converting id to string
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.status(500).json({ error: "Error deleting image" });
  }
}

async function deleteImageById(req, res) {
  try {
    const { imageId } = req.params;
    await prisma.image.delete({ where: { imageID: imageId } });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting single image:", error);
    return res.status(500).json({ error: "Error deleting single image" });
  }
}

module.exports = {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
  uploadProductImages,
  setMainImage,
  deleteImageById,
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function isAllowedMime(m) {
  return ["image/jpeg", "image/png", "image/webp"].includes(String(m).toLowerCase());
}

async function uploadProductImages(req, res) {
  try {
    const productId = req.query.productId || req.body.productId;
    if (!productId) return res.status(400).json({ error: "productId is required" });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const files = req.files?.files || req.files?.file || null;
    if (!files) return res.status(400).json({ error: "No files uploaded" });

    const arr = Array.isArray(files) ? files : [files];
    if (arr.length > 10) return res.status(400).json({ error: "Too many files (max 10)" });

    const targetDir = path.join(__dirname, "..", "..", "public", "products", productId);
    ensureDir(targetDir);

    const saved = [];
    for (const f of arr) {
      if (!isAllowedMime(f.mimetype) || f.size > 5 * 1024 * 1024) {
        return res.status(400).json({ error: "Invalid image. Allowed: jpeg, png, webp; max 5MB" });
      }
      const safeName = Date.now() + "-" + String(f.name || "image.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
      const dest = path.join(targetDir, safeName);
      await f.mv(dest);
      const rel = path.join("products", productId, safeName).replace(/\\/g, "/");
      const created = await prisma.image.create({ data: { productID: productId, image: rel } });
      saved.push({ id: created.imageID, url: `/${rel}` });
    }

    if (!product.mainImage && saved[0]) {
      const mainRel = saved[0].url.startsWith("/") ? saved[0].url.substring(1) : saved[0].url;
      await prisma.product.update({ where: { id: productId }, data: { mainImage: mainRel } });
    }

    return res.status(200).json({ images: saved });
  } catch (e) {
    console.error("Upload product images failed:", e);
    return res.status(500).json({ error: "Upload failed" });
  }
}

async function setMainImage(req, res) {
  try {
    const { imageId } = req.params;
    if (!imageId) return res.status(400).json({ error: "imageId is required" });
    const img = await prisma.image.findUnique({ where: { imageID: imageId } });
    if (!img) return res.status(404).json({ error: "Image not found" });
    await prisma.product.update({ where: { id: img.productID }, data: { mainImage: img.image } });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Set main image failed:", e);
    return res.status(500).json({ error: "Failed to set main image" });
  }
}
