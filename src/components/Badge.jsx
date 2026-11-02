const KINDS = {
  sourced: 'text-leaf border-leaf', signal: 'text-sky border-sky dark:text-blue-300 dark:border-blue-300',
  uncertain: 'text-amber border-amber', critical: 'text-crayon border-crayon',
};
/** SOURCED = quoted from a source · SIGNAL = heuristic detection · UNCERTAIN = not found / unconfirmed */
export default function Badge({ kind = 'signal', children }) {
  return <span className={`mr-2 inline-block rounded-full border-2 bg-white px-2 text-[11px] font-bold uppercase dark:bg-night2 ${KINDS[kind]}`}>{children ?? kind}</span>;
}
