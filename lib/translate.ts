/**
 * Full-page translation through Google's website translator.
 *
 * Nothing loads while the site is in English, so English visitors and search
 * crawlers never fetch the script. Choosing another language sets Google's
 * `googtrans` cookie and reloads; on load the script reads the cookie and
 * translates the page, including content added later (product lists, cart).
 * Disclosed on /cookies.
 */
declare global {
  interface Window {
    __solarhomeTranslateInit?: () => void;
    google?: { translate?: { TranslateElement: new (options: object, elementId: string) => unknown } };
  }
}

/** Site language code → Google Translate code. */
export const googleLanguage = { en: 'en', fr: 'fr', es: 'es', zh: 'zh-CN', tl: 'tl', vi: 'vi' } as const;
type SiteLanguage = keyof typeof googleLanguage;

const cookieDomains = () => {
  const host = window.location.hostname;
  // Google reads the cookie on the bare host and on the registrable domain.
  const parts = host.split('.');
  return parts.length > 2 ? ['', `.${parts.slice(-2).join('.')}`] : ['', `.${host}`];
};

export function setTranslationCookie(code: SiteLanguage) {
  for (const domain of cookieDomains()) {
    const scope = `path=/${domain ? `; domain=${domain}` : ''}`;
    document.cookie =
      code === 'en'
        ? `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${scope}`
        : `googtrans=/en/${googleLanguage[code]}; ${scope}`;
  }
}

/**
 * Google's translator swaps text nodes for its own elements, and React then
 * fails when it removes or inserts next to a node that has moved ("Failed to
 * execute 'removeChild' on 'Node'"). These guards let React carry on; they are
 * installed only while a translation is active.
 */
function guardDomForTranslation() {
  const proto = Node.prototype as Node & { __translateGuarded?: boolean };
  if (proto.__translateGuarded) return;
  proto.__translateGuarded = true;
  const original = (name: 'removeChild' | 'insertBefore') =>
    Object.getOwnPropertyDescriptor(Node.prototype, name)!.value as (this: Node, ...args: Node[]) => Node;
  const removeChild = original('removeChild');
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = original('insertBefore');
  proto.insertBefore = function <T extends Node>(this: Node, node: T, reference: Node | null): T {
    if (reference && reference.parentNode !== this) return node;
    return insertBefore.call(this, node, reference as Node) as T;
  };
}

export function startTranslation(code: SiteLanguage) {
  if (code === 'en' || document.getElementById('google-translate-script')) return;
  guardDomForTranslation();
  setTranslationCookie(code);
  const mount = document.createElement('div');
  mount.id = 'google_translate_element';
  mount.hidden = true;
  document.body.appendChild(mount);
  window.__solarhomeTranslateInit = () => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    if (!TranslateElement) return;
    new TranslateElement(
      { pageLanguage: 'en', includedLanguages: Object.values(googleLanguage).filter((c) => c !== 'en').join(','), autoDisplay: false },
      'google_translate_element',
    );
  };
  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=__solarhomeTranslateInit';
  script.async = true;
  document.body.appendChild(script);
}
