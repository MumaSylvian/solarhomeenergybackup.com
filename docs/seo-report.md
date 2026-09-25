# SEO / AEO / GEO report: solarhomeenergybackup.com

Date: 2026-09-25 · Stack: vinext (Next.js App Router), static export, Vercel

## Fixed in code

| Severity | Issue | Fix |
|---|---|---|
| Critical | 15 of 19 pages had no metadata and inherited the homepage title, description, and `canonical: /`, marking them as homepage duplicates | `lib/seo.ts` `pageMetadata()` on every page; client routes get a route `layout.tsx`; root canonical removed |
| Critical | Product pages rendered client-side at `/product?slug=` (fixed earlier) | 2,013 static `/products/<slug>` pages with Product + BreadcrumbList schema |
| High | No Organization entity | `OnlineStore` schema with support phone and hours, linked to `WebSite` by `@id` |
| High | No share image | `public/og-default.jpg` (1200×630, 108 KB) as the default OG/Twitter image |
| High | robots.txt had no explicit AI-crawler rules; two competing robots/sitemap sources | Single `public/robots.txt` naming Google, Bing, OpenAI, Anthropic, Perplexity, Google-Extended, Applebot-Extended, and CCBot; `app/robots.ts` and `app/sitemap.ts` removed |
| Medium | Checkout, invoice, and admin were indexable | `noindex, follow`; admin also disallowed |
| Medium | No `llms.txt` | Generated after each build from the built pages |
| Medium | No informational content | 5 guides under `/blog` (below) |

Schema validated with `schema_validator.py`: OnlineStore, WebSite, BlogPosting, FAQPage, Product, BreadcrumbList all pass. Product "missing aggregateRating/review" warnings are intentional: there are no genuine reviews to mark up.

## Blog (hub and spoke)

Hub: `/blog`. Each guide links to its shop categories, and each category page links back to its guides.

| Guide | Supports |
|---|---|
| How to size a battery backup system for your home | Whole-home backup, Batteries, Portable power |
| Portable power station vs. gas generator for home backup | Portable power, Whole-home backup |
| How long will a portable power station run a refrigerator? | Portable power |
| How to charge a portable power station with solar panels | Solar panels, Portable power |
| LiFePO4 vs. NMC batteries for backup power | Batteries |

Every guide opens with a 40–60 word answer block (marked `speakable`), uses question-style H2s, a comparison table, three FAQs (FAQPage schema), a visible updated date, and named sources: CPSC portable-generator safety alert, DOE Energy Saver, FTC EnergyGuide, NREL PVWatts. AI-writing audit: all five score 0/100 (no AI vocabulary, formula phrases, em dashes, or Title Case headings).

Topics were chosen from common buyer questions, not keyword-volume data (the Semrush account had no API units).

Note: Google shows FAQ rich results only for government and health sites, so the FAQ schema here helps Bing and AI answer engines rather than Google's result layout.

## 🔄 User action required

1. **Deploy**: merge the branch and push so Vercel builds it.
2. **Google Search Console and Bing Webmaster Tools**: verify the domain and submit `https://www.solarhomeenergybackup.com/sitemap.xml`.
3. **Cloudflare or other WAF**: if the domain is proxied, confirm AI bots are not blocked at the firewall (robots.txt cannot override a WAF block).
4. **AI training trade-off**: robots.txt allows AI crawlers, which makes the site citable in ChatGPT, Claude, Perplexity, and Gemini and also permits training use. Remove `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, and `CCBot` if you want citations without training.
5. **Review remaining catalog specs**: the importers dropped the thousands digit from comma numbers ("1,800W" → 800 W) and took the first figure in each description. `lib/catalog/spec-fix.ts` now uses the watts/watt-hours stated in product names (72 products corrected, e.g. BLUETTI AC180 → 1,800 W / 1,152 Wh, Anker SOLIX F3800 → 6,000 W / 3,840 Wh) and removes truncated values the name cannot confirm (about 30 products, e.g. Anker SOLIX F3800 Plus, F3000, BLUETTI Apex 300 bundles). Both import scripts are fixed for future imports. Values that were never comma-truncated but still describe the wrong figure (for example, EcoFlow DELTA 2 Max showing 6 kWh, its expandable maximum) need correcting from the supplier data or manufacturer spec sheets.
6. **Named author**: add a real person with relevant credentials (installer, electrician, energy advisor) as the guides' author or reviewer. This is the strongest E-E-A-T signal still missing.
7. **Business details**: publish a business address and email; the terms page still says it needs legal review before launch.

## Timeline

Technical fixes show in Search Console within 1–4 weeks of deploy. Guides typically take 3–6 months to rank; competitive product terms take 6–12 months. Test AI citations monthly by asking ChatGPT, Perplexity, Claude, and Gemini the guide questions and recording whether the site is cited.
