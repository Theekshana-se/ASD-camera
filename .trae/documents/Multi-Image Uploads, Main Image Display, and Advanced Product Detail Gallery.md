## Backend
- Add `POST /api/product-images/upload` to accept multiple files for a given `productId` (field: `files[]`, or `file` repeating). Reuse `express-fileupload`.
- Validation: allow only `image/jpeg`, `image/png`, `image/webp`; max size 5MB per file; sanitize filenames.
- Storage: save to `public/products/<productId>/` and return `[{ url, id }]`.
- Persistence: for each uploaded image, create an `Image` record (`imageID`, `productID`, `image` as relative path). If product has no `mainImage`, set the first uploaded image as `product.mainImage`.
- Optional: `PUT /api/product-images/:imageId/main` to set the given image as `product.mainImage`.
- Reference existing files:
  - Current image CRUD: `server/controllers/productImages.js`
  - Main image upload (single-file): `server/controllers/mainImages.js` (use similar validation)

## Admin: Product Create/Edit
- In `app/(dashboard)/admin/products/new/page.tsx` and `[id]/page.tsx`:
  - Add multiple file input or dropzone for product images.
  - On select, upload to `/api/product-images/upload?productId=<id>`, show previews.
  - Allow marking one image as “Set as main”; call `PUT /api/product-images/:imageId/main`.
  - Allow deleting an image (uses existing delete endpoint).
  - Show upload progress and validation errors.

## Product Card
- Ensure `components/ProductCard.tsx` loads `product.mainImage` correctly:
  - If URL begins with `/` or `http`, use as-is; otherwise prefix `/` for local files (as done in `DashboardProductTable.tsx`).
  - Fallback to `/product_placeholder.jpg`.

## Product Detail Page UI/UX
- Create `components/ProductGallery.tsx`:
  - Main area: large image with hover zoom (magnify effect via CSS transform and mouse position tracking).
  - Thumbnails: vertical list or horizontal strip; clicking swaps main image.
  - Fullscreen Lightbox: click main image to open modal carousel (use existing `react-slick`).
  - Keyboard navigation in modal (left/right arrows to change). Close on ESC.
- Integrate in `app/product/[productSlug]/page.tsx`:
  - Use existing `/api/images/:productId` to fetch additional images.
  - Pass `mainImage` + list to `ProductGallery`.
- Additional UI enhancements:
  - Sticky summary column (title, price, CTA) beside gallery.
  - Clear availability states; show deposit and rental info.
  - Add “Share” and “Copy link” actions.

## Security & Performance
- Sanitize filenames; ensure HTTPS for external image URLs.
- Limit number of images per upload (e.g., 10) to prevent abuse.
- Use `next/image` responsive sizes; lazy-load thumbnails.

## Verification
- Admin uploads multiple images; previews appear; one can be set as main.
- Product card shows main image.
- Product detail page displays modern gallery with thumbnails, zoom, and fullscreen modal; keyboard navigation works.
- Invalid uploads (wrong MIME, >5MB) are rejected with safe errors.

## References
- Current product detail: `app/product/[productSlug]/page.tsx`
- Existing image CRUD: `server/controllers/productImages.js`
- Payment upload validation: `server/controllers/paymentMethods.js`