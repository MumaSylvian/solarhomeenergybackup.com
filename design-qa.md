**Comparison target**

- Source visual truth: `C:\Users\Mma\OneDrive\Pictures\Screenshots 1\Screenshot 2026-09-10 123955.png`
- Intended implementation: homepage category grid at `http://localhost:3000/`
- Target viewport: desktop (source capture is 1589 × 644 pixels).
- State: default homepage, category grid visible.

**Findings**

- [P1 — resolved in code] Generic “Solar + storage” hero label adds no product information.
  Source visual truth: `Screenshot 2026-09-10 131317.png`.
  Fix applied: removed all hero eyebrow labels so the image, headline, product message, and actions carry the hierarchy.

- [P1 — resolved in code] The header has no language entry point.
  Source visual truth: `Screenshot 2026-09-10 133054.png`.
  Fix applied: added a persistent globe-triggered language menu for English, French, Spanish, Chinese, Tagalog, and Vietnamese. Selection is interactive and updates the document language preference for the session.

- [P2 — resolved in code] Catalog brand coverage is not surfaced on the homepage.
  Source visual truth: `Screenshot 2026-09-10 133232.png`.
  Fix applied: added a “Recognized brands in our catalog” panel naming Victron Energy, EG4, Pytes, Aptos Solar, and Sol-Ark, which are present in the imported catalog.

- [P1 — resolved in code] Category cards use abstract icons instead of category-relevant equipment imagery and provide no quantity cue.
  Source visual truth: `Screenshot 2026-09-10 133623.png` and layout inspiration from `Screenshot 2026-09-10 135251.png`.
  Fix applied: rebuilt the six cards as image-led catalog entry points and added a per-category in-stock count: Whole-home backup 55, Portable power 17, Batteries 98, Solar panels 24, Home integration 8, Accessories 17.

- [P1 — resolved in code] Category descriptions overlap the fixed-position action row.
  Location: `.category-card` in `app/globals.css`.
  Evidence: the source capture shows the second line of several descriptions running into the “Explore” action.
  Fix applied: removed the fixed card/action positioning, used a content-led flex column, and assigned a normal top margin to the action.

- [P2 — resolved in code] Category card height creates surplus vertical space and weakens the card hierarchy.
  Location: `.category-card` in `app/globals.css`.
  Evidence: each card has a large empty middle region in the source capture.
  Fix applied: removed the desktop minimum height, tightened icon/title spacing, and retained the border grid.

- [P2 — resolved in code] Product and storefront phrasing contains generic template language.
  Location: `components/storefront.tsx`, `app/solar-panels/page.tsx`, and `app/product/page.tsx`.
  Fix applied: replaced broad promotional copy with specific system, availability, and compatibility language; removed “Product image pending”; normalized the legacy `SolarHome Reserve` display label to the current brand.

**Required fidelity surfaces**

- Fonts and typography: preserved the existing SF-style system stack, weights, and hierarchy.
- Spacing and layout rhythm: category actions now follow descriptions naturally without overlap or empty fixed-height space.
- Colors and visual tokens: preserved the blue/white palette, category grid borders, and active-card treatment.
- Image quality and asset fidelity: created `app/icon.png` as a lossless crop of the supplied Solqr logo; no synthetic logo or badge was introduced.
- Copy and content: replaced broad, template-like claims with practical product and system language.

**Verification status**

- Build: passed with `pnpm.cmd run build`.
- Targeted lint: passed with `pnpm.cmd run lint -- components/storefront.tsx`.
- HTTP checks: homepage and `/icon.png` returned HTTP 200 from the local preview; all six catalog category image URLs returned HTTP 200.
- Markup checks: homepage includes the brand panel, image-led category cards, and 55/98 stock-count text; the removed “Solar + storage” label is absent.
- Browser-rendered evidence: passed in Chrome on 2026-09-11. The Power Hub screenshot was captured in the active Chrome session at `http://localhost:3000/shop`; it shows the fixed header, cart icon, full-width catalog, top filter row, and glass contact control. The timed update was also observed in the DOM after its 75-second initial delay.
- Interaction checks: language menu opened with all six choices and changed the document language to French; the Whole-home filter changed the catalog from 219 to 127 matching products; the fixed Back control and cart control remained visible after navigation to `/whole-home-backup`; no browser console errors were present.

**2026-09-11 audit update**

