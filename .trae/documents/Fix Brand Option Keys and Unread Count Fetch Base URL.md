## Issues
- React warning in Filters: brand options use `key={brand.slug}`, which may be `undefined` and not unique.
- Notifications hook fetch uses `process.env.NEXT_PUBLIC_API_BASE_URL`, which can be undefined; results in “Failed to fetch”.

## Fixes
- Filters options: use a stable key based on brand name plus index (`key={`${brand.name}-${idx}`}`) to ensure uniqueness; value remains `brand.name`.
- Notifications unread count: import `config` from `@/lib/config` and use `config.apiBaseUrl` for the base; guard non-OK responses and encode email.

## Verify
- Reload shop page; console warning disappears.
- Header bell unread count fetch succeeds and no “Failed to fetch” error appears when backend is reachable.