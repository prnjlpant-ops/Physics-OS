import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, X } from 'lucide-react'
import DifficultyBadge from './DifficultyBadge'
import { REVISION_STATUS } from '../../constants/mockTestConstants'

export default function RevisionQueueItem({ item, onToggleReviewed, onRemove }) {
  const isReviewed = item.status === REVISION_STATUS.REVIEWED

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            {item.subjectName} · {item.chapterName}
          </p>
          <Link
            to={`/mock-tests/${item.testId}`}
            className="mt-0.5 block truncate text-sm font-medium text-[#e8e8e8] hover:text-[#4fc1ff]"
          >
            {item.testTitle} · Q{item.questionNumber}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label="Remove from revision queue"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] text-[#858585] transition-colors duration-150 hover:border-[#f48771]/40 hover:text-[#f48771]"
        >
          <X size={14} strokeWidth={1.75} />
        </button>
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-[#9d9d9d]">{item.snippet}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#3c3c3c] pt-2.5">
        <div className="flex items-center gap-1.5">
          <DifficultyBadge difficulty={item.difficulty} />
        </div>
        <button
          type="button"
          onClick={() => onToggleReviewed(item.id)}
          className={[
            'flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors duration-150',
            isReviewed
              ? 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]'
              : 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585] hover:text-[#cccccc]',
          ].join(' ')}
        >
          {isReviewed ? (
            <CheckCircle2 size={12} strokeWidth={1.75} />
          ) : (
            <Circle size={12} strokeWidth={1.75} />
          )}
          {item.status}
        </button>
      </div>
    </div>
  )
}
