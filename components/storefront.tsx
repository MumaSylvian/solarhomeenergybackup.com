'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Battery, Check, ChevronRight, CircleHelp, Menu, Minus, Plus, ShieldCheck, ShoppingBag, Sun, X, Zap } from 'lucide-react';
import { approvedCatalog } from '@/lib/catalog/products';

const categories = [
  ['Whole-home backup', 'Inverters, batteries and complete systems for the loads that matter.', Battery],
  ['Portable power', 'High-output stations for outages, job sites, RVs and beyond.', Zap],
  ['Batteries', 'Build capacity around your household and expand on your terms.', Battery],
  ['Solar panels', 'Portable and rigid solar options for renewable charging.', Sun],
  ['Home integration', 'Transfer equipment, smart panels and critical-load controls.', ShieldCheck],
  ['Accessories', 'The compatible cables, protection and hardware that complete a system.', CircleHelp],
] as const;

export function Storefront() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useMemo(() => approvedCatalog.filter((product) => cart[product.id]), [cart]);
  const add = (id: string) => { setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 })); setCartOpen(true); };
  const change = (id: string, amount: number) => setCart((current) => {
    const next = Math.max(0, (current[id] ?? 0) + amount); const copy = { ...current };
    if (next) copy[id] = next; else delete copy[id]; return copy;
  });
  const count = Object.values(cart).reduce((total, quantity) => total + quantity, 0);

  return <main>
    <div className="utility-bar">Planning a larger system? <Link href="/system-finder">Start with the System Finder</Link></div>
    <header className="site-header"><Link href="/" className="brand" aria-label="Gridwell home"><span className="brand-mark"><Zap size={18} fill="currentColor" /></span><span>GRIDWELL</span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation"><Link href="/shop">Shop</Link><Link href="/whole-home-backup">Whole-home backup</Link><Link href="/portable-power">Portable power</Link><Link href="/solar-panels">Solar</Link><Link href="/system-finder">System Finder</Link></nav>
      <div className="header-actions"><Link href="/compare" className="text-link">Compare</Link><button className="bag-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={19}/>{count > 0 && <span>{count}</span>}</button><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu size={22}/></button></div>
    </header>
    {mobileOpen && <nav className="mobile-nav"><Link href="/shop">Shop equipment</Link><Link href="/whole-home-backup">Whole-home backup</Link><Link href="/portable-power">Portable power</Link><Link href="/solar-panels">Solar</Link><Link href="/system-finder">System Finder</Link><Link href="/compare">Compare products</Link></nav>}

    <section className="hero"><div className="hero-grid" aria-hidden="true"/><div className="hero-copy"><p className="eyebrow light"><Sun size={15}/> Resilient energy, thoughtfully selected</p><h1>Backup Power<br/><em>Built for Real Life.</em></h1><p>Whole-home batteries, solar generators, expandable power stations and energy systems designed to keep your home running.</p><div className="hero-actions"><Link href="/whole-home-backup" className="button primary">Shop Home Backup <ArrowRight size={17}/></Link><Link href="/portable-power" className="button secondary">Shop Portable Power</Link></div><div className="hero-notes"><span><Check size={15}/> Clear product specs</span><span><Check size={15}/> Quote support for systems</span><span><Check size={15}/> 120V / 240V options</span></div></div><div className="hero-system" aria-label="Illustration of a home backup system"><div className="system-sun"><Sun size={36}/></div><div className="system-home"><div className="roof"/><div className="house-body"><span/><span/><span/><span/></div></div><div className="system-unit inverter"><i/>INVERTER</div><div className="system-unit battery-unit"><i/>BATTERY<br/><small>10 kWh</small></div><div className="power-line"/></div></section>

    <section className="trust-strip"><span><ShieldCheck size={20}/> Product information tied to manufacturer sources</span><span><Battery size={20}/> Expandable system planning</span><span><CircleHelp size={20}/> Help before you buy</span></section>

    <section className="section"><div className="section-heading"><div><p className="eyebrow">Shop by need</p><h2>Start with the way you live.</h2></div><Link href="/shop" className="inline-link">View all equipment <ArrowRight size={16}/></Link></div><div className="category-grid">{categories.map(([title, copy, Icon]) => <Link href={`/shop?category=${encodeURIComponent(title)}`} className="category-card" key={title}><span><Icon size={22}/></span><h3>{title}</h3><p>{copy}</p><b>Explore <ChevronRight size={16}/></b></Link>)}</div></section>

    <section className="featured"><div className="section featured-head"><div><p className="eyebrow">Selected systems</p><h2>Strong starting points.<br/>Room to grow.</h2></div><p>Every product starts as a sourced catalog record. Only approved products appear here; pricing is set independently of supplier listings.</p></div><div className="product-row">{approvedCatalog.map((product) => <ProductCard key={product.id} id={product.id} name={product.name} brand={product.brand} category={product.category} output={product.continuousOutputWatts} capacity={product.batteryCapacityWh} voltage={product.acVoltage} add={add}/>)}</div></section>

    <section className="section planner"><div><p className="eyebrow">A sensible place to begin</p><h2>Not sure how much backup you need?</h2><p>Tell us what you need to keep running, for how long, and whether you have high-demand 240V loads. We’ll recommend an appropriate direction—not a guessed configuration.</p><Link href="/system-finder" className="button dark">Use the System Finder <ArrowRight size={17}/></Link></div><div className="planner-scale"><div><strong>2kW+</strong><span> essentials</span></div><div><strong>6kW+</strong><span> heavy loads</span></div><div><strong>10kWh+</strong><span> longer runtime</span></div><div><strong>240V</strong><span> home circuits</span></div></div></section>

    <section className="section resource"><p className="eyebrow">Plan with confidence</p><div className="resource-grid"><article><span>01</span><h3>Understand output</h3><p>Watts describe the equipment you can run at once. Starting and surge power can matter for motors and compressors.</p></article><article><span>02</span><h3>Size battery storage</h3><p>Watt-hours tell you how much energy you have. Your loads and desired backup duration determine the right range.</p></article><article><span>03</span><h3>Plan the connection</h3><p>Home integration can require appropriately rated transfer equipment and qualified installation.</p></article></div></section>
    <footer><div><Link href="/" className="brand"><span className="brand-mark"><Zap size={18} fill="currentColor"/></span>GRIDWELL</Link><p>Energy equipment selected for practical, resilient power planning.</p></div><div><h3>Shop</h3><Link href="/whole-home-backup">Whole-home backup</Link><Link href="/portable-power">Portable power</Link><Link href="/solar-panels">Solar panels</Link></div><div><h3>Planning</h3><Link href="/system-finder">System Finder</Link><Link href="/compare">Product comparison</Link><Link href="/invoice">Request an invoice</Link></div><small>Product data is source-attributed and reviewed before publication. Specifications may change; confirm details before purchase.</small></footer>

    {cartOpen && <Cart items={items} cart={cart} close={() => setCartOpen(false)} change={change}/>} 
  </main>;
}

