## Goals
- Prevent the shop page from applying stock/price filters on initial load that hide products.
- Ensure the shop content doesn't visually cut into the footer.

## Changes
- Products query logic (`components/Products.tsx`):
  - Do not include `filters[inStock]` when both “In stock” and “Out of stock” are unchecked.
  - Increase default `priceLimit` to a high value (e.g., 999999) so price doesn’t filter out items by default.
- Layout spacing (`app/shop/[[...slug]]/page.tsx`):
  - Add bottom padding (`pb-16`) to the page wrapper to avoid footer overlap on long content.

## Verification
- Load `/shop` with no search params; products should display.
- Toggle filters; only apply when a checkbox or a price/rating is set.
- Scroll to footer; confirm it is fully visible without being cut.