export default function ErrorBarRow({ label, sublabel, value, max = 100, suffix = '', tone = 'accent' }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  const toneStyles = {
    accent: 'bg-[#0e639c]',
    good: 'bg-[#89d185]',
    warn: 'bg-[#e2c08d]',
    bad: 'bg-[#f48771]',
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="truncate text-[#cccccc]">{label}</span>
        <span className="shrink-0 text-[#858585]">
          {value}
          {suffix}
          {sublabel ? <span className="ml-1 text-[#6e6e6e]">· {sublabel}</span> : null}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3c3c3c]">
        <div
          className={`h-full rounded-full ${toneStyles[tone]} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
