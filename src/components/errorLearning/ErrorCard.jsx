import { Link } from 'react-router-dom'
import ErrorDifficultyBadge from './ErrorDifficultyBadge'
import ErrorStatusBadge from './ErrorStatusBadge'
import ErrorSourceBadge from './ErrorSourceBadge'
import ErrorBookmarkButton from './ErrorBookmarkButton'

export default function ErrorCard({ error, status, onCycleStatus, isBookmarked, onToggleBookmark }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#4a4a4a] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            {error.subjectName} · {error.chapterName}
          </p>
          <Link
            to={`/error-learning/${error.id}`}
            className="mt-0.5 block truncate text-sm font-medium text-[#e8e8e8] hover:text-[#4fc1ff]"
          >
            {error.errorType}
          </Link>
          <p className="mt-0.5 font-mono text-[10px] text-[#6e6e6e]">{error.id}</p>
        </div>
        <ErrorBookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(error.id)} />
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-[#9d9d9d]">{error.question}</p>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#3c3c3c] pt-2.5">
        <ErrorSourceBadge source={error.source} />
        <ErrorDifficultyBadge difficulty={error.difficulty} />
        <ErrorStatusBadge status={status} onCycle={() => onCycleStatus(error)} />
        <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#6e6e6e]">
          {error.date}
        </span>
      </div>

      <Link
        to={`/error-learning/${error.id}`}
        className="mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 py-1.5 text-xs font-medium text-[#4fc1ff] transition-colors duration-150 hover:bg-[#0e639c]/20"
      >
        View Details
      </Link>
    </div>
  )
}
