## Summary
- Navigation and image loading are slow due to heavy client-side rendering, large third‑party slider libraries, disabled image optimization, and lack of caching on key routes.
- The backend creates multiple Prisma clients across controllers, adding latency under load.
- We will measure, then implement focused frontend and backend optimizations without changing the product experience.

## POC Findings (Evidence)
- Client‑heavy homepage composition:
  - `app/page.tsx:16` renders `ScrollReveal`, `Hero`, `BrandsCarousel` — all client components.
  - `components/Hero.tsx:11` uses `react-slick` and client fetches; `next/image` with `unoptimized` at `components/Hero.tsx:85`.
  - `components/BrandsCarousel.tsx:1` client component, uses `react-slick` and client fetches in `useEffect` (`components/BrandsCarousel.tsx:42–72`).
  - `components/SimpleSlider.tsx:11–16` client with `react-slick`; uses `<img>` tags (`components/SimpleSlider.tsx:45,62`).
- Caching disabled on shop:
  - `app/shop/[[...slug]]/page.tsx:1–2` sets `dynamic = "force-dynamic"` and `revalidate = 0`.
- Global client providers on every page:
  - `Providers.tsx:1` wraps all pages with `react-hot-toast` Toaster and popup.
  - `app/layout.tsx:31–41` renders client header, footer, session handling.
- Image optimization gaps:
  - `<img>` used instead of `next/image` in `components/SimpleSlider.tsx` and `app/(dashboard)/admin/settings/page.tsx`.
  - `next/image` `unoptimized` flags in `components/Hero.tsx:85` and header flag GIF at `components/Header.tsx:150`.
- Backend Prisma usage (connection overhead):
  - Multiple controllers instantiate `new PrismaClient()` (e.g., `server/controllers/productImages.js:1–2`, `server/controllers/search.js:1–2`) instead of singleton `server/utills/db.js`.

## Measurement Plan
- Add bundle analysis to identify largest client JS:
  - Enable `@next/bundle-analyzer` and record JS sizes per route.
- Capture Web Vitals and Lighthouse locally to baseline FCP/LCP/TTI.
- Profile API latency and throughput:
  - Log response times for `/api/products`, `/api/search`, `/api/images/*`.
- Verify DB connection count and query timings:
  - Ensure controllers use singleton Prisma; measure query duration for product listing and search.

## Frontend Optimization Plan
- Reduce client JS and hydration:
  - Convert purely presentational components to server components (remove `"use client"` where no interactivity is needed). Targets: `Heading`, `SectionTitle`, static sections within `Hero` and homepage.
  - Keep small interactive islands as client components only where needed.
- Replace heavy sliders:
  - Remove `react-slick` from homepage hero and brand carousel; replace with a lightweight CSS slider or `embla-carousel` with code‑splitting and intersection‑based lazy init.
  - If we keep a slider, load it with dynamic import on interaction/viewport.
- Fix image optimization:
  - Replace `<img>` with `next/image` in `components/SimpleSlider.tsx` and admin pages.
  - Remove `unoptimized` flags; add `remotePatterns` for slider/brand image domains (e.g., local API `localhost:3001` and production host) in `next.config.mjs`, and set `images.formats` to `['image/avif','image/webp']`.
  - Provide explicit `sizes` for responsive images and constrain `width/height` to reduce payload.
- Reinstate caching on product listing:
  - Remove `force-dynamic` and set `revalidate: 60` on `app/shop/[[...slug]]/page.tsx`; keep query‑based filtering server‑side with cache hints on API (`/api/products`).
- Prefetch tuning:
  - Reduce aggressive `router.prefetch` in `components/Header.tsx:83–101` to key routes only, or rely on Next’s default link prefetching to cut background network contention.
- Defer global client providers:
  - Move `react-hot-toast` Toaster and FirstVisitPopup behind dynamic import or conditional render only where needed.

## Backend Optimization Plan
- Use Prisma singleton everywhere:
  - Replace `new PrismaClient()` in controllers with `require('../utills/db')`. Targets include `server/controllers/productImages.js`, `server/controllers/search.js`, `server/controllers/customer_orders.js`, etc.
- Add short‑term caching headers for common GETs:
  - Mirror the `Cache-Control` used in `server/controllers/products.js:263–265` across `/api/search` and image list endpoints.
- DB indexing (MongoDB):
  - Add indexes on fields used in filters/search: `Product.slug`, `Product.title`, `Product.manufacturer`, `Product.categoryId`, `Product.isOfferItem/isFeatured/isHotDeal`, and text index on `title/description` for `/api/search`.

## Implementation Steps
1) Frontend
- Remove client markers on static sections and refactor hero/brands to server‑render data; dynamic import any interactive slider.
- Convert all homepage `<img>` to `next/image` with proper sizes; remove `unoptimized` where domain allowlisted.
- Update `next.config.mjs` images config: add remote patterns for API/production assets; set modern formats and device sizes.
- Change `app/shop/[[...slug]]/page.tsx` to cached ISR revalidate and keep `Products` with `next: { revalidate: 30 }`.
- Trim header prefetch list.

2) Backend
- Switch controllers to singleton Prisma and add cache headers to `/api/search` and images endpoints.
- Add MongoDB indexes via Prisma schema migration for common query fields.

## Expected Impact
- Homepage JS down by 30–60% (remove `react-slick` + client fetches), faster hydration.
- LCP improves from optimized hero image and caching (~300–800ms).
- Shop listing navigations become snappy with ISR and API cache headers.
- Lower backend latency under concurrent load via pooled Prisma.

## Acceptance Criteria
- Lighthouse: LCP < 2.5s, TTI < 3.0s on homepage.
- Bundle analyzer shows reduced client JS on `/` and `/shop`.
- API p95 latency for `/api/products` and `/api/search` < 150ms locally.
- No UX regressions: sliders and carousels still functional, images render crisp.

## After Approval
- I will implement the changes above, verify locally with Web Vitals and provide a short before/after report with measurable improvements.