## Changes
- Update `server/routes/productImages.js` to import `deleteImageById` from the controllers.
- No further code changes required since the controller already exports `deleteImageById`.

## Verify
- Restart the server and ensure it starts without the ReferenceError.
- Hit `DELETE /api/product-images/image/:imageId` and confirm a 204 response on valid image IDs.