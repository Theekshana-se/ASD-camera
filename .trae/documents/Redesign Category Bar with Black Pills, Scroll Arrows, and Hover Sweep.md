## Approach
- Replace the current red text links in `CategoryMegaMenu.tsx` with black rounded pill buttons with white text and a small dropdown arrow.
- Populate pills with the required categories in this order: smart-phones, cameras, earbuds, speakers, juicers, headphones, watches, laptops, tea, lighters.
- Show pills in a horizontally scrollable container with white left/right arrow buttons to scroll; display only the first segment but allow viewing the rest via scrolling.
- Add a smooth hover animation: a white overlay sweeps from left to right across the pill.
- Preserve existing popover-on-hover functionality; hovering a pill still sets active category and loads products.

## Implementation Details
- Modify `components/CategoryMegaMenu.tsx`:
  - Use a static `navCats` list (name + href) to control order and labels.
  - Create a scrollable `div` with `overflow-x-hidden` and `ref`; arrow buttons call `scrollBy({ left: ±300, behavior: "smooth" })`.
  - Style pills: `bg-black text-white rounded-full px-5 py-2 flex items-center gap-2`; include a small "▼" icon.
  - Hover sweep: add an absolutely positioned child `span` that transitions its width from 0 to 100% on `.group:hover`.
- Keep `active` category state and product popover behavior as-is.

## Verification
- Visual: Pills appear as black rounded rectangles with white text and dropdown arrows.
- Content: Categories match requested labels; only a subset is visible at once, with arrows scrolling through.
- Hover: White overlay sweeps across on hover.
- Functionality: Hover still opens the popover and loads products for that category when available.