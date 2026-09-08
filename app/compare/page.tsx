import Link from 'next/link';
import { approvedCatalog } from '@/lib/catalog/products';

const rows = [
  ['Continuous output', (p: typeof approvedCatalog[number]) => p.continuousOutputWatts ? `${p.continuousOutputWatts.toLocaleString()}W` : 'Specification not provided.'],
  ['Surge output', (p: typeof approvedCatalog[number]) => p.surgeOutputWatts ? `${p.surgeOutputWatts.toLocaleString()}W` : 'Specification not provided.'],
  ['Battery capacity', (p: typeof approvedCatalog[number]) => p.batteryCapacityWh ? `${(p.batteryCapacityWh / 1000).toFixed(2).replace(/\.00$/, '')}kWh` : 'Configuration varies'],
  ['Expandable capacity', (p: typeof approvedCatalog[number]) => p.maxExpandableCapacityWh ? `${(p.maxExpandableCapacityWh / 1000).toFixed(1)}kWh` : 'Specification not provided.'],
  ['Voltage', (p: typeof approvedCatalog[number]) => p.acVoltage ?? 'Specification not provided.'],
  ['Solar input', (p: typeof approvedCatalog[number]) => p.solarInputWatts ? `${p.solarInputWatts.toLocaleString()}W` : 'Specification not provided.'],
  ['Battery chemistry', (p: typeof approvedCatalog[number]) => p.batteryChemistry ?? 'Specification not provided.'],
  ['Whole-home capable', (p: typeof approvedCatalog[number]) => p.wholeHomeCapable ? 'Yes, with appropriate configuration' : 'No'],
];
export default function ComparePage() { return <main className="page-shell"><header><p className="eyebrow">Compare products</p><h1>Decide with the numbers that matter.</h1><p>Side-by-side specifications from approved catalog records. Empty values are left empty rather than guessed.</p></header><div style={{ overflowX: 'auto' }}><table className="compare-table"><thead><tr><th>Specification</th>{approvedCatalog.map((p) => <th key={p.id}><Link href={`/products/${p.slug}`}>{p.name}</Link></th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><td><b>{label}</b></td>{approvedCatalog.map((p) => <td key={p.id}>{(value as (product: typeof p) => string)(p)}</td>)}</tr>)}</tbody></table></div></main>; }
