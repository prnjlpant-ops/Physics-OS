import { Link } from 'react-router-dom'
import { DIFFICULTY_STYLES } from '../../constants/pyqConstants'
import PyqBookmarkButton from './PyqBookmarkButton'
import PyqRevisionQueueButton from './PyqRevisionQueueButton'
import PyqStatusBadge from './PyqStatusBadge'

export default function PyqCard({
  pyq,
  status,
  onCycleStatus,
  isBookmarked,
  onToggleBookmark,
  isQueued,
  onToggleQueued,
  showChapter = false,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-colors duration-150 hover:border-[#4a4a4a]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {showChapter && (
            <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">
              {pyq.subjectName} · {pyq.chapterName}
            </p>
          )}
          <Link
            to={`/subjects/${pyq.subjectId}/chapters/${pyq.chapterSlug}/pyqs/${pyq.id}`}
            className="mt-0.5 block text-sm font-medium leading-snug text-[#e8e8e8] hover:text-[#4fc1ff]"
          >
            Q{pyq.questionNumber} · {pyq.exam} {pyq.year}
          </Link>
          <p className="mt-0.5 font-mono text-[10px] text-[#6e6e6e]">{pyq.id}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <PyqRevisionQueueButton active={isQueued} onToggle={() => onToggleQueued(pyq.id)} />
          <PyqBookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(pyq.id)} />
        </div>
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-[#9d9d9d]">{pyq.questionText}</p>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#3c3c3c] pt-2.5">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${DIFFICULTY_STYLES[pyq.difficulty]}`}>
          {pyq.difficulty}
        </span>
        <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
          {pyq.marks} marks
        </span>
        <PyqStatusBadge status={status} onCycle={() => onCycleStatus(pyq)} />
        {pyq.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#6e6e6e]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
