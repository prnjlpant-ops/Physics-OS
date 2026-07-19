import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import ErrorDifficultyBadge from './ErrorDifficultyBadge'
import ErrorStatusBadge from './ErrorStatusBadge'
import ErrorBookmarkButton from './ErrorBookmarkButton'
import PriorityBadge, { nextPriority } from './PriorityBadge'

export default function ErrorRevisionQueueItem({
  item,
  status,
  onCycleStatus,
  isBookmarked,
  onToggleBookmark,
  onSetPriority,
  onRemove,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            {item.subjectName} · {item.chapterName}
          </p>
          <Link
            to={`/error-learning/${item.id}`}
            className="mt-0.5 block truncate text-sm font-medium text-[#e8e8e8] hover:text-[#4fc1ff]"
          >
            {item.errorType}
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <ErrorBookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(item.id)} />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label="Remove from revision queue"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] text-[#858585] transition-colors duration-150 hover:border-[#f48771]/40 hover:text-[#f48771]"
          >
            <X size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-[#9d9d9d]">{item.question}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#3c3c3c] pt-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <ErrorDifficultyBadge difficulty={item.difficulty} />
          <PriorityBadge
            priority={item.priority}
            onCycle={() => onSetPriority(item.id, nextPriority(item.priority))}
          />
        </div>
        <ErrorStatusBadge status={status} onCycle={() => onCycleStatus(item)} />
      </div>
    </div>
  )
}