- [P1 — resolved] The original bag-shaped cart control was replaced with a recognizable cart icon and made consistent in the shared header, Power Hub, and empty-cart state.
- [P1 — resolved] Filters were moved from a side rail to a horizontal control row above the catalog, allowing a three-column desktop product grid.
- [P1 — resolved] A fixed shared header now provides Back, logo, navigation, search, language choice, and cart access on every route.
- [P2 — resolved] A low-pressure information toast now appears every 90 seconds after a 75-second initial delay; each message is a factual SolarHome policy or service update, not fabricated buyer activity.
- [P2 — resolved] A transparent glass-style WhatsApp support control is present. It currently routes to Support because a WhatsApp Business number has not been supplied; add that number before enabling a direct `wa.me` link.

**2026-09-11 visual follow-up**

- [P2 — resolved] The business-information toast is anchored at the lower-left (`left: 22px; bottom: 24px`) instead of the top center. It now includes the user-supplied “Authorized business since 2021” notice in the factual service-message rotation.
- [P2 — resolved] The glass-style WhatsApp support control uses green, replacing the prior blue treatment.
- [P2 — resolved] Header and mobile search action buttons now use near-black `#101b2b` instead of blue.

**Implementation checklist**

- [x] Remove category action/description collisions.
- [x] Tighten category-card hierarchy and vertical rhythm.
- [x] Add a brand-logo favicon.
- [x] Remove the identified generic storefront phrases and legacy storefront label.
- [x] Build and endpoint-check the update.
- [x] Validate the shared header, language menu, top filters, toast timing, and catalog page in Chrome.

**Follow-up polish**

- Add the verified WhatsApp Business number to turn the support fallback into direct WhatsApp chat.

**2026-09-11 interface correction pass**

**Comparison target**

- Source visual truth: `C:\Users\Mma\OneDrive\Pictures\Screenshots 1\Screenshot 2026-09-11 075557.png`, `Screenshot 2026-09-11 075613.png`, `Screenshot 2026-09-11 075653.png`, `Screenshot 2026-09-11 075733.png`, and `Screenshot 2026-09-11 075805.png`.
- Implementation: browser-rendered local preview at `http://localhost:3000/`, `/shop`, and `/warranty` in the user-selected Chrome session.
- Viewport: desktop Chrome, 1525 × 667 CSS pixels, device scale factor 1; source and implementation were judged as desktop captures, with no density normalization needed.
- State: French language selection active on homepage and Power Hub; default English policy page; populated product catalog.

**Findings**

- [P1 — resolved] The supplied mark appeared both in the shared header and again inside policy-page content.
  Evidence: source `075557.png` shows the duplicate lockup; the updated warranty-page DOM contains only the shared header image and no main-content logo.
  Fix: removed the policy-page lockup and the footer image mark; the supplied logo remains in the shared header only.

- [P1 — resolved] The header Back control introduced an unnecessary second navigation affordance.
  Evidence: source `075557.png` shows the unwanted arrow before the logo; Chrome capture now begins with the logo as the first header control.
  Fix: removed the shared Back control and its event handler.

- [P1 — resolved] Language selection only changed the picker label, rather than the usable storefront interface.
  Evidence: source `075613.png`; after selecting French in Chrome, the navigation, utility bar, search, Power Hub headline, filters, product actions, availability, delivery, warranty, and price-action labels render in French.
  Fix: added a shared locale provider with real translation dictionaries for English, French, Spanish, Chinese, Tagalog, and Vietnamese. Catalog product names and technical source data intentionally remain in their supplied language.

- [P1 — resolved] Product category labels overlaid catalog imagery.
  Evidence: source `075653.png` and `075733.png`; the current Chrome Power Hub capture shows category metadata below each image and unobstructed product photography.
  Fix: moved category metadata from `.product-art` into `.product-content`.

- [P2 — resolved] Product photography did not receive enough visual priority.
  Evidence: source `075733.png`; the current three-column Power Hub capture uses a 295px desktop image area, with increased containment padding and a compact text area below.
  Fix: raised `.shop-products .product-art` height and preserved full product containment.

- [P2 — resolved] Assurance items behaved like navigation links.
  Evidence: source `075805.png`; the current homepage DOM exposes all three assurance items as static generic content, not links.
  Fix: replaced those links with non-interactive trust-badge elements.

**Required fidelity surfaces**

- Fonts and typography: retains the existing high-contrast system type hierarchy; the new category label uses small uppercase metadata below the image, preventing any product-image collision.
- Spacing and layout rhythm: header now has a single left anchor; cards reserve the larger top portion for imagery and retain consistent 18px radii and vertical spacing.
- Colors and visual tokens: preserves blue/white catalog treatment, green stock states, and the user-requested near-black search action.
- Image quality and asset fidelity: product images are existing catalog assets, displayed with `object-fit: contain`; no logo, badge, or product image was replaced with generated or simulated artwork.
- Copy and content: locale-specific storefront controls and actions are translated; supplied product titles, model names, and technical specifications remain unaltered for accuracy.

