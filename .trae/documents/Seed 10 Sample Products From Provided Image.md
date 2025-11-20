## Goal
Create 10 sample products via the admin create API using the provided camera image, with appropriate details, and divide them across sections: Hot Deals, Featured Products, and Limited-Time Rent Offers.

## Approach
- Use the backend API running at `http://localhost:3001`.
- Reuse the provided image as a base64 data URL for `mainImage` and `coverPhoto`.
- Fetch first available `merchantId` and `categoryId` from the API to associate products.
- Generate unique `slug` and `title` per product; set sensible `price`, `deposit`, `description`, `features`, `manufacturer` (Panasonic), and `rating`.
- Assign flags per product:
  - 4 products → `isHotDeal: true`
  - 3 products → `isFeatured: true`
  - 3 products → `isOfferItem: true`
- Ensure each product has only one flag so sections are balanced and non-overlapping.

## Steps
1) Prepare PowerShell script:
- Read merchants and categories; store their IDs.
- Define `$imgBase64` from the provided image (data URL string).
- Build an array of 10 payloads with unique `slug` and one section flag each.
- POST each payload to `/api/products` and collect results.
2) Verify counts:
- `GET /api/products?filters[isHotDeal][$equals]=true` should return 4 new items.
- `GET /api/products?filters[isFeatured][$equals]=true` should return 3 new items.
- `GET /api/products?filters[isOfferItem][$equals]=true` should return 3 new items.

## Notes
- If brand "Panasonic" exists, include `brandId`; else omit it.
- All products use `availabilityStatus: 'AVAILABLE'` and `inStock: 1`.
- If the image needs a different encoding, I will convert it to base64 on-the-fly in the script.

## Deliverables
- 10 created products with balanced flags across the three sections
- Verification output showing counts per section