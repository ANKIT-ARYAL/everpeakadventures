# Production Migration TODOs

This file tracks the remaining infrastructure and deployment tasks required before launching the final production environment (if moving away from the temporary Vercel/Supabase setup).

## 1. Docker Build & GitHub Actions (CI/CD)
Currently, the GitHub Actions Docker build (`deploy-ghcr.yml`) fails with an `ECONNREFUSED` error. This is because our Next.js app is highly optimized (using SSG/ISR) and attempts to fetch data (like the Navbar/Footer) during the build process, but the `Dockerfile` uses a dummy database URL (`localhost:5432/dummy`).
**Action Items:**
- [ ] Add the real production `DATABASE_URL` to GitHub Repository Secrets.
- [ ] Update `.github/workflows/deploy-ghcr.yml` to pass the `DATABASE_URL` secret as a `--build-arg`.
- [ ] Update `Dockerfile` to accept the `ARG DATABASE_URL` so Next.js can connect to the real database during static generation.

## 2. Image Hosting & Storage Bucket Migration
Currently, the application is loading images directly from the old WordPress server (`everpeakadventures.com/wp-content/uploads/...`). If the old server goes offline, images will break for all new users (only visible via mobile browser cache).
**Action Items:**
- [ ] Create a storage bucket in the real production database environment (e.g., Supabase Storage, AWS S3, or Cloudflare R2).
- [ ] Download all original image assets from the old WordPress host.
- [ ] Upload all images to the new production storage bucket.
- [ ] Write and run a Prisma script to update all database records (Tours, Treks, Settings, etc.), replacing `https://everpeakadventures.com/wp-content/...` with the new bucket's public URL format.

## 3. Database Connection Limits
If using Supabase or a Postgres database with strict connection limits, Next.js static generation can easily overwhelm the database (e.g., `EMAXCONNSESSION`).
**Action Items:**
- [ ] Ensure the production `DATABASE_URL` uses connection pooling (e.g., port `6543` for Supabase or PgBouncer) to handle Next.js spawning multiple build workers.