export function ProductCard({ id, name, brand, category, output, capacity, voltage, add }: { id: string; name: string; brand: string; category: string; output?: number | null; capacity?: number | null; voltage?: string | null; add?: (id: string) => void }) {
  return <article className="product-card"><div className="product-art"><div className="product-device"><span/><span/><span/></div><p>{category}</p></div><div className="product-content"><p className="product-brand">{brand}</p><h3>{name}</h3><div className="product-stats"><span>{output ? `${(output / 1000).toFixed(output % 1000 ? 1 : 0)}kW output` : 'Output not provided'}</span><span>{capacity ? `${(capacity / 1000).toFixed(2).replace(/\.00$/, '')}kWh battery` : 'Battery configuration varies'}</span><span>{voltage ?? 'Voltage not provided'}</span></div><div className="product-bottom"><Link href={`/products/${id}`}>View details <ArrowRight size={16}/></Link>{add && <button onClick={() => add(id)}>Add to cart</button>}</div></div></article>;
}

function Cart({ items, cart, close, change }: { items: typeof approvedCatalog; cart: Record<string, number>; close: () => void; change: (id: string, amount: number) => void }) {
  return <div className="cart-shell"><button className="cart-backdrop" onClick={close} aria-label="Close cart"/><dialog className="cart" open aria-label="Shopping cart"><div className="cart-head"><div><p className="eyebrow">Your selection</p><h2>Cart</h2></div><button onClick={close} aria-label="Close cart"><X/></button></div>{items.length ? <div className="cart-items">{items.map((item) => <div className="cart-item" key={item.id}><div className="tiny-device"/><div><b>{item.name}</b><small>{item.brand} · pricing on request</small><div><button onClick={() => change(item.id, -1)} aria-label="Remove one"><Minus size={14}/></button><span>{cart[item.id]}</span><button onClick={() => change(item.id, 1)} aria-label="Add one"><Plus size={14}/></button></div></div></div>)}</div> : <div className="cart-empty"><ShoppingBag size={30}/><p>Your cart is ready when you are.</p></div>}<div className="cart-foot"><p>Final pricing, delivery, tax and availability are confirmed during checkout.</p><Link className="button dark full" href="/invoice" onClick={close}>Request invoice <ArrowRight size={16}/></Link><Link className="text-checkout" href="/checkout" onClick={close}>Continue to checkout</Link></div></dialog></div>;
}
