export default function CompletionBarRow({ label, sublabel, completion }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-[#e8e8e8]">{label}</p>
          {sublabel && <p className="truncate text-[10px] text-[#6e6e6e]">{sublabel}</p>}
        </div>
        <span className="shrink-0 text-xs font-semibold text-[#cccccc]">{completion}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3c3c3c]">
        <div
          className="h-full rounded-full bg-[#0e639c] transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>
    </div>
  )
}
