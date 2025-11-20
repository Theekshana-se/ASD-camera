## Diagnosis
- OfferItemsSection fetches with `next: { revalidate: 60 }`, which can delay freshness. Admin shows newly added offer products immediately, but the home section may still be serving a cached response within the revalidation window.

## Plan
1) Update OfferItemsSection fetch to bypass caching
- Change fetch options to `{ cache: 'no-store' }` to ensure fresh data is retrieved on every request.
2) Keep slice and rendering intact
- Continue showing up to 4 products as currently implemented.
3) Verify via API
- Confirm `GET /api/products?filters[isOfferItem][$equals]=true` returns the expected items.

## Impact
- Home page Limited-Time Rent Offers will reflect new products instantly and consistently.
- No backend changes required; purely a frontend fetch caching adjustment.

## Rollback
- If needed, switch back to `next: { revalidate: 60 }` for caching with a smaller TTL (e.g., 15s).