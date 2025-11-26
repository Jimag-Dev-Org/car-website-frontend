
# car-website-frontend (Jimag Autos Marketplace)

Next.js (App Router) frontend for Jimag Autos Marketplace. Renders public car listings, car detail pages, and a dev-only admin image upload page.

- Stack: **Next.js 14**, **TypeScript**, **React**
- Talks to: `inventory-svc` REST API
- Deployed as a separate service (e.g., to AWS EKS or a managed frontend host)

---

## 1. Responsibilities

- Public UI for browsing cars (filters, sorting, pagination).
- Car detail page with images and metadata.
- Dev/admin image upload UI for attaching photos to cars.
- Client-side integration with:
  - `inventory-svc` (`/api/cars`, `/api/cars/:id`, etc.)
  - S3 image URLs (via `NEXT_PUBLIC_IMAGE_BASE_URL`).

---

## 2. Routes

App Router structure (high-level):

- `/`
  - Home page with:
    - Filters (make, model, price, mileage, etc.)
    - Pagination
  - Uses `GET /api/cars` from `inventory-svc`.

- `/cars/[id]`
  - Car detail page.
  - Uses `GET /api/cars/:id` and `GET /api/cars/:id/images`.

- `/admin/cars/[id]/images` (dev-only)
  - Admin/dev tool for uploading images for a given car.
  - Flow:
    1. Call `POST /api/uploads/presign` to get a presigned S3 URL.
    2. Upload file directly to S3.
    3. Call `POST /api/cars/:id/images` to register image metadata.

---

## 3. Configuration & Environment Variables

### 3.1. `.env.local` / `.env.example`

Next.js uses environment variables (with `NEXT_PUBLIC_` prefix for values that are exposed to the browser).

This repo should contain a **`.env.example`** file with placeholders:

```env
# Base URL where the backend API is reachable
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Base URL for images (LocalStack S3 in dev; S3/CloudFront in prod)
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:4566/jimag-autos-images
