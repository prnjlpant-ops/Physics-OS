import { Link } from 'react-router-dom'
import { CalendarClock, ArrowRight } from 'lucide-react'

export default function UpcomingMockCard({ test }) {
  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#3c3c3c] bg-[#252526] px-6 py-8 text-center">
        <CalendarClock size={20} strokeWidth={1.75} className="text-[#858585]" />
        <p className="text-sm font-medium text-[#cccccc]">No mock planned yet</p>
        <p className="text-xs text-[#858585]">Pick a test from the library to schedule it.</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#4fc1ff]">
          <CalendarClock size={18} strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm font-medium text-[#e8e8e8]">{test.title}</p>
          <p className="text-[11px] text-[#858585]">
            {test.exam} · {test.questions} Qs · {test.duration} min
          </p>
        </div>
      </div>
      <Link
        to={`/mock-tests/${test.id}`}
        className="flex shrink-0 items-center gap-1 rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 px-2.5 py-1.5 text-xs font-medium text-[#4fc1ff] transition-colors duration-150 hover:bg-[#0e639c]/20"
      >
        Start
        <ArrowRight size={13} strokeWidth={1.75} />
      </Link>
    </div>
  )
}
