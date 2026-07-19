export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
      <div className="flex items-center gap-2">
        <span
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border',
            accent
              ? 'border-[#0e639c]/40 bg-[#0e639c]/15 text-[#4fc1ff]'
              : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]',
          ].join(' ')}
        >
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <p className="text-[11px] uppercase tracking-wide text-[#858585]">{label}</p>
      </div>
      <p className="text-2xl font-semibold text-[#e8e8e8]">{value}</p>
    </div>
  )
}
