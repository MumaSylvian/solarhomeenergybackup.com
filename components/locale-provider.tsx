'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { googleLanguage, setTranslationCookie, startTranslation } from '@/lib/translate';
import { defaultMarket, formatMarketPrice, marketFor, type MarketCode, markets } from '@/lib/market';

export const languages = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' },
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
const translationNotice: Record<string, { text: string; action: string }> = {
  de: { text: 'Diese Seite wird automatisch von Google übersetzt und kann Fehler enthalten. Für Preise, Produktinformationen und Richtlinien ist die englische Version maßgeblich.', action: 'Auf Englisch ansehen' },
  it: { text: 'Questa pagina è tradotta automaticamente da Google e può contenere errori. Per prezzi, prodotti e condizioni fa fede la versione inglese.', action: 'Vedi in inglese' },
  ar: { text: 'تتم ترجمة هذه الصفحة تلقائياً بواسطة Google وقد تحتوي على أخطاء. النسخة الإنجليزية هي المرجع للأسعار ومعلومات المنتجات والسياسات.', action: 'عرض باللغة الإنجليزية' },
  nl: { text: 'Deze pagina wordt automatisch door Google vertaald en kan fouten bevatten. De Engelse versie geldt voor prijzen, productinformatie en beleid.', action: 'Bekijk in het Engels' },
  pl: { text: 'Ta strona jest automatycznie tłumaczona przez Google i może zawierać błędy. W sprawach cen, produktów i zasad obowiązuje wersja angielska.', action: 'Zobacz po angielsku' },
  fr: { text: 'Cette page est traduite automatiquement par Google et peut contenir des erreurs. La version anglaise fait foi pour les prix, les informations produit et nos politiques.', action: 'Voir en anglais' },
  es: { text: 'Esta página se traduce automáticamente con Google y puede contener errores. La versión en inglés prevalece para precios, información de productos y nuestras políticas.', action: 'Ver en inglés' },
  zh: { text: '本页面由 Google 自动翻译，可能存在错误。价格、产品信息和我们的政策以英文版本为准。', action: '查看英文版' },
  tl: { text: 'Awtomatikong isinalin ng Google ang pahinang ito at maaaring may mga mali. Ang bersyong Ingles ang masusunod para sa presyo, impormasyon ng produkto, at aming mga patakaran.', action: 'Tingnan sa Ingles' },
  vi: { text: 'Trang này được Google dịch tự động và có thể có lỗi. Phiên bản tiếng Anh được ưu tiên áp dụng cho giá, thông tin sản phẩm và chính sách của chúng tôi.', action: 'Xem bằng tiếng Anh' },
};

const STORAGE_KEY = 'solarhome-language';
const MARKET_STORAGE_KEY = 'solarhome-market';
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

type LocaleContextValue = {
  code: LanguageCode;
  setCode: (code: LanguageCode) => void;
  market: ReturnType<typeof marketFor>;
  setMarket: (code: MarketCode) => void;
  formatPrice: (amount: number) => string;
  t: (key: TranslationKey) => string;
};
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<LanguageCode>('en');
  const [marketCode, setMarketCode] = useState<MarketCode>(defaultMarket);
  useEffect(() => {
    const saved = readSaved() ?? 'en';
    const savedMarket = window.localStorage.getItem(MARKET_STORAGE_KEY) as MarketCode | null;
    const queryMarket = new URLSearchParams(window.location.search).get('market') as MarketCode | null;
    const browserLanguage = (navigator.language ?? '').toLowerCase();
    const browserMarket = markets.find((market) => browserLanguage === market.locale.toLowerCase())
      ?? markets.find((market) => browserLanguage.startsWith(`${market.language}-`));
    const validQueryMarket = queryMarket && markets.some((market) => market.code === queryMarket) ? queryMarket : null;
    const validSavedMarket = savedMarket && markets.some((market) => market.code === savedMarket) ? savedMarket : null;
    const selectedMarket = validQueryMarket ?? validSavedMarket ?? browserMarket?.code ?? defaultMarket;
    const selectedLanguage = validQueryMarket ? marketFor(selectedMarket).language as LanguageCode : saved;
    const timer = window.setTimeout(() => {
      setMarketCode(selectedMarket);
      if (selectedLanguage === 'en') {
        // A leftover cookie would translate the page if the script ever loaded.
        setTranslationCookie('en');
      } else {
        setCode(selectedLanguage);
        startTranslation(selectedLanguage);
      }
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
  const chooseMarket = (nextMarket: MarketCode) => {
    try {
      window.localStorage.setItem(MARKET_STORAGE_KEY, nextMarket);
    } catch {
      // The in-memory choice still applies for this render.
    }
    setMarketCode(nextMarket);
    const nextLanguage = marketFor(nextMarket).language as LanguageCode;
    if (nextLanguage !== code) {
      try { window.localStorage.setItem(STORAGE_KEY, nextLanguage); } catch { /* cookie remains authoritative */ }
      setTranslationCookie(nextLanguage);
    }
    window.location.reload();
  };
  const market = marketFor(marketCode);
  const value = { code, setCode: chooseCode, market, setMarket: chooseMarket, formatPrice: (amount: number) => formatMarketPrice(amount, market), t: (key: TranslationKey) => copy[key] };
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