**Verification status**

- Focused visual comparison: performed against the supplied header, language-picker, product-card, and trust-badge screenshots and the corresponding Chrome states.
- Interaction checks: selected French through the live menu; confirmed translated header, Power Hub, filters, stock/status, and product actions; confirmed policy page has one visible logo; confirmed no header Back control; confirmed trust badges are not links.
- Build: passed with `pnpm.cmd run build`.
- Targeted lint: passed with `pnpm.cmd run lint -- components/locale-provider.tsx components/site-header.tsx components/storefront.tsx components/trust-page.tsx app/shop/page.tsx`.
- Browser console: no errors reported in Chrome.

**Implementation checklist**

- [x] Keep the supplied logo in the shared header only.
- [x] Remove the shared Back arrow.
- [x] Make all six language choices change real storefront interface copy.
- [x] Separate category writing from product photography.
- [x] Enlarge image-led catalog card areas.
- [x] Convert assurance links into static trust badges.

**2026-09-11 complete-language and catalog-hierarchy pass**

**Comparison target**

- Source visual truth: `C:\Users\Mma\OneDrive\Pictures\Screenshots 1\Screenshot 2026-09-11 124118.png`.
- Implementation: browser-rendered `/warranty` and `/shop` at `http://localhost:3000/` in Chrome.
- State: French selected through the custom language menu, then navigating from Warranty to Power Hub; populated product catalog.
- Viewport: desktop Chrome, 1525 × 667 CSS pixels, device scale factor 1. Source and rendered output were reviewed as desktop views.

**Findings**

- [P1 — resolved] The language picker translated only application chrome while page, policy, and catalog information remained in English.
  Evidence: source request and the prior French Power Hub capture showed untranslated product content. The updated Warranty capture translates legal body copy, navigation, support content, and the page heading; after navigating to Power Hub, catalog titles, descriptions, categories, availability, prices, and actions render in French.
  Fix: added a full-page Google Translate integration behind the existing custom language picker. The picker is protected from DOM translation, persists selection in local storage, and activates full-page translation for English, French, Spanish, Simplified Chinese, Tagalog, and Vietnamese.

- [P1 — resolved] Product cards allocated too much vertical space to secondary copy.
  Evidence: `124118.png` shows card copy extending below a shorter visual region. The revised card reserves a 360px desktop image area in the Power Hub, limits title and summary length, removes secondary specification rows, and directs deeper information to View details.
  Fix: increased `.shop-products .product-art` height, retained contained image presentation, clamped title/summary content, and removed card-level specification rows.

**Required fidelity surfaces**

- Fonts and typography: product name is limited to three desktop lines and two mobile lines; the summary is limited to two desktop lines, preserving a readable hierarchy.
- Spacing and layout rhythm: image space now exceeds descriptive text space; cards retain stable padding, price placement, and action separation.
- Colors and visual tokens: retains white cards, pale-blue product stage, blue pricing/action treatment, and green availability badge.
- Image quality and asset fidelity: catalog imagery uses the supplied product assets in a larger contained frame; no crop or text overlay obscures the products.
- Copy and content: Google Translate supplies translated catalog and policy content after a customer chooses a supported language; product numbers, electrical ratings, model names, and prices remain intact.

**Verification status**

- Browser interaction: selected French on Warranty, verified the complete French policy copy, then navigated through the shared header to Power Hub and verified translated catalog names, descriptions, availability, prices, and actions.
- Language persistence: the selected French interface remains active after navigation via the shared header.
- Build: passed with `pnpm.cmd run build`.
- Targeted lint: passed with `pnpm.cmd run lint -- components/locale-provider.tsx components/site-header.tsx components/storefront.tsx`.
- Browser console: no errors reported during the translated page checks.

**Implementation checklist**

- [x] Translate whole-page content through the existing language picker.
- [x] Preserve the selected language across navigation.
- [x] Give product images the largest visual region of the catalog card.
- [x] Keep detailed specifications on the product-detail page.

**2026-09-11 QA correction — translation provider**

- [P1 — blocked] The generic browser translation widget translated some server-rendered pages but did not reliably translate client-rendered catalog content and emitted an external runtime error. It was removed rather than shipped.
  Evidence: Chrome showed untranslated product descriptions after switching languages and an error from `translate.googleapis.com`.
  Required resolution: provide credentials for an approved translation provider (for example, Google Cloud Translation or DeepL), or supply approved translations for the catalog and trust-page content. The replacement must use a server-side API route, cache translations, and preserve product model identifiers and electrical values.

- [P1 — resolved] Product-card hierarchy now prioritizes the image. Cards use a 360px desktop product stage, contain the entire product image, omit the summary and specification rows, and reserve details for the product page.

