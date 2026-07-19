export default function ResultStatCard({ icon: Icon, label, value, tone = 'default' }) {
  const toneStyles = {
    default: 'text-[#e8e8e8]',
    good: 'text-[#89d185]',
    bad: 'text-[#f48771]',
    muted: 'text-[#9d9d9d]',
    accent: 'text-[#4fc1ff]',
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
      <div className="flex items-center gap-2 text-[#858585]">
        <Icon size={14} strokeWidth={1.75} />
        <p className="text-[11px] uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-xl font-semibold ${toneStyles[tone]}`}>{value}</p>
    </div>
  )
}
