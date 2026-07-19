import { Link } from 'react-router-dom'
import { ListChecks, Clock3, Award } from 'lucide-react'
import DifficultyBadge from './DifficultyBadge'
import StatusBadge from './StatusBadge'
import MockBookmarkButton from './MockBookmarkButton'

export default function MockTestCard({ test, isBookmarked, onToggleBookmark }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#4a4a4a] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            {test.exam} · {test.type}
          </p>
          <Link
            to={`/mock-tests/${test.id}`}
            className="mt-0.5 block truncate text-sm font-medium text-[#e8e8e8] hover:text-[#4fc1ff]"
          >
            {test.title}
          </Link>
        </div>
        <MockBookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(test.id)} />
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px] text-[#9d9d9d]">
        <div className="flex items-center gap-1.5">
          <ListChecks size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
          {test.questions} Qs
        </div>
        <div className="flex items-center gap-1.5">
          <Clock3 size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
          {test.duration} min
        </div>
        <div className="flex items-center gap-1.5">
          <Award size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
          {test.marks} marks
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#3c3c3c] pt-2.5">
        <DifficultyBadge difficulty={test.difficulty} />
        <StatusBadge status={test.status} />
        {test.lastAttempt && (
          <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#6e6e6e]">
            Last: {test.lastAttempt.percentage}%
          </span>
        )}
      </div>

      <Link
        to={`/mock-tests/${test.id}`}
        className="mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 py-1.5 text-xs font-medium text-[#4fc1ff] transition-colors duration-150 hover:bg-[#0e639c]/20"
      >
        View Details
      </Link>
    </div>
  )
}
