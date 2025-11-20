## Goals
1) Remove left/right white spacers and the gap below the red category bar.
2) Hide header when scrolling down; show it again when scrolling up.

## Changes
- Move the CategoryMegaMenu outside the inner page container so it spans full width and doesn’t inherit `px-16` margins.
- Remove extra padding/rounded corners from the bar container and keep rounded style only on hovered items.
- Add scroll-direction detection in Header to toggle a translateY hide/show animation.

## Files
- Update `components/Header.tsx`:
  - Add scroll logic: track `window.scrollY`, hide on down, show on up.
  - Apply `transition-transform` and `-translate-y-full`/`translate-y-0` on header.
  - Render `CategoryMegaMenu` outside the inner container to eliminate side spacers and the gap.
- Update `components/CategoryMegaMenu.tsx`:
  - Remove bar `rounded-md` and inner horizontal padding; keep white text and rounded hover pills only.

## Verification
- Category bar reaches edges with no extra white left/right.
- No extra white gap under the bar before the hero.
- Scroll down: header slides away; scroll up: header slides back in.