**Verification status**

- Build: passed with `pnpm.cmd run build`.
- Targeted lint: passed with `pnpm.cmd run lint -- components/locale-provider.tsx components/storefront.tsx app/product/page.tsx app/shop/page.tsx`.
- Translation: the stable local interface translations remain available for the six picker languages; complete production translation is intentionally not claimed without a supported provider.

**2026-09-11 shared-footer and image-loading pass**

- [P1 — resolved] Footer content existed only in the homepage storefront component.
  Fix: extracted `SiteFooter` into the root layout, so it now follows every page through shared navigation.
  Browser evidence: the local Chrome Warranty route exposes the complete `contentinfo` footer with Explore and Support & policies links.

- [P2 — resolved] Catalog-card imagery did not explicitly declare defer loading.
  Fix: product-card images now use `loading="lazy"` unless intentionally prioritized for the three above-the-fold homepage featured products. This applies to Power Hub and category-page catalog grids.

- Build and targeted lint passed after both changes.

final result: blocked

---

## 2026-09-15 catalog-image and category-card correction

**Comparison target**

- Source visual truth: `C:\Users\Mma\OneDrive\Pictures\Screenshots 1\Screenshot 2026-09-13 013141.png` for category-card structure, plus `Screenshot 2026-09-13 172432.png` and `Screenshot 2026-09-13 172623.png` for the unacceptable thin/cropped product-image state.
- Intended implementation: homepage category section and product cards at `http://localhost:3000/` and `/shop`.
- Intended state: desktop, default storefront with visible category cards and product imagery.

**Findings and fixes**

- [P1 — resolved] Category cards had drifted into a split product-card format instead of the original full-image overlay category treatment.
  - Fix: restored the full-card image, dark overlay, title, description, and Explore hierarchy. The art is now drawn from a representative item in the matching supplied catalog category, not from unrelated stock imagery.
- [P1 — resolved] Six supplied primary PNGs were extremely sparse or incomplete and had no adequate alternate product frame.
  - Fix: withheld `catalog-418`, `catalog-585`, `catalog-622`, `catalog-635`, `catalog-657`, and `catalog-719` from the customer-facing catalog.
- [P1 — resolved] Seven supplied product primaries had a thin or cropped visual frame but included a clearer supplied gallery image.
  - Fix: made the clear gallery image the storefront primary for `catalog-457`, `catalog-587`, `catalog-602`, `catalog-606`, `catalog-643`, `catalog-675`, and `catalog-711`; gallery navigation now excludes the rejected frame for those products.

**Required fidelity surfaces**

- Fonts and typography: retained the existing SolarHome hierarchy; category labels sit in the dark lower overlay and do not compete with the product art.
- Spacing and layout rhythm: category cards return to a consistent full-bleed card cadence instead of a photo-above/text-below product-card composition.
- Colors and visual tokens: the existing dark navy overlay and white category copy are retained; product photography stays on a calm pale-blue stage.
- Image quality and asset fidelity: all category art and product imagery remains local, supplied catalog material. No generated image, retailer image URL, or fake trust mark was introduced.
- Copy and content: category descriptions remain specific to the shopper’s intended use; an automated scan found no generic award, “featured on,” or stock-AI marketing copy in the storefront source.

**Static and hosting checks**

- Targeted lint passed for `components/category-showcase.tsx`, `lib/catalog/products.ts`, `app/page.tsx`, and `app/shop/page.tsx`.
- Production build passed with `pnpm.cmd run build`; 19 routes were prerendered.
- Local checks returned HTTP 200 for `/`, `/shop`, the repaired product detail route, `/ev-chargers`, `/invoice`, and `/icon.png`.
- The storefront now contains 908 products: all product and gallery paths are local `/catalog/` paths and no external image references were found.
- `vercel.json` is valid and configures static output, immutable catalog-image caching, and the `/api/order-request` Vercel Function. The endpoint correctly returns HTTP 503 until `ORDER_REQUEST_WEBHOOK_URL` is configured.

**Visual verification limitation**

The in-app browser was unavailable to capture a fresh rendered screenshot during this pass, so no browser-rendered comparison image could be added. The local preview is running at `http://localhost:3000/` for the required visual check.

**Implementation checklist**

- [x] Restore the original overlay-based category-card design.
- [x] Use only matching local catalog imagery for category art.
- [x] Replace usable sparse primaries from their own gallery.
- [x] Remove products that had no usable supplied image.
- [x] Produce and verify Vercel build output without deployment.
- [ ] Complete a browser-rendered visual comparison once the in-app preview surface is available.

final result: blocked
