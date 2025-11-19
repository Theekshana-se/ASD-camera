## Current Coverage vs Requirements
- Admin Login & Route Protection: Implemented via NextAuth credentials (`utils/authOptions.ts`) and middleware (`middleware.ts`).
- Categories: Full CRUD exists (`server/controllers/category.js`, routes `/api/categories`). Admin pages present for list/new/edit.
- Products: Full CRUD with fields (name, category, brand, description, price/day, deposit, availability, features, images, cover photo) implemented across API and admin pages. Offer flag `isOfferItem` exists and homepage shows offers (`components/OfferItemsSection.tsx`).
- Orders: Creation, update, listing supported (`server/controllers/customer_orders.js`), admin pages exist.
- Site Settings: Implemented (`server/controllers/settings.js`, admin settings page).
- Notifications (internal): Implemented via Prisma `Notification` and endpoints.
- Bulk Upload: Implemented.
- Brands: Model and GET endpoint exist; missing admin UI and create/update/delete endpoints.
- Homepage Cover/Slider Admin: Homepage slider exists (`components/SimpleSlider.tsx`), but no admin UI or storage for slider items; main image upload controller exists but not wired to admin UI.
- Client Logos, Banners: Not implemented.
- Messenger Integration: Not implemented.
- Cart Persistence: Cart implemented client-side; no temporary DB table.
- Dashboard Stats: UI placeholder exists; real metrics not wired.

## Gaps To Implement
- Brand Management: Admin UI + API for create/update/delete.
- Images Slider Admin: CRUD for slider items (image, title, link), storage and frontend consumption.
- Client Logos: CRUD list and display on frontend.
- Banners: CRUD for homepage/section banners.
- Offer Item Management UX: Toggle, cover photo upload in admin, ensure homepage highlights offer items.
- Dashboard Stats: Real metrics for products, offers, orders/messages.
- Messenger Integration: Send checkout details to ASD Camera Messenger; add chat plugin.
- Cart Temporary Storage: Optional server-side cart cache for anonymous users.
- Security Hardening: Image upload validation, admin/user validations, permissions.

## Technical Implementation
### Admin Authentication & Permissions
- Use existing NextAuth credentials; ensure only `role='admin'` can access `/admin` via middleware.
- Add session timeout and audit logs for admin actions.

### Category & Brand Management
- API: Extend `/api/brands` router to support `POST`, `PUT`, `DELETE` with validation (align with `category.js`).
- Admin UI: Create `app/(dashboard)/admin/brands/page.tsx`, `new/page.tsx`, `[id]/page.tsx` mirroring categories pages (list, create, edit).

### Product Management Enhancements
- Ensure all fields in admin forms are present with validation: rent price/day (`price`), deposit, availability enum, features array, multiple images upload, cover photo.
- Multiple Images: Add UI to upload/remove additional images; wire to `server/controllers/productImages.js` and main image upload controller.
- Availability Toggle: Quick toggle in product list to enable/disable (`availabilityStatus` or `inStock`).

### Offer Item Management
- Admin Toggle: Add `isOfferItem` toggle in product list and edit page.
- Cover Photo Highlight: Allow separate cover photo upload for offer items; store in `Product.coverPhoto`.
- Homepage: Ensure `OfferItemsSection` pulls top offer items beneath cover.

### Homepage Cover & Slider
- Data Model: Add `SiteSettings.heroImageUrl` already present; also create `SliderItem` model or reuse `SiteSettings` JSON arrays for slider items.
- API: Create routes `/api/slider` CRUD.
- Admin UI: Create `app/(dashboard)/admin/images-slider` to manage slider items (image, title, subtitle, CTA link).
- Frontend: Update `SimpleSlider` to render from API data, support autoplay and responsiveness.

### Client Logos & Banners
- Models: Add `ClientLogo` and `Banner` models (image, alt, link, order, active flag).
- API: CRUD endpoints `/api/client-logos`, `/api/banners`.
- Admin UI: Pages to upload/reorder logos; manage banners.
- Frontend: Add logos strip and banners on homepage/sections.

### User Side
- Confirm products, categories, brands, offer items listing pages are correct and fast; add brand filter to shop page (already partially supported by query handling in `products` controller).
- Product details: Ensure multiple images, price/day, features, booking status, add-to-cart present.

### Search & Filter
- Filters: Wire brand, category, price filters to existing `GET /api/products` with validated query parsing in `controllers/products.js`.
- UI: Add filter components for brand and price.

### Cart & Booking
- Cart Page: Confirm items, qty, totals; allow remove.
- Checkout: Ensure fields name, phone, rental date, duration, delivery/pickup are saved; already supported in `Customer_order`.
- Server: Validate inputs, prevent duplicates (already partially implemented) and compute totals.

### Messenger Integration
- Outbound: On order confirmation, send a Facebook Messenger message via Send API using Page Access Token (`FACEBOOK_PAGE_TOKEN`) and recipient PSID.
- Recipient:
  - Option A: Use Messenger Chat Plugin to capture PSID on frontend and store in order.
  - Option B: Use WhatsApp or fallback email if Messenger is not available.
- Payload: Items, dates, totals, customer details.
- Admin Notifications: Also create internal Notification entries so admin can see order notifications in dashboard.

### Order Notifications
- Admin View: Use existing notifications system; add page `/admin/notifications` to view unread/read.
- Messenger: Ensure admins also receive Messenger/WhatsApp notification if desired.

### Security & Permissions
- Input validation both client and server (`utills/validation.js`, `utils/validation.ts`).
- Image Uploads: Enforce MIME checks, size limits, store to safe path or object storage, sanitize filenames.
- Rate limiting: Already enabled in Express; ensure Next API endpoints respect auth.

### Website Settings
- Admin UI already present; extend to include social links and widgets configuration (Messenger/WhatsApp codes); save in `SiteSettings`.

### Responsive UI
- Tailwind/DaisyUI already used; ensure new admin pages and components are mobile/tablet responsive.

### Database Structure
- Existing: Categories, Brands, Products, Offer flag, Orders, Admin users, SiteSettings.
- New: `SliderItem`, `ClientLogo`, `Banner`; optional `CartItemCache` for anonymous carts.

### Admin Sidebar Navigation
- Sidebar updated to include all required sections (Dashboard, Images Slider, Configurations, Products, Categories, Client Logos, Brands, Banners, Customers, Admins, Merchant). Ensure active state styling.

### Testing & Verification
- Unit: Validate API controllers for brands, slider, logos, banners.
- E2E: Place test data and verify admin pages, homepage slider, offers, checkout, message send.
- Logging: Extend request/error logging and add audit logs on admin actions.

## Deliverables
- New Prisma models & migrations for SliderItem, ClientLogo, Banner.
- API routes and controllers for brands (POST/PUT/DELETE), slider, logos, banners.
- Admin pages for brands, images slider, client logos, banners; enhancements to products pages (multi-image, offer toggle).
- Messenger integration with order send and chat plugin.
- Dashboard stats wired to real data.
- Security validations for uploads and forms.

## Configuration Needed
- `.env` additions: `FACEBOOK_PAGE_TOKEN`, `FACEBOOK_APP_ID`, `FACEBOOK_PAGE_ID`, `NEXTAUTH_SECRET`, `FRONTEND_URL`, `NEXTAUTH_URL`.
- Optional: storage credentials if using cloud object storage for images.

## Next Step
- If you approve, I will implement API endpoints, Prisma models/migrations, and admin UI pages, then wire Messenger integration and deliver tested screens end-to-end. 