import { BASE_FACETS, TOPICS, DOCS } from './facets.js';

const MON = 'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec';
const VALUE_PATTERNS = {
  money: /(?:₹|rs\.?|inr|\$)\s?[\d,]+(?:\.\d+)?(?:\s?(?:lakh|lakhs|k))?/gi,
  date: new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MON})[a-z]*\\.?,?\\s+\\d{4}\\b|\\b(?:${MON})[a-z]*\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s+\\d{4}\\b`, 'gi'),
  percentage: /\d+(?:\.\d+)?\s?%/g,
};
const PRIORITY_RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const norm = (v) => v.toLowerCase().replace(/[\s,.]/g, '').replace(/(st|nd|rd|th)(?=\D*\d{4})/, '');
export const sentences = (t) => t.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => s.length > 15);

/** Judge how fresh a source looks from its date field + inline years / cycles. */
export function freshness(src, nowYear = new Date().getFullYear()) {
  const blob = `${src.date} ${src.text}`;
  const years = (blob.match(/\b20\d\d\b/g) || []).map(Number);
  const cycle = blob.match(/\b(20\d\d)\s*[-–/]\s*(\d{2,4})\b/);
  if (!years.length) return { level: 'Undated', message: 'No year or date found, so freshness cannot be judged.' };
  const latest = Math.max(...years), age = nowYear - latest;
  if (age >= 2) return { level: 'Likely outdated', message: `Latest year mentioned is ${latest}${cycle ? ` (cycle ${cycle[0]})` : ''}, ${age} years ago.` };
  if (!src.date.trim()) return { level: 'No explicit date', message: `Only an inline year (${latest}) was found; no "updated" date was given.` };
  return null;
}

function compareValues(facet, evidence, n) {
  const out = [];
  for (const [type, rg] of Object.entries(VALUE_PATTERNS)) {
    const per = Array.from({ length: n }, (_, i) => {
      const m = new Map();
      evidence.filter((e) => e.src === i).forEach((e) => (e.text.match(rg) || []).forEach((v) => m.set(norm(v), { v, text: e.text })));
      return m;
    });
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
      const A = per[a], B = per[b];
      if (A.size && B.size && ![...A.keys()].some((k) => B.has(k))) out.push({
        facet, a, b, kind: type,
        message: `Different ${type} values: S${a + 1} says ${[...A.values()].map((x) => x.v).join(' / ')}; S${b + 1} says ${[...B.values()].map((x) => x.v).join(' / ')}.`,
        evidence: [{ src: a, text: [...A.values()][0].text }, { src: b, text: [...B.values()][0].text }],
      });
    }
  }
  return out;
}
function compareDocs(facet, evidence, n) {
  const per = Array.from({ length: n }, (_, i) => new Set(evidence.filter((e) => e.src === i).flatMap((e) => DOCS.filter((d) => e.text.toLowerCase().includes(d)))));
  const out = [];
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
    if (!per[a].size || !per[b].size) continue;
    const onlyA = [...per[a]].filter((x) => !per[b].has(x)), onlyB = [...per[b]].filter((x) => !per[a].has(x));
    if (onlyA.length || onlyB.length) out.push({ facet, a, b, kind: 'documents',
      message: `Document lists differ. Only in S${a + 1}: ${onlyA.join(', ') || 'none'}. Only in S${b + 1}: ${onlyB.join(', ') || 'none'}.`,
      evidence: [evidence.find((e) => e.src === a), evidence.find((e) => e.src === b)].filter(Boolean) });
  }
  return out;
}

export function analyze(sources, topicKey) {
  const facets = [...BASE_FACETS, ...TOPICS[topicKey].facets];
  const split = sources.map((s) => sentences(s.text));
  const coverage = [], gaps = [], conflicts = [];

  for (const f of facets) {
    const evidence = [];
    split.forEach((ss, i) => ss.forEach((text) => { if (f.re.test(text)) evidence.push({ src: i, text }); }));
    const srcs = [...new Set(evidence.map((e) => e.src))];
    coverage.push({ ...f, evidence, srcs });
    if (!evidence.length) gaps.push({ facet: f.name, priority: f.priority, kind: 'missing', message: `No information about "${f.name.toLowerCase()}" found in the ${sources.length} sources reviewed.` });
    else if (srcs.length === 1 && sources.length > 1) gaps.push({ facet: f.name, priority: 'Medium', kind: 'single', message: `"${f.name}" appears in only one source (S${srcs[0] + 1}) and is unconfirmed by the others.`, evidence: evidence.slice(0, 2) });
    conflicts.push(...(f.name === 'Required documents' ? compareDocs(f.name, evidence, sources.length) : compareValues(f.name, evidence, sources.length)));
  }
  const fresh = sources.map((s, i) => ({ src: i, ...freshness(s) })).filter((f) => f.level);

  const todo = [
    ...conflicts.map((c) => ({ rank: 0, text: `Resolve conflict on "${c.facet}" (S${c.a + 1} vs S${c.b + 1}) using the latest official notice.` })),
    ...gaps.map((g) => ({ rank: PRIORITY_RANK[g.priority] + (g.kind === 'single' ? 0.5 : 0),
      text: g.kind === 'missing' ? `Find "${g.facet}" details on the official source (not covered in the sources reviewed).` : `Confirm "${g.facet}" with a second, official source.` })),
    ...fresh.map((f) => f.level === 'Likely outdated'
      ? { rank: 1, text: `Do not rely on S${f.src + 1} (${sources[f.src].title}) until you confirm it applies to the current cycle.` }
      : { rank: 2, text: `Check the publish/update date of S${f.src + 1}.` }),
  ].sort((a, b) => a.rank - b.rank);

  return { coverage, gaps, conflicts, fresh, todo };
}
