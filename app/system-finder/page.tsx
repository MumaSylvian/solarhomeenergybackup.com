'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const prompts: [string, string[]][] = [['What do you need to power?', ['Essential appliances', 'Home office', 'Refrigerator + lights', 'Most of my home', 'Entire home', 'RV / off-grid cabin']], ['How long should backup last?', ['4–6 hours', '6–12 hours', '12–24 hours', '1–2 days', 'Multiple days']], ['Any heavy 240V loads?', ['No / 120V only', 'Well pump', 'Central AC', 'Electric range or dryer', 'EV charger']], ['Will you use solar charging?', ['Yes', 'No', 'Not sure yet']]];

export default function SystemFinder() {
  const [step, setStep] = useState(0); const [answers, setAnswers] = useState<string[]>([]);
  const done = step === prompts.length;
  const pick = (value: string) => { setAnswers([...answers, value]); setStep(step + 1); };
  return <main className="finder"><p className="eyebrow">System Finder</p><h1>Start with your real loads.</h1><p>Use this checklist to organize your energy needs. Product recommendations are unavailable because the catalog has been removed.</p>{!done ? <section className="finder-card"><p className="eyebrow">Step {step + 1} of {prompts.length}</p><h2>{prompts[step][0]}</h2><div className="choice-grid">{prompts[step][1].map((option) => <button key={option} onClick={() => pick(option)}>{option}<ArrowRight size={16} style={{ float: 'right' }}/></button>)}</div><div className="finder-actions"><button onClick={() => { setStep(Math.max(0, step - 1)); setAnswers(answers.slice(0, -1)); }} disabled={!step}>Back</button><span>{answers.length} answered</span></div></section> : <section className="finder-card"><p className="eyebrow">Planning complete</p><h2>Your energy checklist is ready.</h2><p>Keep your answers for a future consultation. The catalog is currently unavailable, so no product recommendation is shown.</p><Link className="button primary" href="/support">Contact support <ArrowRight size={16}/></Link><button className="restart-button" onClick={() => { setStep(0); setAnswers([]); }}>Start over</button></section>}</main>;
}
