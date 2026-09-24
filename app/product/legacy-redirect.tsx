'use client';
/* oxlint-disable next/no-html-link-for-pages -- the fallback link must work before client routing loads. */

import { useEffect } from 'react';

/** Forwards old `/product?slug=…` links to the static `/products/<slug>` page. */
export function LegacyProductRedirect() {
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('slug') ?? '';
    window.location.replace(
      /^[a-z0-9-]+$/.test(slug) ? `/products/${slug}` : '/shop',
    );
  }, []);

  return (
    <main className="page-shell loading-page">
      <p>Opening product details…</p>
      <a className="button primary" href="/shop">
        Browse the catalog
      </a>
    </main>
  );
}
