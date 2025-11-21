## Backend: Slider Upload Endpoint
- Add `POST /api/slider/upload` that accepts an image file (`FormData` field `file` or `files`) using existing `express-fileupload`.
- Validate MIME (`image/jpeg`, `image/png`, `image/webp`) and size ≤ 5MB; sanitize filename.
- Save file to `public/slider/` and return `{ url: "/slider/<filename>" }`.
- Implement in `server/controllers/slider.js` (new `uploadSliderImage`) and wire in `server/routes/slider.js`.

## Admin UI: Images Slider Page
- Update `app/(dashboard)/admin/images-slider/page.tsx` to:
  - Add file input; on selection, upload to `/api/slider/upload`, get `url` and set `form.imageUrl`.
  - Keep fields for title, subtitle, CTA text/href, order, active.
  - Persist via existing `POST /api/slider`.
  - List items with preview image and quick enable/disable/delete.

## Frontend: Hero Component Behavior
- Modify `components/Hero.tsx` to:
  - Track the current slide index via `react-slick` `afterChange`.
  - Render overlay title/subtitle/CTA from the current `sliderItems[index]`.
  - Continue to fetch `GET /api/slider?active=true` and fallback to SiteSettings when no items.

## Security & Consistency
- Reuse existing file safety patterns (MIME checks, size limit, sanitized filenames).
- Store only URL references in DB (`SliderItem.imageUrl`), with files saved under `public/slider/` for efficient delivery.

## Verification
- Upload flow: in Admin → Images Slider, select image file → upload succeeds, preview shows URL.
- Create item: set metadata, click Create → new item appears and is active.
- Home hero: cycle slides; overlay title/subtitle/CTA change with each image.
- API tests:
  - `curl -F file=@./your.jpg http://localhost:3001/api/slider/upload` → `{ url: "/slider/..." }`
  - `GET /api/slider?active=true` includes uploaded item.
- Size/type rejection: upload `.txt` or >5MB image → returns 400.

## Notes
- No changes to Prisma schema are needed; we store `imageUrl` and textual metadata per slide.
- CTA `href` remains validated as HTTPS in controller.