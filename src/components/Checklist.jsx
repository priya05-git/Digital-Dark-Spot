import { useState } from 'react';
import Badge from './Badge';
export default function Checklist({ todo }) {
  const [done, setDone] = useState({});
  const count = Object.values(done).filter(Boolean).length;
  return (
    <div className="card">
      <div className="mb-2 rotate-[-.6deg] rounded-2xl border-[2.5px] border-ink bg-sun px-3 py-2 font-bold text-ink">Never trust one page! Tick these off before you decide 👇</div>
      <h2 className="mb-1 font-bold">✅ Verify next (prioritized) <Badge kind="signal" /></h2>
      <div className="mb-2 h-3 overflow-hidden rounded-full border-2 border-ink dark:border-paper"><div className="h-full bg-leaf transition-all" style={{ width: `${todo.length ? (count / todo.length) * 100 : 0}%` }} /></div>
      {todo.map((t, i) => (
        <label key={i} className={`flex items-start gap-2 py-1 ${done[i] ? 'line-through opacity-50' : ''}`}>
          <input type="checkbox" className="mt-1.5" checked={!!done[i]} onChange={() => setDone({ ...done, [i]: !done[i] })} /><span><b>{i + 1}.</b> {t.text}</span>
        </label>
      ))}
    </div>
  );
}
