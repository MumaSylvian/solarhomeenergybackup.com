# SolarHome Energy Backup SEO audit

Audit date: October 2, 2026  
Audited host: `https://www.solarhomeenergybackup.com/`  
Business type: E-commerce store for solar, battery, backup-power, EV, and appliance products

## Executive summary

**SEO health score: 76/100 (good foundation, several important fixes remain).**

The public `www` site is crawlable, server-rendered, HTTPS-enabled, and has a valid sitemap with 2,108 URLs, including 1,983 product URLs. Product pages expose Product JSON-LD with offer price, stock, brand, MPN, and shipping information. Robots.txt allows normal search and AI-search crawlers and references the sitemap.

The most important issues are:

1. The apex host `https://solarhomeenergybackup.com/` timed out during the audit while the canonical `www` host worked. Keep one canonical host, but make the apex resolve and 301 redirect reliably.
2. Common security headers (`X-Content-Type-Options`, `Referrer-Policy`, and CSP) were not present in sampled responses.
3. Several commercially important titles are longer than the usual search display range: `/shop` 74 characters, the sampled product 66, and the sampled guide 75.
4. Core Web Vitals could not be verified because the PageSpeed Insights endpoint returned HTTP 429. No CrUX or Search Console API credentials were available in this run.
5. Product schema is present, but sampled pages did not expose BreadcrumbList or FAQ schema; these are opportunities, not indexing blockers.

## Verified strengths

- Sitemap: HTTP 200, 2,108 URLs, 1,983 product URLs, no duplicates, HTTPS-only, below the 50,000-URL limit, and no deprecated `priority` or `changefreq` tags.
- Robots: `/robots.txt` exists, allows crawling, disallows `/admin`, and references `/sitemap.xml`.
- Canonicals: sampled homepage, shop, product, category, blog, and policy pages use self-referencing `www` canonicals.
- Index control: `/checkout` and `/invoice` return `noindex, follow`, and they are excluded from the sitemap.
- Rendering: sampled important pages returned HTTP 200 with server-rendered title, H1, description, canonical, and visible content.
- Images: all sampled image elements had `alt` attributes; product pages expose a primary image and gallery images.
- Structured data: `OnlineStore` organization data is present sitewide; sampled product pages also include `Product` and `Offer` data.
- Content depth: sampled homepage ~799 words, shop ~1,699, product ~1,055, category ~3,277, and guide ~1,416 words.
- AI accessibility: `llms.txt` is live and the robots file allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, and other listed crawlers.

## Category scores

| Category | Score | Assessment |
|---|---:|---|
| Technical SEO | 78 | Strong sitemap, robots, canonicals, HTTPS; apex-host and headers need work. |
| Content quality / E-E-A-T | 78 | Useful commercial and guide content; continue adding first-party expertise and visible authorship. |
| On-page SEO | 74 | Descriptions and H1s are present; several titles need tightening. |
| Schema | 80 | OnlineStore and Product/Offer markup are present; BreadcrumbList is a clear opportunity. |
| Performance | 55 | Not field-verified; PageSpeed request was rate-limited. Catalog size makes performance monitoring important. |
| AI search readiness | 85 | SSR, llms.txt, crawler access, and structured content are good; authority signals need growth. |
| Images | 86 | Sampled alt coverage and product galleries are strong; continue monitoring image weight and external gallery URLs. |

## Data limitations

- The audit sampled key templates and validated the sitemap structure; it did not fetch all 2,108 URLs individually.
- PageSpeed Insights returned HTTP 429, so LCP, INP, and CLS are not reported as measured values.
- No Google Search Console, GA4, CrUX, backlink, or SERP API credentials were used; index coverage, traffic, backlinks, and rankings remain unverified.
- High-concurrency HEAD checks timed out on a small number of product URLs; normal GET retries returned HTTP 200, indicating rate limiting rather than confirmed broken pages.
