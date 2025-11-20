## Data Model
- Add `Popup` model in `server/prisma/schema.prisma`:
  - `id`, `name`, `imageUrl`, `enabled` (default true), `isActive` (default false), `createdAt`, `updatedAt`.
- Extend `SiteSettings` with `showPopupEnabled Boolean @default(true)` for global on/off toggle (matches “Show Popup” switch).
- Generate Prisma client after schema update.

## API Endpoints (Express)
- New router `server/routes/popups.js` and controller `server/controllers/popups.js`.
- Endpoints:
  - `GET /api/popups` → list all.
  - `POST /api/popups` → create `{ name, imageUrl | base64, enabled }`.
  - `PUT /api/popups/:id` → update any field.
  - `DELETE /api/popups/:id` → delete.
  - `PUT /api/popups/:id/activate` → set active; atomically `updateMany` to clear others then set one `isActive=true`.
  - `GET /api/popups/active` → return active popup only if `enabled && SiteSettings.showPopupEnabled`.
- Register router in `server/app.js` under `/api/popups`.

## Image Handling
- Accept `imageUrl` as base64 string (consistent with product create flow) to avoid multipart upload changes to `apiClient`.
- Optional: support file upload via `express-fileupload` writing to `public/popups/` and saving returned path; keep endpoint JSON-compatible by allowing either `imageUrl` or uploaded file.

## Admin UI
- Add sidebar item in `components/DashboardSidebar.tsx`: `Pop-up Message` → `/admin/popups`.
- Create `app/(dashboard)/admin/popups/page.tsx`:
  - Left panel: form "Create Pop Up Message" with Image file picker (converts to base64) and Name input; `Create` button.
  - Right panel: table "Message Images" with columns SN, Image, Name, Status, Actions.
  - Status badges: `Active Popup` vs `Enabled`/`Disabled`.
  - Actions: `Set Active`, `Enable/Disable`, `Preview`, `Delete`.
  - Global toggle in header: `Show Popup` switch bound to `SiteSettings.showPopupEnabled` (reads via `/api/settings`, updates via `PUT /api/settings`).

## Frontend Popup Behavior
- Create `components/FirstVisitPopup.tsx` styled to match provided design: header with title and close, image centered, footer button `Got it!`.
- On initial page load (in `app/layout.tsx` or `Providers.tsx`):
  - Fetch `GET /api/popups/active`.
  - If exists and user has not dismissed current popup id, render `FirstVisitPopup`.
  - Dismiss sets localStorage key `popup.dismissed.<id>` and closes overlay.
- Ensure popup only appears once per active id; when admin activates a new popup, its id is different so it shows again for first-time visitors.

## Public Site Integration
- Import and mount `FirstVisitPopup` high in the app shell so it overlays all pages.
- No dependency on external modal libraries; implement with a fixed overlay and portal for robustness.

## Backend Guards & Validation
- Validate body fields; enforce max image size for base64 (e.g., 2–3MB) to prevent oversized payloads.
- Before delete, if record is `isActive=true`, allow delete but also clear active (next `GET /active` will return null).
- Ensure only one popup can be active via controller logic.

## Verification
- Seed one popup, set active, enable global toggle; confirm `GET /api/popups/active` returns item.
- Visit site in a fresh browser/private window; verify popup shows once and is dismissed after clicking `Got it!`.
- Toggle `Show Popup` off; verify no popup renders.
- Admin: create/delete/update and set active flows; preview action shows modal locally.

## Files to Update/Create
- Update: `server/prisma/schema.prisma`, `server/app.js`, `components/DashboardSidebar.tsx`.
- Create: `server/controllers/popups.js`, `server/routes/popups.js`, `components/FirstVisitPopup.tsx`, `app/(dashboard)/admin/popups/page.tsx`.

## Rollout Notes
- After schema change: run `npx prisma generate` and ensure server rebuild.
- If using file uploads to `public/popups/`, add directory and ensure static serving by Next.js.

If you confirm this plan, I’ll implement the backend and frontend, wire up the admin page, and verify end-to-end behavior.