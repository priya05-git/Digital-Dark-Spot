import { useState } from 'react';
import SourcePanel from './components/SourcePanel';
import Dashboard from './components/Dashboard';
import Checklist from './components/Checklist';
import Badge from './components/Badge';
import { Conflicts, Gaps, Freshness, Coverage } from './components/Findings';
import { analyze } from './lib/analyzer';
import { SAMPLE_QUESTION, SAMPLE_SOURCES } from './lib/sample';

export default function App() {
  const [question, setQuestion] = useState('What should I verify before applying for this scholarship?');
  const [topic, setTopic] = useState('scholarship');
  const [sources, setSources] = useState([]);
  const [result, setResult] = useState(null);

  const run = () => {
    if (sources.length < 2) return alert('Add at least 2 sources (or click Load sample).');
    setResult({ ...analyze(sources, topic), question, snapshot: sources });
  };
  const sample = () => { setQuestion(SAMPLE_QUESTION); setTopic('scholarship'); setSources(SAMPLE_SOURCES); setResult(null); };

  return (
    <>
      <header className="-mx-1 -rotate-[.4deg] border-b-4 border-ink bg-sun px-6 py-4 text-ink">
        <h1 className="text-3xl font-bold [text-shadow:2px_2px_0_#fff]">🖍️ Digital Dark Spot <span className="ml-2 inline-block rotate-3 rounded-full border-2 border-ink bg-crayon px-3 py-0.5 text-xs text-white">Detective Mode</span></h1>
        <p className="opacity-80">Spot the missing pieces! Gaps, conflicts and stale facts in your sources, plus what to check next.</p>
      </header>
      <main className="mx-auto grid max-w-[1300px] gap-4 p-4 md:grid-cols-[minmax(300px,380px)_1fr]">
        <SourcePanel {...{ question, setQuestion, topic, setTopic, sources, setSources, onSample: sample, onRun: run }} />
        <section>
          {!result ? (
            <div className="card"><h2 className="mb-2 font-bold">✏️ How it works</h2>
              <p>Add 2+ sources (or load the sample), then hunt for dark spots. Every finding is labelled:</p>
              <p className="mt-2"><Badge kind="sourced" /> quoted from a source, with reference<br /><Badge kind="signal" /> heuristic detection: a potential issue, not a fact<br /><Badge kind="uncertain" /> not found or unconfirmed in these sources</p></div>
          ) : (<>
            <Dashboard question={result.question} sources={result.snapshot} result={result} />
            <Checklist key={result.todo.length + result.question} todo={result.todo} />
            <Conflicts items={result.conflicts} sources={result.snapshot} />
            <Gaps items={result.gaps} sources={result.snapshot} />
            <Freshness items={result.fresh} sources={result.snapshot} />
            <Coverage items={result.coverage} sources={result.snapshot} />
          </>)}
        </section>
      </main>
    </>
  );
}
