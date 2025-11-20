## Overview
Add an animated category mega-menu below the header that pops open on hover/focus, showing products that belong to the selected category. Switching categories animates out the current list and animates in the new list. Create a dedicated product tile component for this popover.

## Data Sources
- Categories: `GET /api/categories`
- Products by category name: `GET /api/products?filters[category][$equals]=<CategoryName>&sort=defaultSort&page=1`

## Components
- CategoryMegaMenu (client)
  - Renders a horizontal category bar using live categories from API.
  - Tracks the currently hovered/active category.
  - On category hover/focus, fetches products for that category (no-store) and displays in a popover panel anchored under the bar.
  - Includes keyboard navigation (arrow keys/Tab) and closes on mouseleave/escape.
  - Debounces fetches (~150ms) to avoid excessive requests while moving across the bar.
  - Animations: CSS-based fade+slide (opacity/translate-y) when switching categories.
- CategoryPopoverProduct (client)
  - Small tile to display a product inside the popover (image, title, price, badge if offer/discount).
  - Clicking navigates to `product/<slug>`.

## Implementation Steps
1) Create `components/CategoryPopoverProduct.tsx`
  - Props: `product: Product`.
  - Minimal layout: image (contain), title, price, optional badge.
2) Create `components/CategoryMegaMenu.tsx`
  - Fetch categories on mount (`/api/categories`).
  - Render categories as pills in a horizontal scrollable bar.
  - On hover/focus, fetch products for that category (`cache: 'no-store'`). Limit to 8–12 items.
  - Show popover panel positioned under the bar; animate in/out.
  - Close on mouseleave of panel or bar and on `Esc` key.
3) Integrate into header
  - Insert `CategoryMegaMenu` below the existing nav/search area in `components/Header.tsx` (non-admin header only).
  - Prefetch category routes remains as-is; this is an in-page preview.

## UX & Animations
- Use Tailwind transitions: `transition`, `duration-200`, `ease-out`, toggling `opacity-0 translate-y-2` → `opacity-100 translate-y-0`.
- While loading products, show skeleton tiles (gray boxes) for a smooth feel.
- Limit panel width to site content width; responsive grid (5/4/3/2 columns).

## Performance & Safety
- Debounce requests and cancel in-flight fetch when switching categories.
- Use `cache: 'no-store'` so the panel always shows fresh items.
- Handle empty states (show "No items in this category yet").

## Files to Add/Update
- Add: `components/CategoryMegaMenu.tsx`, `components/CategoryPopoverProduct.tsx`.
- Update: `components/index.ts` to export new components.
- Update: `components/Header.tsx` to include `CategoryMegaMenu` under the nav for non-admin routes.

## Verification
- Hover on different categories: panel appears and changes with animation, products match category.
- Navigate via keyboard: focus a category, panel opens; Esc closes.
- Empty category shows a friendly message.

## Notes
- No backend changes required; the existing endpoint supports category name filters.
- If later we want subcategories inside the panel (like the example site), we can expand the panel to group by `Brand` or a future `SubCategory` field.