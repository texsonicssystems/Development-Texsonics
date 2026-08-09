# SEO Setup Guide — Texsonics Systems India

This guide covers the manual steps required after deploying the SEO improvements.

## 1. Google Search Console (most important)

1. Go to https://search.google.com/search-console
2. Click **Add property** → choose **Domain** type
3. Enter: `texsonics.net`
4. Google will show a TXT record. Copy it.
5. In **Cloudflare DNS** for texsonics.net, add a TXT record:
   - Type: `TXT`
   - Name: `@`
   - Content: (paste the TXT value Google gave you)
   - Save and wait 5–15 minutes
6. Back in Search Console click **Verify**

## 2. Submit the Sitemap

1. In Search Console, left sidebar → **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**

You should see "Success" within a few hours.

## 3. Request Indexing of Key Pages

For each important page (homepage, products, services):
1. Top search bar in Search Console → paste the URL (e.g. `https://www.texsonics.net/`)
2. Click **Request Indexing**
3. Repeat for `/services`, `/products`, `/about`, `/contact`

Google will typically index within 1–7 days.

## 4. Connect GA4 to Search Console (optional but recommended)

1. In Search Console → **Settings** → **Associations**
2. Associate the GA4 property `G-QPX2WKVZD0`
3. This unifies search and analytics data

## 5. Bing Webmaster Tools

Don't forget Bing (powers DuckDuckGo too):
1. https://www.bing.com/webmasters
2. Add site → import directly from Google Search Console (one click)

## 6. Verify OG Image

Make sure `public/og-image.jpg` exists at exactly **1200×630 pixels** with your branding.
Test: https://www.opengraph.xyz/url/https%3A%2F%2Fwww.texsonics.net

## 7. Realistic Timeline

- Indexing of homepage: 2–7 days after submission
- Indexing of all pages: 2–4 weeks
- Ranking for branded terms ("Texsonics"): 1–2 weeks once indexed
- Ranking for generic terms ("sheet metal fabrication coimbatore"): 3–6 months with consistent content + backlinks

## 8. If Nothing Indexes After 2 Weeks

- Confirm `https://www.texsonics.net/sitemap.xml` returns the XML in browser
- Confirm `https://www.texsonics.net/robots.txt` is accessible
- Use Search Console **URL Inspection** → "View Crawled Page" to see what Googlebot sees
- Check for "Page is not indexed" reasons in the Coverage report
