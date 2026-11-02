import Badge from './Badge';
import Evidence from './Evidence';
const Item = ({ tone, children }) => <div className={`my-2 rounded-r-xl border-l-[6px] bg-sun/15 px-3 py-1 ${tone}`}>{children}</div>;

export function Conflicts({ items, sources }) {
  return (<div className="card"><h2 className="mb-1 font-bold">⚠ Possible conflicts <Badge kind="signal" /></h2>
    {items.length ? items.map((c, i) => <Item key={i} tone="border-crayon"><b>{c.facet}</b>: {c.message}{c.evidence.map((e, j) => <Evidence key={j} sources={sources} {...e} />)}</Item>)
      : <p className="text-sm opacity-70">No conflicting values detected.</p>}</div>);
}
export function Gaps({ items, sources }) {
  return (<div className="card"><h2 className="mb-1 font-bold">🕳️ Dark spots (information gaps) <Badge kind="uncertain" /></h2>
    {items.length ? items.map((g, i) => <Item key={i} tone="border-amber"><Badge kind={g.priority === 'Critical' ? 'critical' : 'uncertain'}>{g.priority}</Badge>{g.message}{(g.evidence || []).map((e, j) => <Evidence key={j} sources={sources} {...e} />)}</Item>)
      : <p className="text-sm opacity-70">No gaps found.</p>}</div>);
}
export function Freshness({ items, sources }) {
  return (<div className="card"><h2 className="mb-1 font-bold">🕒 Freshness warnings <Badge kind="signal" /></h2>
    {items.length ? items.map((f, i) => <Item key={i} tone="border-sky"><b>S{f.src + 1} · {sources[f.src].title}</b>: <Badge kind="uncertain">{f.level}</Badge>{f.message}</Item>)
      : <p className="text-sm opacity-70">All sources show recent dates.</p>}</div>);
}
export function Coverage({ items, sources }) {
  return (<div className="card"><h2 className="mb-1 font-bold">📋 What the sources say <Badge kind="sourced" /></h2>
    {items.map((c) => (<details key={c.name} open={!!c.evidence.length} className="my-1">
      <summary className="cursor-pointer"><b>{c.name}</b> · {c.evidence.length ? c.srcs.map((i) => `S${i + 1}`).join(', ') : <span className="text-amber">not found</span>}</summary>
      {c.evidence.slice(0, 4).map((e, j) => <Evidence key={j} sources={sources} {...e} />)}</details>))}
    <div className="mt-3 border-t-2 border-dashed pt-2 text-xs">{sources.map((s, i) => <div key={i}><b>S{i + 1}</b> {s.title} · {s.url || 'pasted'} · {s.date || 'no date given'}</div>)}</div></div>);
}
