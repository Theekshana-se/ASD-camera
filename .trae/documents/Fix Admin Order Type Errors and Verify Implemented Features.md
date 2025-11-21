## Fix TypeScript Errors in Admin Order Detail
- Update `app/(dashboard)/admin/orders/[id]/page.tsx` initial `order` state to include missing fields:
  - `rentalDurationDays: number` (default `1`)
  - `fulfillmentMethod: string` (default `"delivery"`)
- Extend local `OrderProduct.product` type to include `deposit: number` so the deposit total calculation compiles.

## Backend/API Verification
- Start backend: `node server/app.js`
- Verify stats endpoints:
  - `curl http://localhost:3001/api/stats/counts`
  - `curl http://localhost:3001/api/stats/trends?days=7`
- Verify slider endpoint:
  - `curl http://localhost:3001/api/slider?active=true`
- Verify search endpoint:
  - `curl "http://localhost:3001/api/search?q=camera&limit=5"`
- Verify brand logos pipeline:
  - Create brand with logo: `curl -X POST http://localhost:3001/api/brands -H "Content-Type: application/json" -d '{"name":"Canon","imageUrl":"https://example.com/logo.png"}'`
  - `curl http://localhost:3001/api/brands` shows `imageUrl` set.
- Upload security checks (should be rejected):
  - Try uploading `.txt` to `/api/payment-methods/upload` and expect 400.
  - Try image >5MB and expect 400.
- New order admin notifications:
  - Enable settings: `PUT /api/settings` with `{ messengerEnabled: true, adminMessengerPsid: "<PSID>" }` (Messenger requires `FACEBOOK_PAGE_TOKEN` env set).
  - Create order: `POST /api/orders` with valid payload; check admin notification via `GET /api/notifications/<adminUserId>`.

## Frontend/UI Verification
- Start Next.js: `npm run dev` (frontend) alongside backend.
- Dashboard:
  - Open `http://localhost:3000/admin`; confirm stat cards show live counts, and ApexCharts line chart renders.
- Hero:
  - Open home page; confirm hero images come from active slider; title/subtitle/CTA reflect slider or fallback settings.
- Brands Carousel:
  - Open home page brands section; confirm brand-specific logos appear; falls back to client logos when missing.
- Settings Widgets:
  - In `Admin → Settings`, toggle WhatsApp; save; confirm floating WhatsApp button appears site-wide.
- Orders:
  - In `Admin → Orders`, open a specific order; confirm fulfillment method and rental/deposit/grand totals display; use “Copy summary” button and paste to verify clipboard contents.

## Success Criteria
- No TypeScript errors in the admin order detail file.
- All endpoints return expected structures and validations work.
- UI shows live data (no hardcoded numbers) for dashboard, hero, brands, and widgets.
- Admin notifications created on new orders, Messenger message sent when configured.