# SolarHome Energy Backup

Solar and backup equipment storefront with a supplied local product catalog, product galleries, category pages, search, scroll-to-load catalog browsing, cart, and invoice-request flow.

## Vercel-ready setup

The site is configured as a static Vercel build with a Vercel Function at `/api/order-request`. Product images are local files under `public/catalog`, so they do not depend on a retailer site at runtime.

Before deployment, set these Vercel environment variables:

- `NEXT_PUBLIC_SITE_URL` — the final public domain, including `https://`.
- `ORDER_REQUEST_WEBHOOK_URL` — the secure destination for submitted invoice requests.

The invoice form deliberately returns a clear unavailable message until the secure order destination is set. Do not publish until the business support email, phone/WhatsApp number, return address, and privacy contact are added to the support and legal pages.
