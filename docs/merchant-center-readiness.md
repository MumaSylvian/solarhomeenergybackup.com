# Google Merchant Center readiness: solarhomeenergybackup.com

Date: 2026-09-25 · Track: **Shopping** (physical goods). Promotions and agentic checkout not in scope.
Access: local project files (edited and rebuilt); nothing deployed.
Policy basis: Merchant Center Misrepresentation (answer 17234184), Shopping ads policies, Product data specification, as bundled in the readiness skill (retrieved 17–23 Sep 2026).

```
MERCHANT CENTER READINESS: NOT READY

Tier 0-A (egregious — permanent ban):  7 found, 2 fixed, 5 outstanding (candidates needing merchant confirmation)
Tier 0-B (suspension, 7-day warning):  3 found, 2 fixed, 1 outstanding
Tier 1  (item disapproval):            4 found, 1 fixed, 3 outstanding
Tier 2  (guideline breach):            3 found, 0 fixed, 3 outstanding
Tier 3  (optimisation):                4 found

Sampled: 10 of 812 feed items across all 7 feed categories, plus 1 unconfirmed-stock
         page; all 2,013 built product pages parsed to build the feed
Applied directly: yes, via local project files (not deployed)
Verified after fix: rebuilt; feed price = page price on 10/10 sampled rows; refurbished
         condition correct on 3/3 refurbished samples; unconfirmed-stock page makes no
         in-stock claim in page or schema; shipping page now matches checkout

SUBMIT? NO. Five Tier 0-A candidates are open. Under this policy Google suspends on
detection, without warning, and bars the business from listing again.
```

## Tier 0-A: egregious (candidates requiring merchant confirmation)

These are what the site publishes, matched to the clause they fall under. Intent cannot be verified from the site; the merchant must resolve each one.

| # | Finding (evidence) | Clause | Status |
|---|---|---|---|
| 1 | **No business identity published.** No street address, email, or legal entity anywhere; only a WhatsApp number. The Privacy page states a "business mailing address must be published before public launch"; Terms say "the business entity and governing jurisdiction are [not yet] finalized." | Present a false identity… / hiding material details about actual business location or operational headquarters | **Outstanding.** Publish the real legal name, operating address, and email on Support, footer, and Organization schema; use the same details in Merchant Center. Do not use a virtual office. |
| 2 | **Fulfilment source not disclosed.** Catalog data shows every product is sourced from a supplier (1,201 of 2,115 from The Home Depot, the rest from EcoFlow, Anker SOLIX, BLUETTI, Signature Solar, Current Connected). The site never says where orders ship from or that they are fulfilled by third parties. | Hiding the source of product fulfilment / false impression of localized delivery | **Outstanding.** State the ship-from location(s) and that orders are fulfilled through suppliers, on Shipping & Delivery and product pages. |
| 3 | **Reference ("was") prices are another seller's price.** Every price is 10–25% below the supplier's own price; that supplier price is shown struck through with "Save X%". The store never charged that price. | Pricing practices creating a false or misleading impression of cost | **Outstanding.** Remove the strikethrough and "Save %" unless the struck price is one this store genuinely charged. |
| 4 | **Commercial pattern Google names explicitly.** Name-brand goods priced below the supplier's own price, payment only by Zelle, bank transfer, or Bitcoin, no address, WhatsApp-only contact. This matches the policy example "pretending to be a discount online retail store to entice purchases then not delivering." | Unacceptable business practices | **Outstanding.** Google also uses third-party sources to assess this. Be able to show how goods are bought below supplier price and delivered. If that can't be shown, do not apply to Merchant Center. |
| 5 | **Return fees disclosed only after purchase.** Returns page: "Any applicable restocking or return-shipping charge will be disclosed in the authorization before you send the item." | Failing to disclose restocking fees before checkout; return shipping cost | **Outstanding.** State the restocking fee (or "no restocking fee") and who pays return shipping, on the Returns page. |
| 6 | **Shipping cost contradicted checkout.** The Shipping page said "below $1,000, shipping is 20%… $1,000 or more free"; the site banner and checkout charge 10% below $2,000, free from $2,000. | Not disclosing all applicable shipping costs | **Fixed.** Page, checkout, and cart now read one source (`lib/commerce.ts`). **Confirm 10% below $2,000, free from $2,000 is the intended term.** |
| 7 | **Delivery claim without its start point.** Product pages showed "Priority 2–3 business days"; the estimate only starts after order confirmation and payment verification, which was stated on a secondary page. | Claiming a delivery time conspicuously while hiding handling delays | **Fixed** (product page now says "starting after order confirmation and payment"). Supplier lead time is still unknown; see #2. |

