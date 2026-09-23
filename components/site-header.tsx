'use client';
/* oxlint-disable next/no-html-link-for-pages -- these primary links must retain native browser navigation if hydration is delayed. */

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, Globe2, Menu, Search, ShoppingCart } from 'lucide-react';
import { languages, useLocale } from '@/components/locale-provider';
import { storefrontCategories } from '@/lib/catalog/categories';

export function SiteHeader() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { code, setCode, t } = useLocale();
  const language = languages.find((item) => item.code === code) ?? languages[0];
  const chooseLanguage = (nextCode: (typeof languages)[number]['code']) => {
    setCode(nextCode);
    setLanguageOpen(false);
  };

  return (
    <>
      <div className="utility-bar notranslate">
        <span>Free shipping on orders $2,000+</span>
        <span className="utility-detail">10% shipping below $2,000</span>
        <a href="/support">Customer support</a>
        <a href="/system-finder">{t('utilityAction')}</a>
      </div>
      <header className="site-header notranslate">
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
          <details className="category-nav">
            <summary>
              Categories <ChevronDown size={14} />
            </summary>
            <div className="category-nav-menu">
              {storefrontCategories.map((category) => (
                <a key={category.label} href={category.href}>
                  {category.label}
                </a>
              ))}
            </div>
          </details>
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
            aria-label="Open shopping cart"
          >
            <ShoppingCart size={20} />
          </a>
          <div className="language-picker">
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
            className="mobile-nav notranslate"
            aria-label="Mobile navigation"
          >
            <a href="/shop">All products</a>
            <strong>Categories</strong>
            {storefrontCategories.map((category) => (
              <a key={category.label} href={category.href}>
                {category.label}
              </a>
            ))}
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
