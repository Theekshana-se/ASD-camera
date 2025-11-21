## Changes
- Show exactly 6 category pills at a time, centered in the red bar.
- Remove the dropdown arrow inside pills; make left/right navigation arrows smaller and cleaner.
- Hover animation: white overlay sweeps left→right across the pill (with text remaining readable).
- Selection styling: when a pill is active, make the pill fully white with black text.

## Implementation
- Add `startIdx` state to window the category list: `navCats.slice(startIdx, startIdx + 6)`.
- Update arrow handlers to shift `startIdx` within bounds and keep pills centered.
- Update pill classes:
  - Default: `bg-black text-white rounded-full px-5 py-2 overflow-hidden`
  - Active: `bg-white text-black`
  - Hover sweep overlay: an absolutely positioned child `span` whose width animates from 0 → 100% on hover.
- Keep existing hover-to-load popover behavior intact.

## Verify
- Category bar displays 6 centered pills.
- Hover over a pill: subtle white sweep left→right.
- Clicking/hovering a pill sets it active; pill becomes white with black text.
- Left/right arrows move the window of visible pills.