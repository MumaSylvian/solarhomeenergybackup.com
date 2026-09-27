'use client';
/* oxlint-disable next/no-html-link-for-pages -- these primary links must retain native browser navigation if hydration is delayed. */

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { ChevronDown, Globe2, Menu, Search, ShoppingCart } from 'lucide-react';
import { languages, useLocale } from '@/components/locale-provider';
import { cartItemCount, subscribeToCart } from '@/lib/cart';
import { categoryGroups } from '@/lib/catalog/categories';

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
  const headerRef = useRef<HTMLElement>(null);
  function closeMobile() {
    setMobileOpen(false);
  }
  // Mouse-out does not apply on phones, so only the click and Escape handling is used.
  useDismissableMenu(headerRef, mobileOpen, closeMobile, '.mobile-menu');
  const panelRef = useRef<HTMLDivElement>(null);
  // Lock the page behind the open menu, and fit the menu into the space left
  // below the header (which sits lower when the top bar or translation
  // notice is showing), so its last links can always be scrolled to.
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', mobileOpen);
    if (!mobileOpen) return;
    const fit = () => {
      const header = headerRef.current;
      const panel = panelRef.current;
      if (header && panel)
        panel.style.maxHeight = `${window.innerHeight - header.getBoundingClientRect().bottom}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => {
      window.removeEventListener('resize', fit);
      document.documentElement.classList.remove('menu-open');
    };
  }, [mobileOpen]);
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
      <header className="site-header" ref={headerRef}>
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
          <a href="/shop">Shop all</a>
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
              {categoryGroups.map(({ group, categories }) => (
                <div key={group} className="category-nav-group">
                  <strong>{group}</strong>
                  {categories.map((category) => (
                    <a key={category.slug} href={category.href} onClick={closeCategories}>
                      {category.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </details>
          <a href="/blog">Guides</a>
          <a href="/support">Support</a>
          <a href="/system-finder" className="nav-cta">
            {t('planSystem')}
          </a>
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
            aria-controls="mobile-panel"
          >
            <Menu size={21} />
          </button>
        </div>
        {mobileOpen && (
          <div className="mobile-panel" id="mobile-panel" ref={panelRef}>
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
              <a href="/shop">Shop all products</a>
              {categoryGroups.map(({ group, categories }) => (
                <div key={group} className="mobile-nav-group">
                  <strong>{group}</strong>
                  <div className="mobile-nav-categories">
                    {categories.map((category) => (
                      <a key={category.slug} href={category.href}>
                        {category.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <a href="/blog">Backup power guides</a>
              <a href="/system-finder">{t('planSystem')}</a>
              <strong>Help & ordering</strong>
              <a href="/support">Customer support</a>
              <a href="/invoice">Request an invoice</a>
              <a href="/shipping-delivery">Shipping & delivery</a>
              <a href="/returns">Returns & refunds</a>
              <a href="/about">About us</a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
