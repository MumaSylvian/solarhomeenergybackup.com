'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export const languages = [
  { code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }, { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' }, { code: 'tl', label: 'Tagalog' }, { code: 'vi', label: 'Tiếng Việt' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];
type TranslationKey = keyof typeof copy.en;

const copy = {
  en: {
    utilityLead: 'Planning a larger system?', utilityAction: 'Build a guided starting point', powerHub: 'Power Hub', wholeHome: 'Whole-home', portable: 'Portable', solar: 'Solar', planSystem: 'Plan my system', searchProducts: 'Search products', searchAll: 'Search all SolarHome products', search: 'Search', openCart: 'Open cart', wholeHomeBackup: 'Whole-home backup', portablePower: 'Portable power', solarPanels: 'Solar panels', refineView: 'Refine your view', brandModelCategory: 'Brand, model, category', wholeHomeCapable: 'Whole-home capable', inStock: 'In stock', viewDetails: 'View details', addToCart: 'Add to cart', requestPricing: 'Request pricing', currentPrice: 'Contact us for a current price', save20: 'Save 20%', priorityDelivery: 'Priority: 2–3 business days', warranty: '6-month limited warranty', checkout: 'Checkout', showing: 'Showing', products: 'products', loadingCatalog: 'Loading catalog records', noMatches: 'No products match these filters.', broaderSearch: 'Try a broader search or clear one of the selected filters.', showMore: 'Show more products', findPowerPath: 'Find the right power path.', powerHubIntro: 'Search and filter our organized product range by use, voltage, and whole-home capability. Every listing is in stock and has concise technical information for faster decisions.', productsInHub: 'products in the hub', clearPrices: 'clear current prices', keySpecifications: 'with key specifications', category: 'Category',
  },
  fr: {
    utilityLead: 'Vous préparez un système plus grand?', utilityAction: 'Créer un point de départ guidé', powerHub: 'Centre énergie', wholeHome: 'Maison entière', portable: 'Portable', solar: 'Solaire', planSystem: 'Planifier mon système', searchProducts: 'Rechercher des produits', searchAll: 'Rechercher les produits SolarHome', search: 'Rechercher', openCart: 'Ouvrir le panier', wholeHomeBackup: 'Secours maison entière', portablePower: 'Énergie portable', solarPanels: 'Panneaux solaires', refineView: 'Affiner votre vue', brandModelCategory: 'Marque, modèle, catégorie', wholeHomeCapable: 'Compatible maison entière', inStock: 'En stock', viewDetails: 'Voir les détails', addToCart: 'Ajouter au panier', requestPricing: 'Demander le prix', currentPrice: 'Contactez-nous pour le prix actuel', save20: 'Économisez 20%', priorityDelivery: 'Priorité : 2 à 3 jours ouvrables', warranty: 'Garantie limitée de 6 mois', checkout: 'Paiement', showing: 'Affichage de', products: 'produits', loadingCatalog: 'Chargement du catalogue', noMatches: 'Aucun produit ne correspond à ces filtres.', broaderSearch: 'Essayez une recherche plus large ou retirez un filtre.', showMore: 'Afficher plus de produits', findPowerPath: 'Trouvez la solution adaptée.', powerHubIntro: 'Recherchez et filtrez notre gamme par usage, tension et capacité maison entière. Chaque article est en stock avec des informations techniques claires.', productsInHub: 'produits dans le centre', clearPrices: 'prix actuels clairs', keySpecifications: 'avec spécifications essentielles', category: 'Catégorie',
  },
  es: {
    utilityLead: '¿Planeas un sistema más grande?', utilityAction: 'Crea un punto de partida guiado', powerHub: 'Centro de energía', wholeHome: 'Toda la casa', portable: 'Portátil', solar: 'Solar', planSystem: 'Planificar mi sistema', searchProducts: 'Buscar productos', searchAll: 'Buscar productos SolarHome', search: 'Buscar', openCart: 'Abrir carrito', wholeHomeBackup: 'Respaldo para toda la casa', portablePower: 'Energía portátil', solarPanels: 'Paneles solares', refineView: 'Refina tu vista', brandModelCategory: 'Marca, modelo, categoría', wholeHomeCapable: 'Compatible con toda la casa', inStock: 'En stock', viewDetails: 'Ver detalles', addToCart: 'Añadir al carrito', requestPricing: 'Solicitar precio', currentPrice: 'Contáctanos para el precio actual', save20: 'Ahorra 20%', priorityDelivery: 'Prioridad: 2–3 días hábiles', warranty: 'Garantía limitada de 6 meses', checkout: 'Pagar', showing: 'Mostrando', products: 'productos', loadingCatalog: 'Cargando catálogo', noMatches: 'Ningún producto coincide con estos filtros.', broaderSearch: 'Prueba una búsqueda más amplia o elimina un filtro.', showMore: 'Mostrar más productos', findPowerPath: 'Encuentra la energía adecuada.', powerHubIntro: 'Busca y filtra nuestra gama por uso, voltaje y capacidad para toda la casa. Cada artículo está en stock con información técnica clara.', productsInHub: 'productos en el centro', clearPrices: 'precios actuales claros', keySpecifications: 'con especificaciones clave', category: 'Categoría',
  },
  zh: {
    utilityLead: '规划更大的系统？', utilityAction: '创建引导式起点', powerHub: '能源中心', wholeHome: '全屋', portable: '便携', solar: '太阳能', planSystem: '规划我的系统', searchProducts: '搜索产品', searchAll: '搜索 SolarHome 产品', search: '搜索', openCart: '打开购物车', wholeHomeBackup: '全屋备用电源', portablePower: '便携电源', solarPanels: '太阳能板', refineView: '筛选视图', brandModelCategory: '品牌、型号、类别', wholeHomeCapable: '支持全屋', inStock: '有货', viewDetails: '查看详情', addToCart: '加入购物车', requestPricing: '询问价格', currentPrice: '联系我们获取当前价格', save20: '节省 20%', priorityDelivery: '优先：2–3 个工作日', warranty: '6 个月有限保修', checkout: '结账', showing: '显示', products: '件产品', loadingCatalog: '正在加载产品目录', noMatches: '没有产品符合这些筛选条件。', broaderSearch: '请扩大搜索范围或清除筛选条件。', showMore: '显示更多产品', findPowerPath: '找到合适的电力方案。', powerHubIntro: '按用途、电压和全屋支持搜索和筛选产品。每件商品均有库存，并提供清晰的技术信息。', productsInHub: '中心产品', clearPrices: '清晰当前价格', keySpecifications: '含关键规格', category: '类别',
  },
  tl: {
    utilityLead: 'Nagpaplano ng mas malaking sistema?', utilityAction: 'Gumawa ng gabay na panimulang punto', powerHub: 'Power Hub', wholeHome: 'Buong bahay', portable: 'Portable', solar: 'Solar', planSystem: 'Planuhin ang sistema ko', searchProducts: 'Maghanap ng produkto', searchAll: 'Maghanap ng mga produkto ng SolarHome', search: 'Maghanap', openCart: 'Buksan ang cart', wholeHomeBackup: 'Backup para sa buong bahay', portablePower: 'Portable na kuryente', solarPanels: 'Mga solar panel', refineView: 'Ayusin ang view', brandModelCategory: 'Brand, modelo, kategorya', wholeHomeCapable: 'Para sa buong bahay', inStock: 'May stock', viewDetails: 'Tingnan ang detalye', addToCart: 'Idagdag sa cart', requestPricing: 'Humingi ng presyo', currentPrice: 'Makipag-ugnayan para sa kasalukuyang presyo', save20: 'Makatipid ng 20%', priorityDelivery: 'Priority: 2–3 araw ng negosyo', warranty: '6-buwang limitadong warranty', checkout: 'Checkout', showing: 'Ipinapakita', products: 'mga produkto', loadingCatalog: 'Naglo-load ng catalog', noMatches: 'Walang produktong tumutugma sa mga filter na ito.', broaderSearch: 'Subukan ang mas malawak na paghahanap o alisin ang filter.', showMore: 'Magpakita ng higit pang produkto', findPowerPath: 'Hanapin ang tamang kuryente.', powerHubIntro: 'Maghanap at mag-filter ayon sa gamit, boltahe, at kakayahan para sa buong bahay. Lahat ng listing ay may stock at malinaw na teknikal na impormasyon.', productsInHub: 'mga produkto sa hub', clearPrices: 'malinaw na kasalukuyang presyo', keySpecifications: 'na may mahalagang specs', category: 'Kategorya',
  },
  vi: {
    utilityLead: 'Bạn đang lên kế hoạch cho hệ thống lớn hơn?', utilityAction: 'Tạo điểm khởi đầu có hướng dẫn', powerHub: 'Trung tâm năng lượng', wholeHome: 'Toàn bộ nhà', portable: 'Di động', solar: 'Mặt trời', planSystem: 'Lập kế hoạch hệ thống', searchProducts: 'Tìm sản phẩm', searchAll: 'Tìm sản phẩm SolarHome', search: 'Tìm', openCart: 'Mở giỏ hàng', wholeHomeBackup: 'Dự phòng toàn nhà', portablePower: 'Nguồn điện di động', solarPanels: 'Tấm pin mặt trời', refineView: 'Tinh chỉnh chế độ xem', brandModelCategory: 'Thương hiệu, mẫu, danh mục', wholeHomeCapable: 'Hỗ trợ toàn nhà', inStock: 'Còn hàng', viewDetails: 'Xem chi tiết', addToCart: 'Thêm vào giỏ', requestPricing: 'Yêu cầu báo giá', currentPrice: 'Liên hệ để có giá hiện tại', save20: 'Tiết kiệm 20%', priorityDelivery: 'Ưu tiên: 2–3 ngày làm việc', warranty: 'Bảo hành giới hạn 6 tháng', checkout: 'Thanh toán', showing: 'Đang hiển thị', products: 'sản phẩm', loadingCatalog: 'Đang tải danh mục', noMatches: 'Không có sản phẩm phù hợp với bộ lọc này.', broaderSearch: 'Hãy thử tìm rộng hơn hoặc bỏ một bộ lọc.', showMore: 'Hiển thị thêm sản phẩm', findPowerPath: 'Tìm giải pháp điện phù hợp.', powerHubIntro: 'Tìm kiếm và lọc theo mục đích sử dụng, điện áp và khả năng dùng cho toàn nhà. Mỗi sản phẩm đều còn hàng với thông tin kỹ thuật rõ ràng.', productsInHub: 'sản phẩm trong trung tâm', clearPrices: 'giá hiện tại rõ ràng', keySpecifications: 'có thông số chính', category: 'Danh mục',
  },
} as const;

type LocaleContextValue = { code: LanguageCode; setCode: (code: LanguageCode) => void; t: (key: TranslationKey) => string };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<LanguageCode>('en');
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem('solarhome-language') as LanguageCode | null;
      if (languages.some((language) => language.code === saved)) setCode(saved!);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.documentElement.lang = code;
    window.localStorage.setItem('solarhome-language', code);
  }, [code]);
  const chooseCode = (nextCode: LanguageCode) => {
    if (nextCode === code) return;
    window.localStorage.setItem('solarhome-language', nextCode);
    setCode(nextCode);
  };
  const value = { code, setCode: chooseCode, t: (key: TranslationKey) => copy[code][key] ?? copy.en[key] };
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error('useLocale must be used inside LocaleProvider');
  return locale;
}
