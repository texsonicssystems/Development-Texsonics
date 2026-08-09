

## Option A: SEO Overhaul + Site Improvements

Keep the working Vite/React stack. Fix SEO properly with per-page metadata, sitemap, structured data, and prerendering so Google sees fully-rendered HTML for every route. Then layer in meaningful site improvements.

---

### Part 1 — Per-Page SEO Metadata

**Install:** `react-helmet-async`

**Create:** `src/components/SEO.tsx` — reusable component accepting `title`, `description`, `canonical`, `ogImage`, `keywords`, `jsonLd`. Renders `<title>`, meta description, canonical link, Open Graph, Twitter Card, and optional JSON-LD script tags.

**Wrap App:** Add `<HelmetProvider>` in `src/main.tsx`.

**Add `<SEO>` to every page** with unique copy:
- `/` Home — "Texsonics Systems India | Precision Sheet Metal Fabrication"
- `/services` — "Sheet Metal Fabrication Services | CNC, Laser, Welding"
- `/products` — "Sheet Metal Products | Enclosures, Panels, Junction Boxes"
- `/products/:id` — Dynamic per product (title + description from product data)
- `/about` — "About Texsonics | 20+ Years of Engineering Excellence"
- `/contact` — "Contact Texsonics | Get a Quote for Sheet Metal Fabrication"
- `/downloads` — "Download Brochure | Texsonics Systems India"
- `*` NotFound — noindex

**Strip duplicate static OG/Twitter tags from `index.html`** so Helmet is the single source of truth (keep the base title and JSON-LD Organization schema).

---

### Part 2 — Sitemap, Robots, Structured Data

**Create:** `public/sitemap.xml` — all static routes + every product detail URL with `lastmod`, `changefreq`, `priority`.

**Update:** `public/robots.txt` — add `Sitemap: https://www.texsonics.in/sitemap.xml`.

Wait — note: `index.html` references `texsonics.in` but the published domain in DNS work was `texsonics.net`. I'll use **texsonics.net** consistently (matches Resend domain and Google Workspace). If `.in` is the real production domain, say so and I'll swap.

**Per-page JSON-LD** added via `<SEO jsonLd={...}>`:
- ProductDetail → `Product` schema (name, image, description, brand, offers)
- Services → `Service` schema per offering
- About → keep `Organization` schema
- Contact → `LocalBusiness` schema with address + hours

---

### Part 3 — Prerendering (Crawler-Friendly HTML)

**Install:** `vite-plugin-prerender` (or `react-snap` as fallback).

**Configure `vite.config.ts`** to prerender all known routes at build time → outputs static HTML per route in `dist/`. Crawlers and social scrapers get fully-rendered HTML with the right meta tags; users still get the SPA experience after hydration.

Routes to prerender: `/`, `/services`, `/products`, `/about`, `/contact`, `/downloads`, `/products/control-panels`, `/products/junction-boxes`, …(every product id).

---

### Part 4 — Google Search Console Setup (Manual Steps)

After deploy, you do this once:
1. Go to Google Search Console → add property `texsonics.net`.
2. Verify via DNS TXT record (add to Cloudflare DNS).
3. Submit `https://www.texsonics.net/sitemap.xml`.
4. Use **URL Inspection** → Request indexing for the homepage.
5. Optionally connect GA4 (already installed) to Search Console for unified reporting.

I'll write a short `SEO_SETUP.md` with screenshots-style steps.

---

### Part 5 — Site Improvements

**A. 404 page upgrade** — Make `NotFound.tsx` on-brand: navbar, hero illustration area, suggested links to Services/Products/Contact, search-style CTA. Add `<SEO>` with `noindex`.

**B. Image optimization & accessibility**
- Add explicit `width`/`height` to all `<img>` to prevent CLS.
- Add `loading="lazy"` to below-fold images, `loading="eager"` + `fetchpriority="high"` to hero.
- Audit all images for descriptive `alt` text (currently many are generic).

**C. Performance**
- Code-split heavy routes with `React.lazy()` + `Suspense` (ProductDetail, Downloads, About).
- Preload hero font + hero image in `index.html`.
- Defer GA script slightly so it doesn't block first paint.

**D. Breadcrumbs** on Products, ProductDetail, Services — both visual UI (shadcn `Breadcrumb`) and `BreadcrumbList` JSON-LD for rich snippets in Google.

**E. FAQ section** on Home or Services with 6–8 common questions ("What materials do you work with?", "Minimum order quantity?", "Lead time?", etc.) wrapped in `FAQPage` JSON-LD → eligible for Google FAQ rich results.

**F. Open Graph image** — Confirm `/og-image.jpg` exists in `public/`. If not, I'll generate a branded 1200×630 placeholder noting you should replace it.

**G. Canonical domain redirect** — Add `_redirects` rule to force `texsonics.net` → `www.texsonics.net` (or vice versa) so Google doesn't see duplicate content.

---

### Files Summary

| File | Action |
|---|---|
| `src/components/SEO.tsx` | CREATE |
| `src/main.tsx` | MODIFY (HelmetProvider) |
| `src/pages/Index.tsx`, `Services.tsx`, `Products.tsx`, `ProductDetail.tsx`, `About.tsx`, `Contact.tsx`, `Downloads.tsx`, `NotFound.tsx` | MODIFY (add `<SEO>`) |
| `index.html` | MODIFY (remove duplicate OG/Twitter, defer GA) |
| `public/sitemap.xml` | CREATE |
| `public/robots.txt` | MODIFY (sitemap link) |
| `public/_redirects` | MODIFY (canonical host) |
| `vite.config.ts` | MODIFY (prerender plugin) |
| `package.json` | MODIFY (deps: react-helmet-async, vite-plugin-prerender) |
| `src/pages/NotFound.tsx` | REWRITE (branded 404) |
| `src/components/FAQSection.tsx` | CREATE |
| `src/components/Breadcrumbs.tsx` | CREATE |
| `src/App.tsx` | MODIFY (lazy routes) |
| `SEO_SETUP.md` | CREATE (Search Console guide) |

---

### Two quick confirmations before I build

1. **Domain:** Use `texsonics.net` everywhere (matches Resend + Google Workspace), correct? `index.html` currently says `texsonics.in`.
2. **FAQ content:** I'll draft generic fabrication FAQs you can edit later — OK, or do you want to supply the Q&A?

