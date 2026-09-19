'use client';
/* oxlint-disable next(no-img-element) -- this static export deliberately uses catalog-approved image URLs. */
/* oxlint-disable next/no-html-link-for-pages -- storefront links retain native navigation if client routing is unavailable. */

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, Battery, Check, ChevronLeft, ChevronRight, CircleHelp, Globe2, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/components/locale-provider';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export type ProductPreview = {
  id: string; slug: string; name: string; brand: string; category: string;
  continuousOutputWatts?: number | null; batteryCapacityWh?: number | null; acVoltage?: string | null;
  shortDescription?: string; sourcePrice?: number | null; retailPrice?: number | null; imageUrl?: string | null; sourceImageUrl?: string | null; galleryImageUrls?: string[];
};

const slides = [
  { title: <>Keep home<br/><em>moving.</em></>, copy: 'Backup power built around the appliances and circuits you rely on.', action: 'Explore whole-home systems', href: '/whole-home-backup', focus: 'center 45%', image: 'https://images.pexels.com/photos/9875417/pexels-photo-9875417.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Solar installer carrying a panel at a residence' },
  { title: <>Save daylight<br/><em>for later.</em></>, copy: 'Solar charging, expandable storage, and equipment selected for compatible system builds.', action: 'Browse solar equipment', href: '/solar-panels', focus: 'center 45%', image: 'https://images.pexels.com/photos/29206488/pexels-photo-29206488.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Solar technician installing panels on a residential rooftop' },
  { title: <>Power that<br/><em>comes with you.</em></>, copy: 'Portable backup for outages, work sites, RVs, and weekends off-grid.', action: 'Shop portable power', href: '/portable-power', focus: 'center 50%', image: 'https://images.pexels.com/photos/9212502/pexels-photo-9212502.jpeg?auto=compress&cs=tinysrgb&w=1800', alt: 'Family spending time together outdoors while camping' },
];

export function Storefront() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);
  const moveSlide = (direction: -1 | 1) => setActiveSlide((current) => (current + direction + slides.length) % slides.length);

  return <main>
    <section className="hero-slider" aria-label="Featured energy solutions">
      <Image className="hero-photo" src={slide.image} style={{ objectPosition: slide.focus }} alt={slide.alt} fill priority={activeSlide === 0} sizes="100vw" unoptimized/><div className="hero-shade"/>
      <div className="hero-copy" key={activeSlide}><h1>{slide.title}</h1><p>{slide.copy}</p><div className="hero-actions"><a href={slide.href} className="button primary">{slide.action}<ArrowRight size={17}/></a><a href="/system-finder" className="button secondary">Find my setup</a></div><div className="hero-notes"><span><Check size={15}/> Planning guidance</span><span><Check size={15}/> Clear technical education</span></div></div>
      <div className="hero-controls"><button onClick={() => moveSlide(-1)} aria-label="Previous slide"><ChevronLeft size={19}/></button><div aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}>{slides.map((_, index) => <button key={index} className={index === activeSlide ? 'active' : ''} onClick={() => setActiveSlide(index)} aria-label={`Show slide ${index + 1}`}/>)}</div><button onClick={() => moveSlide(1)} aria-label="Next slide"><ChevronRight size={19}/></button></div>
      <aside className="hero-status"><span>POWER HUB</span><strong>Plan. Select. Build your reserve.</strong><a href="/shop">Open the dashboard <ArrowRight size={15}/></a></aside>
    </section>

    <section className="trust-strip" aria-label="Store assurances"><div className="assurance-badge"><ShieldCheck size={19}/><span><b>Secure order review</b><small>Confirmation before payment</small></span></div><div className="assurance-badge"><Battery size={19}/><span><b>6-month warranty</b><small>Eligible purchases</small></span></div><div className="assurance-badge"><CircleHelp size={19}/><span><b>Practical support</b><small>Mon–Sat, 9 AM–5 PM PT</small></span></div></section>
    <section className="brands-strip" aria-label="Recognized energy brands"><span className="brands-icon"><Globe2 size={23}/></span><div><b>Recognized energy brands</b><p>Shop EcoFlow, BLUETTI, Victron Energy, Anker SOLIX, EG4, and more across the current catalog.</p></div></section>
    <section className="section planning-panel"><div><p className="eyebrow">Start with your loads</p><h2>Plan for what must stay on.</h2><p>List the circuits you need, your backup time, and any high-demand equipment. The System Finder gives you a sensible starting range, not an installation plan.</p><a href="/system-finder" className="button primary">Build my power plan <ArrowRight size={17}/></a></div><div className="planning-list"><div><strong>01</strong><span><b>Essential loads</b><small>Keep the basics running when the grid does not.</small></span></div><div><strong>02</strong><span><b>More capacity</b><small>Add battery reserve as your backup time grows.</small></span></div><div><strong>03</strong><span><b>Home connection</b><small>Prepare for compatible transfer and control equipment.</small></span></div></div></section>
    <section className="section resource"><p className="eyebrow">Learn before you buy</p><div className="resource-grid"><article><span>01</span><h3>Know your output</h3><p>Watts describe what you can run at one time. Motors and compressors can need additional starting power.</p></article><article><span>02</span><h3>Size the reserve</h3><p>Watt-hours describe how long your power lasts. Your loads and desired run time guide the right range.</p></article><article><span>03</span><h3>Connect safely</h3><p>Home integration may require rated equipment and qualified installation. Confirm documentation before purchase.</p></article></div></section>
  </main>;
}

