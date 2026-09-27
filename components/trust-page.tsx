/* oxlint-disable next/no-html-link-for-pages -- policy navigation must work without the client router. */
import { ArrowRight } from 'lucide-react';

/**
 * A policy section. `body` may be one paragraph or several; `items` renders a
 * bulleted list after the paragraphs, and `after` adds paragraphs below it.
 */
type Section = { title: string; body?: string | string[]; items?: string[]; after?: string | string[] };

const paragraphs = (value?: string | string[]) => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

export function TrustPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string | string[]; sections: Section[] }) {
  return <main className="page-shell trust-page"><header><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{paragraphs(intro).map((text) => <p key={text}>{text}</p>)}</header><div className="trust-layout"><section>{sections.map((section) => <article className="trust-section" key={section.title}><h2>{section.title}</h2>{paragraphs(section.body).map((text) => <p key={text}>{text}</p>)}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}{paragraphs(section.after).map((text) => <p key={text}>{text}</p>)}</article>)}</section><aside className="aside-card"><h2>Shop with clarity</h2><p>Review delivery, warranty, returns, and payment information before you place an order.</p><a href="/about">About us <ArrowRight size={15}/></a><a href="/shipping-delivery">Shipping & delivery <ArrowRight size={15}/></a><a href="/returns">Returns & refunds <ArrowRight size={15}/></a><a href="/warranty">Warranty <ArrowRight size={15}/></a><a href="/privacy">Privacy <ArrowRight size={15}/></a><a href="/cookies">Cookies & tracking <ArrowRight size={15}/></a><a href="/terms">Terms <ArrowRight size={15}/></a><a href="/payment-options">Payment & billing <ArrowRight size={15}/></a><a href="/invoice">Request an invoice <ArrowRight size={15}/></a></aside></div></main>;
}
