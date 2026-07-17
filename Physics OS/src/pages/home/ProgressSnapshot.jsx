const stats = [
  { label: 'Study Time Today', value: '0h' },
  { label: 'Current Streak', value: '0 Days' },
  { label: 'Completed Chapters', value: '0' },
  { label: 'Subjects Completed', value: '0%' },
]

export default function ProgressSnapshot() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Progress Snapshot</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <p className="text-xs text-[#858585]">{label}</p>
            <p className="mt-1.5 text-lg font-semibold text-[#e8e8e8]">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