export function ProductCard({ id, slug, name, brand, category, output, capacity, voltage, shortDescription, sourcePrice, retailPrice, imageUrl, sourceImageUrl, galleryImageUrls, add, priority = false, continuousOutputWatts, batteryCapacityWh, acVoltage }: ProductPreview & { output?: number | null; capacity?: number | null; voltage?: string | null; priority?: boolean; add?: (product: ProductPreview) => void }) {
  const { t } = useLocale();
  const resolvedImageUrl = imageUrl ?? sourceImageUrl;
  const displayBrand = brand === 'SolarHome Reserve' ? 'SolarHome Energy Backup' : brand;
  const product: ProductPreview = { id, slug, name, brand, category, shortDescription, sourcePrice, retailPrice, imageUrl: resolvedImageUrl, sourceImageUrl, galleryImageUrls, continuousOutputWatts: continuousOutputWatts ?? output, batteryCapacityWh: batteryCapacityWh ?? capacity, acVoltage: acVoltage ?? voltage };
  if (!resolvedImageUrl) return null;
  const productHref = `/product?slug=${encodeURIComponent(slug)}`;
  return <article className="product-card"><a href={productHref} className="product-art" aria-label={`View ${name}`}><Image src={resolvedImageUrl} alt={name} fill sizes="(max-width: 850px) 310px, 33vw" unoptimized priority={priority} loading="eager"/></a><div className="product-content"><div className="product-meta"><p className="product-category">{category}</p><p className="availability-line"><Check size={13}/> {t('inStock')}</p></div><p className="product-brand">{displayBrand}</p><h3>{name}</h3>{shortDescription && <p className="product-summary">{shortDescription}</p>}{retailPrice !== null && retailPrice !== undefined ? <p className="product-price"><span>{money.format(retailPrice)}</span>{sourcePrice !== null && sourcePrice !== undefined && <del>{money.format(sourcePrice)}</del>}<small>{t('save20')}</small></p> : <p className="product-price unavailable"><span>{t('requestPricing')}</span><small>{t('currentPrice')}</small></p>}<div className="product-bottom"><a href={productHref}>{t('viewDetails')} <ArrowRight size={16}/></a>{add && <button type="button" onClick={() => add(product)}>{t('addToCart')}</button>}</div></div></article>;
}
