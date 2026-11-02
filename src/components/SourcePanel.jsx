import { useState } from 'react';
import { TOPICS } from '../lib/facets';
const blank = { title: '', url: '', date: '', text: '' };

export default function SourcePanel({ question, setQuestion, topic, setTopic, sources, setSources, onSample, onRun }) {
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const add = () => {
    if (!form.text.trim()) return alert('Paste some text first');
    setSources([...sources, { ...form, title: form.title || `Source ${sources.length + 1}` }]);
    setForm(blank);
  };
  const fetchUrl = async () => {
    if (!form.url) return alert('Enter a URL first');
    setBusy(true);
    try {
      const r = await fetch('/api/fetch?url=' + encodeURIComponent(form.url));
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setForm({ title: d.title, url: d.url, date: d.date, text: d.text });
    } catch (e) { alert(`Fetch failed: ${e.message}\nIs the API running (npm run dev)? You can also paste the text.`); }
    setBusy(false);
  };

  return (
    <section>
      <div className="card">
        <h2 className="mb-2 font-bold">1 · Research goal</h2>
        <input className="field" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <select className="field" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {Object.entries(TOPICS).map(([k, t]) => <option key={k} value={k}>Topic type: {t.label}</option>)}
        </select>
      </div>
      <div className="card">
        <h2 className="mb-2 font-bold">2 · Sources ({sources.length})</h2>
        {sources.map((s, i) => (
          <div key={i} className="mb-2 border-l-[6px] border-ink bg-sun/20 py-1 pl-2 dark:border-paper">
            <b>S{i + 1}</b> {s.title}
            <div className="text-xs opacity-70">{s.url || 'pasted text'} · {s.date || 'no date'} · <button className="underline" onClick={() => setSources(sources.filter((_, j) => j !== i))}>remove</button></div>
          </div>
        ))}
        <input className="field" placeholder="Title (e.g. Official scholarship page)" value={form.title} onChange={set('title')} />
        <input className="field" placeholder="URL (optional)" value={form.url} onChange={set('url')} />
        <input className="field" placeholder="Date shown on page (optional)" value={form.date} onChange={set('date')} />
        <textarea className="field h-24" placeholder="Paste page text, or fetch from URL" value={form.text} onChange={set('text')} />
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={add}>Add source</button>
          <button className="btn btn-alt" onClick={fetchUrl} disabled={busy}>{busy ? 'Fetching…' : 'Fetch URL'}</button>
          <button className="btn btn-alt" onClick={onSample}>Load sample</button>
        </div>
      </div>
      <button className="btn w-full py-3 text-lg" onClick={onRun}>🕵️ Hunt for dark spots!</button>
    </section>
  );
}
