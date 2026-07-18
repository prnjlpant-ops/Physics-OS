import { Link } from 'react-router-dom'
import { ChevronRight, FlaskConical } from 'lucide-react'

export default function ChapterPyqsCard({ subjectId, subjectName, chapter, totalQuestions, solved }) {
  return (
    <Link
      to={`/subjects/${subjectId}/chapters/${chapter.slug}/pyqs`}
      className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {subjectName && (
            <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">{subjectName}</p>
          )}
          <h3 className="mt-0.5 text-sm font-medium text-[#e8e8e8]">{chapter.name}</h3>
        </div>
        <span className="shrink-0 rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] font-medium text-[#9d9d9d]">
          {solved}/{totalQuestions} solved
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-[#3c3c3c] pt-2.5 text-xs text-[#858585] transition-colors duration-150 group-hover:text-[#cccccc]">
        <span className="inline-flex items-center gap-1.5">
          <FlaskConical size={13} strokeWidth={1.75} />
          {totalQuestions} PYQs
        </span>
        <ChevronRight size={14} strokeWidth={1.75} />
      </div>
    </Link>
  )
}
