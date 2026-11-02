const Stat = ({ n, label, color = '' }) => (
  <div className="min-w-[90px] flex-1 rounded-2xl border-[2.5px] border-ink bg-sun p-2 text-center text-ink">
    <b className={`block text-3xl ${color}`}>{n}</b>{label}
  </div>
);
export default function Dashboard({ question, sources, result }) {
  const missing = result.gaps.filter((g) => g.kind === 'missing').length;
  return (
    <div className="card">
      <h2 className="mb-2 font-bold">Dashboard · “{question}”</h2>
      <div className="flex flex-wrap gap-2">
        <Stat n={sources.length} label="sources" /><Stat n={missing} label="potential gaps" color="text-amber" />
        <Stat n={result.conflicts.length} label="possible conflicts" color="text-crayon" /><Stat n={result.fresh.length} label="freshness flags" color="text-sky" />
        <Stat n={result.todo.length} label="to verify" />
      </div>
      <p className="mt-2 text-xs opacity-70">Findings are automated signals from the text provided, not guaranteed facts. Always confirm on the official source.</p>
    </div>
  );
}
