export default function AttemptProgressBar({ answered, total }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[11px] text-[#858585]">
        <span>
          {answered} of {total} answered
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3c3c3c]">
        <div
          className="h-full rounded-full bg-[#0e639c] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
