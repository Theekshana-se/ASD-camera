## Overview
Implement and reorder home sections so they appear in this order beneath "INTRODUCING SINGITRONIC":
1) Hot Deals (products flagged `isHotDeal`)
2) Featured Products (products flagged `isFeatured`)
3) Limited-Time Rent Offers (existing `isOfferItem`)
4) Brands Carousel (scrolling list of brands)

## Components to Add
- HotDealsSection
  - Purpose: Show products where `isHotDeal = true`.
  - Fetch: `GET /api/products?filters[isHotDeal][$equals]=true&sort=defaultSort&page=1`.
  - UI: Title "HOT DEALS" using `Heading`, grid of `ProductCard` (4–8 items), graceful empty state.
- FeaturedProductsSection
  - Purpose: Show products where `isFeatured = true`.
  - Fetch: `GET /api/products?filters[isFeatured][$equals]=true&sort=defaultSort&page=1`.
  - UI: Title "FEATURED PRODUCTS", grid of `ProductCard`, empty state.
- BrandsCarousel
  - Purpose: Showcase brands in a horizontal carousel.
  - Fetch: `GET /api/brands` (existing endpoint).
  - UI: `react-slick` slider with brand cards (name + product count, link to `/shop?brand=<name>`), fallback to simple grid for no-js/SSR or on small screens.

## Reorder Home Page
- Update `app/page.tsx` to render sections in this order:
  - `Hero`
  - `CategoryMenu`
  - `IntroducingSection`
  - `HotDealsSection` (new)
  - `FeaturedProductsSection` (new)
  - `OfferItemsSection` (existing for limited-time offers)
  - `BrandsCarousel` (new, replaces grid showcase)
  - Keep any existing footer below all content without changes.

## Implementation Details
- Code style: Match existing patterns (`async` server components, `apiClient.get`, SSR-friendly, `Heading`, `ProductCard`).
- Performance: Use `next: { revalidate: 60–120 }` on fetches for caching; slice to 4–8 items for visual balance.
- Accessibility & UX: Provide empty-state when no items; ensure responsive grids (`grid-cols` adapting as in OfferItemsSection).
- Links: Optionally include a "View All" CTA linking to pre-filtered shop pages for each section.

## Files to Create/Update
- Add: `components/HotDealsSection.tsx`, `components/FeaturedProductsSection.tsx`, `components/BrandsCarousel.tsx`.
- Update: `app/page.tsx` to reorder/add sections.

## Verification Plan
- Seed or mark products with `isHotDeal` and `isFeatured`; confirm sections render products under each.
- Confirm existing `OfferItemsSection` still renders limited-time offers.
- Confirm brands render in the carousel and links navigate to `/shop?brand=...`.
- Test responsiveness across breakpoints.

## Notes
- No backend changes are required; filters for `isHotDeal` and `isFeatured` already supported by the API.
- If you prefer the existing `BrandsShowcase` grid over a carousel, we can keep it and rename to "Brands Carousel" later; by default we will implement a slider using `react-slick` already in dependencies.