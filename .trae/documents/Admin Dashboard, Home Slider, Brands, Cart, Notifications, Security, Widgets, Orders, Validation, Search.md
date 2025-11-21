## Backend Stats Endpoints
- Create `GET /api/stats/counts` to return:
  - `products.total`: count of products via `prisma.product.count()`
  - `products.offerActive`: count where `isOfferItem=true` and `availabilityStatus=AVAILABLE`
  - `orders.byStatus`: counts for each `OrderStatus` via `prisma.customer_order.groupBy` or multiple `count`
  - `notifications.total`: `prisma.notification.count()`
- Create `GET /api/stats/trends` to return simple time series for charts:
  - Orders per day for last 30 days (`prisma.customer_order.findMany` grouped by date)
  - Offer items count trend per day (optional; can be snapshot using cumulative counts)
- Wire routes in `server/routes/stats.js` and mount in `server/app.js`

## Admin Dashboard UI (Live Stats + Charts)
- Replace hardcoded blocks in `app/(dashboard)/admin/page.tsx:12–25` with fetched stats from `/api/stats/counts` and `/api/stats/trends`
- Use `react-apexcharts` (present in `package.json`) to render:
  - Line chart: orders per day
  - Area or bar chart: offer items trend
- Provide 4 stat cards: Products total, Active offer items, Orders (total), Notifications total

## Homepage Hero from Slider
- Update `server/controllers/slider.js:listSliderItems` to support query `active=true` and filter `{ active: true }`, still ordered by `order` (current ordering at `server/controllers/slider.js:5`)
- Update `components/Hero.tsx`:
  - Replace hardcoded `slides` array at `components/Hero.tsx:34–40`
  - Fetch `/api/slider?active=true` and map items to slides
  - Render `title`, `subtitle`, and CTA from slider item when present; otherwise fallback to `SiteSettings` values already loaded at `components/Hero.tsx:22–32`

## Per‑Brand Logos
- Extend Prisma `Brand` model with `imageUrl String?` (current model at `server/prisma/schema.prisma:109–113`)
- Update `server/controllers/brands.js` to accept `imageUrl` on create/update (current handlers at `server/controllers/brands.js:13–38`)
- Admin UI:
  - Update `app/(dashboard)/admin/brands/page.tsx` and `new/page.tsx` to add an `imageUrl` field and preview
  - Optional: allow upload to `/public/brands/` with a new endpoint (reuse secure upload logic)
- Brands carousel:
  - Update `components/BrandsCarousel.tsx:42–66` to prefer fetching brands first (`/api/brands`) and use `brand.imageUrl` when present;
  - Fallback to `/api/client-logos` if brand logos missing

## Cart Persistence (Server-Side)
- Add Prisma models:
  - `Cart`: `id`, `userId?`, `sessionId?`, `updatedAt`
  - `CartItem`: `id`, `cartId`, `productId`, `quantity`, `priceSnapshot`, `depositSnapshot`
- Controllers and routes `/api/cart`:
  - `GET /api/cart?userId|sessionId` → load
  - `POST /api/cart` → upsert full cart
  - `PUT /api/cart/item` → add/update/remove single item
  - `DELETE /api/cart` → clear
- Frontend integration:
  - Replace `sessionStorage`-only persistence in `app/_zustand/store.ts:26–106` with hydration from server on page load
  - On login, merge anonymous `sessionId` cart into `userId` cart; keep client store in sync after every mutation

## Admin Messenger Notifications
- Utilize existing Messenger endpoint `POST /api/messenger/order-notify` (`server/routes/messenger.js:6`, controller at `server/controllers/messenger.js:4–24`)
- On new order (`server/controllers/customer_orders.js:createCustomerOrder` around `server/controllers/customer_orders.js:46–94`), after successful create:
  - Create admin notification via `prisma.notification.create` with `type=ORDER_UPDATE`, `isRead=false`
  - Send Messenger message to admin PSID (stored in settings, see below)
- Add admin notifications list in dashboard:
  - New page `app/(dashboard)/admin/notifications/page.tsx` showing notifications with read/unread states (reuse logic from `app/notifications/page.tsx:19–225` adapted for admin)

