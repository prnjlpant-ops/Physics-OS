import { Link } from 'react-router-dom'

export default function ModuleSnapshotCard({ icon: Icon, label, value, sublabel, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
        <Icon size={16} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] uppercase tracking-wide text-[#858585]">{label}</p>
        <p className="truncate text-sm font-semibold text-[#e8e8e8]">{value}</p>
        {sublabel && <p className="truncate text-[10px] text-[#6e6e6e]">{sublabel}</p>}
      </div>
    </Link>
  )
}