Also confirm, lower confidence: **image and brand rights.** The 1,201 Home Depot listings display images hotlinked from Home Depot's CDN (`images.thdstatic.com`); other listings use manufacturer photography. Confirm resale and image rights and that nothing implies an authorised-dealer relationship that doesn't exist.

## Tier 0-B: suspension with 7-day warning

| # | Finding | Status |
|---|---|---|
| 1 | **Availability.** Every listing showed "In stock"; the Shipping page said "Every product listing is shown as in stock." 1,201 products have *unknown* supplier availability; 914 were in stock at the supplier on 12 Sep 2026. | **Fixed.** `lib/catalog/offer.ts`: "In stock at supplier" only where supplier data says in stock; others show "Availability confirmed at order review". Schema omits availability when not confirmed; the feed excludes those items. |
| 2 | **Condition.** 64 refurbished products carried `NewCondition` in Product schema. | **Fixed.** Condition derived from product data on page schema and feed (feed: 769 new, 38 refurbished, 5 used). |
| 3 | **No working checkout.** The invoice form returns 503 until `ORDER_REQUEST_WEBHOOK_URL` is set. | **Outstanding.** Set the webhook (or add a real checkout) and test an order end to end. |

## Tier 1: item disapproval

| # | Finding | Status |
|---|---|---|
| 1 | No product feed. | **Fixed.** `scripts/generate-merchant-feed.mjs` runs after each build and writes `dist/client/feeds/google-merchant-products.tsv` (812 items) from the built pages, so feed and landing page match by construction. Not registered anywhere. |
| 2 | No GTINs. EcoFlow, Anker, BLUETTI and other manufacturers assign GTINs; the catalog has none. Items send brand + mpn. | **Outstanding.** Get real GTINs from supplier data. Never invent them. |
| 3 | Shipping and return policy not configured in Merchant Center. | **Outstanding.** Configure in account settings: 10% of order total below $2,000, free at $2,000+; returns within 30 days of delivery, plus the fee terms from 0-A #5. |
| 4 | Images. 748 of 812 feed images measured ≥500×500 px; 64 are Git LFS pointers locally and could not be measured. | **Verify on the live site** before submission. |

## Tier 2: guideline breach

1. **No conventional payment method.** Zelle, bank transfer, Bitcoin; Apple Pay not active; no card or pay-on-delivery.
2. **Contact information** is a WhatsApp number only; add an email and address (see 0-A #1).
3. **Internal drafting notes in public policies.** Terms: "should be reviewed by a qualified lawyer before public launch"; Privacy: "must be published before public launch." Replace them with the final details.

## Tier 3: optimisation

- No `google_product_category`.
- Some category assignments are off (a portable air conditioner under Portable power; a WAVE cooler bundle under Solar panels).
- No `shippingDetails` / `hasMerchantReturnPolicy` in Product schema (add once 0-A #5 is settled).
- No `sale_price` attributes (only relevant if genuine sales are run).

## Order of work

1. Resolve 0-A #1–#5 and 0-B #3. Nothing else matters until these close.
2. Configure Merchant Center shipping and returns; add GTINs.
3. Deploy, re-run this audit against the live URL (images, HTTPS form post, live feed), then register the feed.

Policy interpretation here is not legal advice; consumer-law, tax, and licensing questions are for the merchant's own review.
