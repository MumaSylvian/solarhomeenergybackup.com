# Google Merchant Center readiness: solarhomeenergybackup.com

## Fix run, 2026-09-26 (owner answers applied)

```
MERCHANT CENTER READINESS: NOT READY

Tier 0-A (egregious — permanent ban):  4 found, 3 fixed, 1 outstanding (candidate needing merchant confirmation)
Tier 0-B (suspension, 7-day warning):  2 found, 2 fixed, 0 outstanding
Tier 1  (item disapproval):            5 found, 2 fixed, 3 outstanding
Tier 2  (guideline breach):            1 found, 0 fixed, 1 outstanding
Tier 3  (optimisation):                4 found, 3 addressed

Sampled: 22 of 1,996 feed items across 11 categories (0 mismatches: price, stock,
         condition, brand, no reference price); images: 748 local + 64 via GitHub
         media measured ≥500 px; 1,201 CDN images are 600×600 (8 downloaded)
Applied directly: yes, local project files (committed locally, not deployed)
SUBMIT? NO. One Tier 0-A candidate and three Tier 1 items remain.
```

Fixed this run, on the owner's answers:
- **Operating-region mismatch:** support hours now Central Time, matching Baton Rouge.
- **Ship-from:** "Orders ship from our warehouse in Baton Rouge, LA" on the Shipping page; "Ships from Baton Rouge, LA" on product pages.
- **Availability:** the owner confirmed every listed product is on hand in the warehouse (`ALL_LISTED_IN_STOCK` in `lib/catalog/warehouse-stock.ts`). All pages, schema, and the feed now show in stock. This is the owner's representation; turn the flag off and list SKUs if it stops being true.
- **Images:** every primary image meets 500×500.
- **Feed:** google_product_category (Google taxonomy 2021-09-21) on all 1,996 items; product_highlight on 768; 158 store categories corrected.

Outstanding:
- **0-A:** below-supplier pricing combined with only irreversible payment rails matches the policy's "discount retailer that does not deliver" example. The merchant must be able to evidence sourcing and fulfilment; nothing on the site can resolve it.
- **Tier 1:** shipping rates Merchant Center can express (delivery is quoted per destination today); return policy entered in Merchant Center; GTINs.
- **Tier 2:** no card or pay-on-delivery option.
- **Tier 3:** a few category assignments remain imperfect (e.g. accessories that inherit a store category).

---

## Re-audit, 2026-09-26 (after policies were published)

```
MERCHANT CENTER READINESS: NOT READY

Tier 0-A (egregious — permanent ban):  4 found, 1 fixed, 3 outstanding (candidates needing merchant confirmation)
Tier 0-B (suspension, 7-day warning):  2 found, 1 fixed, 1 outstanding
Tier 1  (item disapproval):            5 found, 1 fixed, 4 outstanding
Tier 2  (guideline breach):            1 found, 0 fixed, 1 outstanding
Tier 3  (optimisation):                4 found

Sampled: 16 of 795 feed items across 7 categories; all 2,009 product pages scanned
         for reference prices; all 2,035 pages scanned for identity details
Applied directly: yes, local project files (committed locally, not deployed)
Verified after fix: 0 struck prices / "Save %"; 0 false used/refurbished; 0 feed items
         without brand; 16/16 sampled items match feed = page = schema

SUBMIT? NO. Three Tier 0-A candidates remain open.
```

Identity is now consistent sitewide (one address, phone, and email on all 2,035 pages and in schema). The merchant must confirm 218 Springfield Road is the real operating address.

| Tier | Finding | Status |
|---|---|---|
| 0-A | Support hours stated in Pacific Time while the business is in Baton Rouge, LA (Central) | Outstanding: confirm; an operating-region mismatch is a concealed-location signal |
| 0-A | Ship-from location not disclosed anywhere | Outstanding: state the warehouse location on the Shipping page |
| 0-A | Crossed-out supplier price shown as "Save X%" | **Fixed**: `SHOW_REFERENCE_PRICES = false`; savings claims removed |
| 0-A | Below-supplier pricing with only irreversible payment rails (transfers, Zelle, Cash App, Chime, Bitcoin) | Outstanding: merchant must be able to evidence sourcing and fulfilment |
| 0-B | Condition: five new items marked "used" by a description keyword | **Fixed**: title-only detection; copy corrected |
| 0-B | "In stock" comes from supplier data last checked 2026-09-12, while the business says it ships from its own warehouse | Outstanding: supply the warehouse stock list |
| 1 | Missing brand on 21 feed items | **Fixed**: 8 resolved, 13 excluded from the feed |
| 1 | Shipping cost: quoted per destination after ordering, so it cannot be configured as is | Outstanding: define rates Merchant Center can express |
| 1 | Return policy not configured in Merchant Center (the site and schema now carry it) | Outstanding: account setting |
| 1 | No GTINs | Outstanding: get them from supplier data |
| 1 | 64 feed images not measurable locally (Git LFS) | Outstanding: verify on the live site |
| 2 | No conventional payment method (card, debit, or pay on delivery) | Outstanding |
| 3 | No google_product_category; ~347 miscategorised items; no product_highlight; no dimensions or weight | Optimisation |

---

## Update, 2026-09-26: published policies

The owner supplied Privacy, Return & Refund, Shipping & Delivery, Payment & Billing, Warranty, Cookie & Tracking, and Terms documents; they are published verbatim and every other page now reads the same terms (`lib/business.ts`, `lib/commerce.ts`).

| Earlier finding | Status now |
|---|---|
| 0-A #1 No business identity | **Resolved on site.** SolarHome Energy Backup LLC, 218 Springfield Road, Baton Rouge, LA 70807, info@solarhomeenergybackup.com, shown in footer, Support, every policy, and Organization schema. Merchant must confirm this is the real operating address, not a virtual office, and use identical details in Merchant Center. |
| 0-A #5 Return fees after purchase | **Resolved.** No restocking fee; customer pays standard return shipping; store pays for verified damaged/defective/incorrect items; window starts at delivery. Store-level `MerchantReturnPolicy` added to schema. |
| 0-A #6 Shipping contradiction | **Resolved.** The fixed 10%/$2,000 rule is gone everywhere; all pages state destination-based delivery charges disclosed before payment, 1–3 business days processing, ~5–7 business days delivery after dispatch. |
| 0-B #3 No working checkout | **Corrected.** The invoice form does not use the webhook; it opens WhatsApp with the order details. Orders can be placed by any customer with WhatsApp (or by email/phone). |
| Tier 2 Contact information | **Resolved.** Email, phone, and address published. |
| Tier 2 Internal drafting notes | **Resolved.** Final Terms and Privacy replace the drafts. |

Still open:
- **0-A #2 Ship-from location.** The policies do not say where orders ship from. The owner reports holding stock in a warehouse; state its location (or that it ships from Baton Rouge, if true) on the Shipping page.
- **0-A #3 / #4 Reference pricing and the discount-retailer pattern.** Unchanged: "Save X%" compares against the supplier's price, and payment remains transfer, P2P apps, and Bitcoin only.
- **Tier 1 Shipping in Merchant Center.** Delivery is quoted per destination after the order. Merchant Center needs an actual shipping cost (flat, table, or carrier-calculated) per item or account; a quote-later model cannot be submitted as-is. Define rates Merchant Center can express before submitting.
- **Warehouse stock list** to drive per-product "In stock" (see `lib/catalog/warehouse-stock.ts`).

Verdict unchanged: **NOT READY** until 0-A #2–#4 and the Merchant Center shipping setup are settled.

---

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
