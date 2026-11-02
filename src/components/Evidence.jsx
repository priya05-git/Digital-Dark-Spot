/** A quoted sentence with a clickable reference to the source it came from. */
export default function Evidence({ sources, src, text }) {
  const s = sources[src];
  return (
    <span className="quote">
      <span title={s.title} className="font-bold text-crayon">[S{src + 1}]</span> “{text.length > 220 ? text.slice(0, 220) + '…' : text}”
      {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="ml-1 text-sky underline dark:text-blue-300">open source</a>}
    </span>
  );
}
