# SEO action plan

## Phase 1 — critical / high priority

1. **Repair apex-domain DNS and redirect** — make `solarhomeenergybackup.com` resolve to the same deployment and issue one permanent redirect to `https://www.solarhomeenergybackup.com/`. Verify both HTTP and HTTPS variants.
2. **Add response security headers** — at minimum `X-Content-Type-Options: nosniff`, a suitable `Referrer-Policy`, and a carefully tested Content-Security-Policy. Do not deploy CSP without checking image, analytics, payment, and WhatsApp flows.
3. **Tighten key title tags** — keep the primary phrase and product/category intent near the beginning; reduce long titles on `/shop`, product templates, and guides without removing model or category terms.
4. **Connect Google Search Console** — submit `https://www.solarhomeenergybackup.com/sitemap.xml`, then inspect the homepage, shop, one category, one guide, and representative product URLs.

## Phase 2 — medium priority

1. Add `BreadcrumbList` JSON-LD to category, brand, guide, and product pages.
2. Test Product rich-result eligibility in Rich Results Test for a representative product from each major category.
3. Run Lighthouse/PageSpeed from an external environment after rate limits clear; record mobile LCP, INP, and CLS.
4. Confirm every product gallery image is served from a stable, crawlable URL and remains available without retailer hotlink dependence.
5. Review category and brand pagination for unique titles, canonicals, and useful introductory copy.

## Phase 3 — content and authority

1. Add visible author/editor attribution and update dates to guides where expertise is expected.
2. Expand first-party installation, sizing, delivery, and compatibility guidance with cited manufacturer or government sources.
3. Build internal links from guides to relevant categories and products using descriptive anchors.
4. Establish consistent business entity profiles and legitimate industry mentions; do not manufacture reviews, certifications, or backlinks.

## Phase 4 — monitoring

1. Monitor Search Console sitemap status and indexing exclusions weekly after submission.
2. Recheck the apex redirect, sitemap URL count, canonical host, and representative product status after each deployment.
3. Re-run mobile CWV monthly and after catalog/image changes.
