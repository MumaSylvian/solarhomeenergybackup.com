'use client';
/* oxlint-disable next/no-html-link-for-pages -- these primary links must retain native browser navigation if hydration is delayed. */

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { ChevronDown, Globe2, Menu, Search, ShoppingCart } from 'lucide-react';
import { languages, useLocale } from '@/components/locale-provider';
import { cartItemCount, subscribeToCart } from '@/lib/cart';
import { storefrontCategories } from '@/lib/catalog/categories';

/**
 * Closes an open header menu on a click outside it or Escape (focus returns
 * to its trigger), and after the mouse has been away from it for a moment.
 * The delay keeps the menu open while the pointer crosses the gap between
 * the trigger and the list.
 */
function useDismissableMenu(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void,
  triggerSelector: string,
) {
  const leaveTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      ref.current?.querySelector<HTMLElement>(triggerSelector)?.focus();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close, ref, triggerSelector]);
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);
  return {
    onMouseLeave: () => {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(close, 300);
    },
    onMouseEnter: () => window.clearTimeout(leaveTimer.current),
  };
}

export function SiteHeader() {
  const cartCount = useSyncExternalStore(
    subscribeToCart,
    cartItemCount,
    () => 0,
  );
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { code, setCode, t } = useLocale();
  const language = languages.find((item) => item.code === code) ?? languages[0];
  const pickerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDetailsElement>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  // <details> keeps its own open state; closing it fires onToggle, which syncs ours.
  function closeCategories() {
    if (categoriesRef.current) categoriesRef.current.open = false;
  }
  function closeLanguage() {
    setLanguageOpen(false);
  }
  const categoriesHover = useDismissableMenu(
    categoriesRef,
    categoriesOpen,
    closeCategories,
    'summary',
  );
  const languageHover = useDismissableMenu(
    pickerRef,
    languageOpen,
    closeLanguage,
    '.language-trigger',
  );
  const chooseLanguage = (nextCode: (typeof languages)[number]['code']) => {
    setCode(nextCode);
    setLanguageOpen(false);
  };

  return (
    <>
      <div className="utility-bar">
        <span>Ships to all 50 states</span>
        <span className="utility-detail">Flat $45 delivery per order</span>
        <a href="/support">Customer support</a>
        <a href="/system-finder">{t('utilityAction')}</a>
      </div>
      <header className="site-header">
        <a
          href="/"
          className="brand brand-logo"
          aria-label="SolarHome Energy Backup home"
        >
          <Image
            src="/solarhome-energy-backup-logo.png"
            alt="SolarHome Energy Backup"
            width={320}
            height={107}
            priority
          />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/shop">{t('powerHub')}</a>
          <details
            className="category-nav"
            ref={categoriesRef}
            onToggle={(event) => setCategoriesOpen(event.currentTarget.open)}
            {...categoriesHover}
          >
            <summary>
              Categories <ChevronDown size={14} />
            </summary>
            <div className="category-nav-menu">
              {storefrontCategories.map((category) => (
                <a key={category.label} href={category.href} onClick={closeCategories}>
                  {category.label}
                </a>
              ))}
            </div>
          </details>
          <a href="/blog">Guides</a>
          <a href="/support">Support</a>
          <a href="/system-finder">{t('planSystem')}</a>
          <a href="/invoice">Invoice</a>
        </nav>
        <form className="global-search" action="/shop">
          <Search size={16} />
          <input
            name="search"
            aria-label="Search the catalog"
            placeholder="Search the catalog"
          />
          <button type="submit" aria-label="Search">
            <Search size={14} />
          </button>
        </form>
        <div className="header-actions">
          <a
            href="/checkout"
            className="cart-button"
            aria-label={
              cartCount
                ? `Open shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
                : 'Open shopping cart'
            }
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="cart-count notranslate" aria-hidden="true">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </a>
          <div
            className="language-picker notranslate"
            translate="no"
            ref={pickerRef}
            {...languageHover}
          >
            <button
              className="language-trigger"
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={languageOpen}
              aria-label="Choose website language"
            >
              <Globe2 size={16} />
              <span>
                {language.code.toUpperCase()} · {language.label}
              </span>
              <ChevronDown size={14} />
            </button>
            {languageOpen && (
              <div className="language-menu" role="menu">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    role="menuitem"
                    className={item.code === code ? 'selected' : ''}
                    onClick={() => chooseLanguage(item.code)}
                  >
                    {item.code.toUpperCase()} · {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="mobile-menu"
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <Menu size={21} />
          </button>
        </div>
      </header>
      {mobileOpen && (
        <>
          <form className="mobile-global-search" action="/shop">
            <Search size={17} />
            <input
              name="search"
              aria-label="Search the catalog"
              placeholder="Search the catalog"
            />
            <button type="submit">Search</button>
          </form>
          <nav
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            <a href="/shop">All products</a>
            <strong>Categories</strong>
            {storefrontCategories.map((category) => (
              <a key={category.label} href={category.href}>
                {category.label}
              </a>
            ))}
            <a href="/blog">Backup power guides</a>
            <strong>Help & ordering</strong>
            <a href="/support">Customer support</a>
            <a href="/invoice">Request an invoice</a>
            <a href="/shipping-delivery">Shipping & delivery</a>
            <a href="/system-finder">{t('planSystem')}</a>
          </nav>
        </>
      )}
    </>
  );
}
