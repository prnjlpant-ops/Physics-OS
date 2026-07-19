import { Link } from 'react-router-dom'

export default function QuickActionButton({ icon: Icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-[#0e639c]/50 hover:bg-[#2d2d2d]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#4fc1ff]">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <span className="text-xs font-medium text-[#cccccc]">{label}</span>
    </Link>
  )
}
