'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { googleLanguage, setTranslationCookie, startTranslation } from '@/lib/translate';

export const languages = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }, { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' }, { code: 'tl', label: 'Tagalog' }, { code: 'vi', label: 'Tiếng Việt' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];
type TranslationKey = keyof typeof copy;

/**
 * Interface labels in English. Other languages are produced for the whole
 * page by Google's website translator (lib/translate.ts), so labels, product
 * text, checkout, and policies all switch together.
 */
const copy = {
  utilityLead: 'Planning a larger system?', utilityAction: 'Build a guided starting point', powerHub: 'Power Hub', wholeHome: 'Whole-home', portable: 'Portable', solar: 'Solar', planSystem: 'Plan my system', searchProducts: 'Search products', searchAll: 'Search all SolarHome products', search: 'Search', openCart: 'Open cart', wholeHomeBackup: 'Whole-home backup', portablePower: 'Portable power', solarPanels: 'Solar panels', refineView: 'Refine your view', brandModelCategory: 'Brand, model, category', wholeHomeCapable: 'Whole-home capable', inStock: 'In stock', confirmAvailability: 'Availability confirmed at order review', viewDetails: 'View details', addToCart: 'Add to cart', requestPricing: 'Request pricing', currentPrice: 'Contact us for a current price', checkout: 'Checkout', showing: 'Showing', products: 'products', loadingCatalog: 'Loading catalog records', noMatches: 'No products match these filters.', broaderSearch: 'Try a broader search or clear one of the selected filters.', showMore: 'Show more products', findPowerPath: 'Find the right power path.', powerHubIntro: 'Search and filter our organized product range by use, voltage, and whole-home capability. Every listing is in stock and has concise technical information for faster decisions.', productsInHub: 'products in the hub', clearPrices: 'clear current prices', keySpecifications: 'with key specifications', category: 'Category',
} as const;

/** Shown while a machine translation is active; written in each language so it reads before Google translates. */
const translationNotice: Record<Exclude<LanguageCode, 'en'>, { text: string; action: string }> = {
  fr: { text: 'Cette page est traduite automatiquement par Google et peut contenir des erreurs. La version anglaise fait foi pour les prix, les informations produit et nos politiques.', action: 'Voir en anglais' },
  es: { text: 'Esta página se traduce automáticamente con Google y puede contener errores. La versión en inglés prevalece para precios, información de productos y nuestras políticas.', action: 'Ver en inglés' },
  zh: { text: '本页面由 Google 自动翻译，可能存在错误。价格、产品信息和我们的政策以英文版本为准。', action: '查看英文版' },
  tl: { text: 'Awtomatikong isinalin ng Google ang pahinang ito at maaaring may mga mali. Ang bersyong Ingles ang masusunod para sa presyo, impormasyon ng produkto, at aming mga patakaran.', action: 'Tingnan sa Ingles' },
  vi: { text: 'Trang này được Google dịch tự động và có thể có lỗi. Phiên bản tiếng Anh được ưu tiên áp dụng cho giá, thông tin sản phẩm và chính sách của chúng tôi.', action: 'Xem bằng tiếng Anh' },
};

const STORAGE_KEY = 'solarhome-language';
const isLanguage = (value: string | null | undefined): value is LanguageCode =>
  languages.some((language) => language.code === value);
/** Where storage is blocked (some private modes), the translator's own cookie still carries the choice. */
const readCookie = (): LanguageCode | null => {
  const target = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([\w-]+)/)?.[1];
  const code = Object.entries(googleLanguage).find(([, google]) => google === target)?.[0];
  return isLanguage(code) ? code : null;
};
const readSaved = (): LanguageCode | null => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isLanguage(saved) ? saved : readCookie();
  } catch {
    return readCookie();
  }
};

type LocaleContextValue = { code: LanguageCode; setCode: (code: LanguageCode) => void; t: (key: TranslationKey) => string };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<LanguageCode>('en');
  useEffect(() => {
    const saved = readSaved() ?? 'en';
    if (saved === 'en') {
      // A leftover cookie would translate the page if the script ever loaded.
      setTranslationCookie('en');
      return;
    }
    const timer = window.setTimeout(() => {
      setCode(saved);
      startTranslation(saved);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  // <html lang> stays "en" (the source language) and Google's translator
  // updates it. Setting it to the target first made Google treat the page as
  // already translated (Chinese came out untranslated).
  /** Reloads so Google's translator starts (or stops) on a clean page. */
  const chooseCode = (nextCode: LanguageCode) => {
    if (nextCode === code) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, nextCode);
    } catch {
      // Storage blocked: the cookie below still carries the choice for this visit.
    }
    setTranslationCookie(nextCode);
    window.location.reload();
  };
  const value = { code, setCode: chooseCode, t: (key: TranslationKey) => copy[key] };
  const notice = code === 'en' ? null : translationNotice[code];
  return (
    <LocaleContext.Provider value={value}>
      {notice && (
        <div className="translation-notice notranslate" translate="no" lang={code} role="note">
          <span>{notice.text}</span>
          <button type="button" onClick={() => chooseCode('en')}>
            {notice.action}
          </button>
        </div>
      )}
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error('useLocale must be used inside LocaleProvider');
  return locale;
}
