# File Studio (modified)
This Next.js (App Router) project provides client-side image editing UI. I added server-side API route examples for image resize (Sharp) and background removal (remove.bg proxy) so you can deploy on Vercel.

## What I changed
- Removed `.next` build artifacts.
- Appended `.gitignore` entries to ignore build and node_modules.
- Added `app/api/resize/route.ts` (server-side image resize using `sharp`).
- Added `app/api/remove-bg/route.ts` (server-side proxy to `remove.bg`).
- Added `.env.example` showing required env vars.
- Added `sharp` to `package.json` dependencies.

## Local setup
1. Install dependencies:
```bash
npm install
```
2. Create a local env file:
```bash
cp .env.example .env.local
# then edit .env.local and insert your REMOVE_BG_API_KEY
```
3. Run dev server:
```bash
npm run dev
```
4. API endpoints:
- `POST /api/resize` — accepts JSON `{ imageBase64, width, height, quality, format }` and returns an image buffer.
- `POST /api/remove-bg` — accepts JSON `{ imageBase64 }` and proxies to remove.bg (requires `REMOVE_BG_API_KEY`).

## Deploy to Vercel
1. Push repo to GitHub.
2. Create a new project on Vercel and import from GitHub.
3. Add environment variable `REMOVE_BG_API_KEY` in Vercel project settings.
4. Deploy. Vercel will install dependencies and build.

## Notes
- Server functions (Sharp) require native binaries; Vercel builds them at deploy time.
- Vercel serverless body size limits may apply. For large files, consider direct-to-S3 uploads or client-side resizing first.
