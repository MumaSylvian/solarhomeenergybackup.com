'use client';
/* oxlint-disable next/no-html-link-for-pages -- completion links must work without the client router. */

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { storefrontCategories } from '@/lib/catalog/categories';
import { whatsappUrl } from '@/lib/commerce';

const prompts: [string, string[]][] = [['What do you need to power?', ['Essential appliances', 'Home office', 'Refrigerator + lights', 'Most of my home', 'Entire home', 'RV / off-grid cabin']], ['How long should backup last?', ['4–6 hours', '6–12 hours', '12–24 hours', '1–2 days', 'Multiple days']], ['Any heavy 240V loads?', ['No / 120V only', 'Well pump', 'Central AC', 'Electric range or dryer', 'EV charger']], ['Will you use solar charging?', ['Yes', 'No', 'Not sure yet']]];

type CategoryLabel = (typeof storefrontCategories)[number]['label'];

/**
 * Categories worth browsing for these answers. A starting point only; the
 * final system is confirmed with support.
 */
function categoriesFor([loads, duration, heavy, solar]: string[]): CategoryLabel[] {
  const picks = new Set<CategoryLabel>();
  const wholeHome =
    loads === 'Most of my home' ||
    loads === 'Entire home' ||
    ['Well pump', 'Central AC', 'Electric range or dryer'].includes(heavy) ||
    duration === 'Multiple days';
  picks.add(wholeHome ? 'Whole-home backup' : 'Portable power');
  if (wholeHome || duration === '1–2 days' || duration === 'Multiple days') picks.add('Batteries');
  if (wholeHome) picks.add('Home integration');
  if (solar === 'Yes' || solar === 'Not sure yet' || loads === 'RV / off-grid cabin') picks.add('Solar panels');
  if (heavy === 'EV charger') picks.add('EV chargers');
  return [...picks];
}

export default function SystemFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const done = step === prompts.length;
  const pick = (value: string) => { setAnswers([...answers, value]); setStep(step + 1); };
  // Each step renders a new card; move focus to its heading so keyboard and
  // screen-reader users are not dropped back to the top of the page.
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const recommended = done ? categoriesFor(answers) : [];
  const summary = prompts.map(([question], index) => `${question} ${answers[index] ?? ''}`).join('\n');

  return (
    <main className="finder">
      <p className="eyebrow">System Finder</p>
      <h1>Start with your real loads.</h1>
      <p>Use this checklist to organize your energy needs, then browse the current catalog or ask support to confirm a compatible setup.</p>
      {!done ? (
        // Keyed so each question renders fresh (translated pages freeze text that changes in place).
        <section className="finder-card" key={step}>
          <p className="eyebrow">Step {step + 1} of {prompts.length}</p>
          <h2 ref={headingRef} tabIndex={-1}>{prompts[step][0]}</h2>
          <div className="choice-grid">
            {prompts[step][1].map((option) => (
              <button key={option} type="button" onClick={() => pick(option)}>
                {option}
                <ArrowRight size={16} style={{ float: 'right' }} />
              </button>
            ))}
          </div>
          <div className="finder-actions">
            <button type="button" onClick={() => { setStep(Math.max(0, step - 1)); setAnswers(answers.slice(0, -1)); }} disabled={!step}>Back</button>
            <span>{answers.length} answered</span>
          </div>
        </section>
      ) : (
        <section className="finder-card" key="done">
          <p className="eyebrow">Planning complete</p>
          <h2 ref={headingRef} tabIndex={-1}>Where to start</h2>
          <p>Based on your answers, these parts of the catalog fit best. Our team confirms compatibility and sizing before you order.</p>
          <div className="hero-actions">
            {recommended.map((label, index) => {
              const category = storefrontCategories.find((item) => item.label === label);
              return category ? (
                <a key={label} className={`button ${index === 0 ? 'primary' : 'secondary'}`} href={category.href}>
                  {label} <ArrowRight size={16} />
                </a>
              ) : null;
            })}
          </div>
          <div className="hero-actions">
            <a
              className="button secondary"
              href={whatsappUrl(`Hello SolarHome Energy Backup, I used the System Finder:\n${summary}\nCan you recommend a setup?`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> Send my answers on WhatsApp
            </a>
          </div>
          <button type="button" className="restart-button" onClick={() => { setStep(0); setAnswers([]); }}>Start over</button>
        </section>
      )}
    </main>
  );
}
