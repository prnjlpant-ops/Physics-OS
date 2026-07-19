export default function WeakTopicCard({ rank, name, sublabel, errorCount }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-3.5 py-2.5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#f48771]/30 bg-[#f48771]/10 text-[11px] font-semibold text-[#f48771]">
          {rank}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#e8e8e8]">{name}</p>
          {sublabel && <p className="truncate text-[11px] text-[#858585]">{sublabel}</p>}
        </div>
      </div>
      <span className="shrink-0 rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
        {errorCount} errors
      </span>
    </div>
  )
}
