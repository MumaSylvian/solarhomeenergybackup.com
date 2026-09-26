// Verifies writer output against the input facts and the brief's hard rules.
// Usage: node check.mjs [batch-01 ...]   (default: every batch in out/)
import fs from 'node:fs';
const dir = new URL('.', import.meta.url);
const batches = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(new URL('out/', dir)).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();

const retailer = /home\s*depot|signature\s*solar|current\s*connected|lowe'?s\b|walmart|best\s*buy|amazon(?!\s+alexa)/i;
const policy = /\b(ship(?:s|ping|ped)?|deliver(?:y|ed|ies)?|in stock|stock(?:ed)?|availability|warrant(?:y|ies)|return(?:s|ed)?|refund|financ\w*|price[ds]?|discount|free of charge|installation service|we install)\b/i;
const banned = /\b(delve|unlock|elevate|game[- ]changer|revolutionary|cutting[- ]edge|seamless(?:ly)?|robust|comprehensive|leverag\w*|harness\w*|showcas\w*|testament|pivotal|crucial|look no further|in today'?s world|whether you'?re looking for)\b/i;
const numberRe = /\d[\d,]*(?:\.\d+)?/g;
const norm = (n) => n.replace(/,/g, '').replace(/\.0+$/, '');

const totals = { products: 0, ok: 0, failed: 0, flagged: 0 };
const failures = [];
const intros = new Map();

for (const batch of batches) {
  const input = JSON.parse(fs.readFileSync(new URL(`in/${batch}.json`, dir), 'utf8'));
  let output;
  try {
    output = JSON.parse(fs.readFileSync(new URL(`out/${batch}.json`, dir), 'utf8'));
  } catch (error) {
    failures.push({ batch, id: '*', problems: [`unreadable output: ${error.message}`] });
    continue;
  }
  if (output.length !== input.length) failures.push({ batch, id: '*', problems: [`count ${output.length} != ${input.length}`] });
  const byId = new Map(output.map((o) => [o.id, o]));
  for (const src of input) {
    totals.products++;
    const o = byId.get(src.id);
    const problems = [];
    if (!o) { failures.push({ batch, id: src.id, problems: ['missing'] }); totals.failed++; continue; }
    for (const field of ['intro', 'idealUse', 'cta']) if (!o[field] || typeof o[field] !== 'string') problems.push(`missing ${field}`);
    const copyText = [o.intro, ...(o.benefits ?? []), ...(o.features ?? []), o.idealUse, ...(o.included ?? []), o.cta].filter(Boolean).join('\n');

    // Allowed numbers: name, manufacturer text, and ratings only when the name confirms them.
    const sourceText = `${src.name} ${src.manufacturerText}`;
    const allowed = new Set((sourceText.match(numberRe) ?? []).map(norm));
    if (src.ratingConfirmedByName) {
      for (const v of [src.ratedOutputW, src.capacityWh]) if (v) { allowed.add(String(v)); allowed.add(String(v / 1000)); }
    }
    const unknown = [...new Set((copyText.match(numberRe) ?? []).map(norm))].filter((n) => !allowed.has(n) && !/^[1-9]$/.test(n));
    if (unknown.length) problems.push(`numbers not in source: ${unknown.slice(0, 5).join(', ')}`);

    if (retailer.test(copyText)) problems.push(`retailer: ${copyText.match(retailer)[0]}`);
    const p = copyText.match(policy); if (p) problems.push(`policy word: "${p[0]}"`);
    const b = copyText.match(banned); if (b) problems.push(`banned word: "${b[0]}"`);
    if (/—|–\s/.test(copyText)) problems.push('em/en dash');
    if (/!/.test(copyText)) problems.push('exclamation mark');
    if (/https?:|www\.|@\w+\.\w|click here/i.test(copyText)) problems.push('link or contact');
    if (src.condition !== 'new' && !new RegExp(src.condition === 'refurbished' ? 'refurbish' : 'used|pre-owned', 'i').test(o.intro ?? '')) problems.push(`intro does not state ${src.condition}`);
    const key = (o.intro ?? '').toLowerCase();
    if (intros.has(key)) problems.push(`duplicate intro of ${intros.get(key)}`); else intros.set(key, src.id);
    if ((o.flags ?? []).length) totals.flagged++;

    if (problems.length) { totals.failed++; failures.push({ batch, id: src.id, problems }); } else totals.ok++;
  }
}
fs.writeFileSync(new URL('failures.json', dir), JSON.stringify(failures, null, 1));
console.log(JSON.stringify(totals));
const reasons = {};
for (const f of failures) for (const p of f.problems) { const k = p.replace(/:.*$/, '').replace(/"[^"]*"/, ''); reasons[k] = (reasons[k] ?? 0) + 1; }
console.log('failure reasons', JSON.stringify(reasons));
for (const f of failures.slice(0, 12)) console.log(`- ${f.batch} ${f.id}: ${f.problems.join('; ')}`);
