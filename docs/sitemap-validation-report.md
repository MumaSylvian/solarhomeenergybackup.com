# Sitemap validation report

Validated October 2, 2026 for `https://www.solarhomeenergybackup.com/`.

## Result

The production sitemap is ready to submit in Google Search Console:

- Sitemap URL: `https://www.solarhomeenergybackup.com/sitemap.xml`
- HTTP response: 200
- URLs: 2,108
- Duplicate URLs: 0
- Non-HTTPS or wrong-host URLs: 0
- Deprecated `<priority>` / `<changefreq>` tags: none
- `robots.txt` reference: present
- URL volume: below Google's 50,000-URL limit

The sitemap contains the site's public pages, category and brand pagination, guides, and product pages. Checkout and invoice routes are intentionally excluded because they are transactional/no-index pages.

## Spot check

Product URLs that initially timed out under a high-concurrency HEAD check returned HTTP 200 when retried with normal GET requests. The timeouts were request-rate related, not sitemap URL failures.

## Search Console submission

1. Open the verified `www.solarhomeenergybackup.com` property in Google Search Console.
2. Select **Sitemaps**.
3. Enter `sitemap.xml` (or the full URL above).
4. Select **Submit**.
5. Recheck the status after Google processes it; “Success” confirms acceptance, while indexing counts may take longer to update.

The sitemap is generated during the production build by `scripts/generate-sitemap.mjs` and copied to both `public/sitemap.xml` and the deployed output.
