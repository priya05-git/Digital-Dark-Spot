# 🖍️ Digital Dark Spot: AI-Assisted Information Gap Detection
Shinchan Online Hackathon 2026 · Team DEVENGERS

Search finds information and summarizers condense it. **Digital Dark Spot shows what is missing**: gaps, conflicting claims, outdated details and unanswered questions, each traceable to a source reference, with a prioritized checklist of what to verify next.

## Quick start
```bash
npm install
npm run dev      # web UI on http://localhost:5173 + URL-fetch API on :3001
npm run build    # production bundle in dist/
```
Click **Load sample** to see the full demo flow in 10 seconds.

## Tech stack
React 18 · Vite 5 · Tailwind CSS 3 (custom crayon-doodle theme, auto dark mode) · Node.js fetch API (zero extra deps)

## Project structure
```
server/index.js            URL fetch + text/date extraction (SSRF-guarded)
src/lib/facets.js          topic profiles (scholarship / job / service) and facet rules
src/lib/analyzer.js        analysis engine: coverage, gaps, conflicts, freshness, checklist
src/lib/sample.js          demo sources
src/components/            SourcePanel, Dashboard, Checklist, Findings, Evidence, Badge
src/App.jsx                state + layout
```

## How detection works (transparent, rule-based)
- **Coverage / gaps**: each topic profile lists facets a decision needs (deadline, documents, renewal, ...). Matching sentences are collected per source. Zero matches = gap; one source only = unconfirmed.
- **Conflicts**: money, dates and percentages within a facet are compared across sources; document lists are diffed.
- **Freshness**: latest year, "updated" date and cycle strings (e.g. 2023-24); undated sources are flagged.
- **Labels**: `SOURCED` (quote + [S#] reference), `SIGNAL` (heuristic, potential issue), `UNCERTAIN` (not found). Nothing is presented as guaranteed fact.

## Limitations and future scope
Keyword matching can miss paraphrases. Next: LLM claim extraction and semantic contradiction detection (still labelled as signals), search-API source discovery, PDF upload, multilingual support, exportable reports.
