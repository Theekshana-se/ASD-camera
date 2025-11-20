## Goal
Update the category bar styling so the whole bar background is red, category names are white, and each item becomes a rounded pill on hover/focus.

## Changes
- Bar container: add `bg-red-600` and appropriate padding to visually match the reference.
- Category items:
  - Default: `text-white`, transparent background.
  - Hover/Focus: `rounded-full` with `bg-red-700` and soft shadow.
  - Active: `rounded-full` with `bg-red-800`, `text-white`, and shadow for emphasis.
- Keep existing popover behavior and transitions intact.

## Files
- Update `components/CategoryMegaMenu.tsx` only; no backend or other component changes.

## Verification
- Hover over categories: pill appears rounded with darker red background.
- Active category shows as rounded with stronger emphasis.
- Text remains white throughout.