## Image Upload Security
- Strengthen upload controllers:
  - `server/controllers/paymentMethods.js:12–34` and `server/controllers/mainImages.js:1–24`
  - Enforce file size limit (e.g., 5MB), allowed MIME types (`image/jpeg`, `image/png`, `image/webp`), and sanitize filenames (already present)
  - Strip metadata (optional hook; if `sharp` is not installed, implement a placeholder and document)
  - Virus scan hook stub (`scanFile(file)` with a configurable adapter), fail closed on detection
- Validate external image URLs on save (slider, brand): allow only `https://` URLs; reject data URLs and `http://`

## Website Settings: WhatsApp/Messenger Widgets
- Extend `SiteSettings` model (`server/prisma/schema.prisma:242–250`) with:
  - `whatsappNumber String?`, `whatsappEnabled Boolean @default(false)`, `messengerEnabled Boolean @default(false)`, `adminMessengerPsid String?`
- Update `server/controllers/settings.js` upsert to accept and persist new fields (current upsert at `server/controllers/settings.js:27–162`)
- Admin UI (`app/(dashboard)/admin/settings/page.tsx`): add inputs/toggles for WhatsApp number and enable flags
- Render WhatsApp floating button globally when enabled:
  - Include a component in `app/layout.tsx:20–37` providers tree that reads settings and renders a mobile-friendly floating `href=https://wa.me/<number>` button

## Order Review Enhancements
- Orders list (`components/AdminOrders.tsx:20–98`): add columns or badges showing `fulfillmentMethod` and status clarity
- Order detail (`app/(dashboard)/admin/orders/[id]/page.tsx`):
  - Replace tax/shipping placeholders with actual breakdown from model fields `rentalTotal`, `depositTotal`, `grandTotal`, and `fulfillmentMethod` (model at `server/prisma/schema.prisma:85–90`)
  - Quick actions: 
    - Status selector → `PUT /api/orders/:id`
    - Send customer update → create notification and optional Messenger message
    - Copy order summary to clipboard (compose string of items and totals)

## Advanced Input Validation
- Introduce Zod schemas for:
  - Product (create/update) → used in `server/controllers/products.js`
  - Brand (name, imageUrl) → `server/controllers/brands.js`
  - Category (name) → `server/controllers/category.js`
  - Order (create/update) → `server/controllers/customer_orders.js`
- Standardize error responses via `AppError` and ensure consistent HTTP codes
- Sanitize rich text fields (e.g., product description) server-side using `lib/sanitize.ts` patterns where appropriate; ensure controllers strip dangerous HTML

## Search Improvements (Optional)
- Expand `server/controllers/search.js:4–35` to support:
  - Query param `q` (fuzzy `contains`, case-insensitive)
  - Filters: `brand`, `category`, `price`, `inStock`, `isOfferItem`
  - Pagination `page`, `limit`; sorting `sortBy`, `sortOrder`
- Update UI search bar to call new endpoint with debounced queries

## Verification Plan
- Unit-like API checks for new endpoints (manual fetch tests, existing `server/test-logging.js` pattern)
- Dashboard charts render with actual series; confirm no hardcoded numbers
- Hero uses only active slider items and falls back to settings texts
- Brands carousel shows brand logos when set; falls back to client logos
- Cart survives refresh and login by checking server state across browsers
- New order triggers Messenger (with valid `FACEBOOK_PAGE_TOKEN`) and admin in-app notification appears on dashboard
- Upload endpoints reject invalid/large files with safe error messages; only HTTPS external URLs accepted
- Settings toggles control widgets visibility
- Order pages show accurate totals breakdown and quick actions function
- Validation rejects invalid input consistently with helpful errors

## Notes & References
- Hardcoded hero slides are at `components/Hero.tsx:34–40`
- Brands carousel current fallback logic at `components/BrandsCarousel.tsx:42–66`
- Brand model location `server/prisma/schema.prisma:109–113`
- Slider controller ordering at `server/controllers/slider.js:5`
- Admin dashboard stats placeholders at `app/(dashboard)/admin/page.tsx:12–25`
- Order detail totals placeholders at `app/(dashboard)/admin/orders/[id]/page.tsx:368–373`
- Messenger route at `server/routes/messenger.js:6`; controller at `server/controllers/messenger.js:4–24`