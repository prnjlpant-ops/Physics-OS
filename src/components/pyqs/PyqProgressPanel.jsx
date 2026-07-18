const STATS = [
  { key: 'total', label: 'Total Questions' },
  { key: 'solved', label: 'Solved' },
  { key: 'remaining', label: 'Remaining' },
  { key: 'bookmarked', label: 'Bookmarked' },
  { key: 'revisionQueue', label: 'Revision Queue' },
]

export default function PyqProgressPanel({ progress }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
      {STATS.map((stat) => (
        <div
          key={stat.key}
          className="flex flex-col gap-1 rounded-lg border border-[#3c3c3c] bg-[#252526] px-3 py-2.5"
        >
          <span className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{stat.label}</span>
          <span className="text-lg font-semibold text-[#e8e8e8]">{progress[stat.key]}</span>
        </div>
      ))}
    </div>
  )
}
