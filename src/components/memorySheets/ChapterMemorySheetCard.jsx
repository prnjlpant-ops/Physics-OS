import { Link } from 'react-router-dom'
import { Brain, ChevronRight } from 'lucide-react'
import { IMPORTANCE_STYLES } from '../../constants/memorySheetSections'

export default function ChapterMemorySheetCard({ subjectId, subjectName, sheet }) {
  return (
    <Link
      to={`/subjects/${subjectId}/chapters/${sheet.chapterSlug}/memory-sheet`}
      className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {subjectName && (
            <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">{subjectName}</p>
          )}
          <h3 className="mt-0.5 text-sm font-medium text-[#e8e8e8]">{sheet.chapterName}</h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${IMPORTANCE_STYLES[sheet.importance]}`}
        >
          {sheet.importance}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-[#3c3c3c] pt-2.5 text-xs text-[#858585] transition-colors duration-150 group-hover:text-[#cccccc]">
        <span className="inline-flex items-center gap-1.5">
          <Brain size={13} strokeWidth={1.75} />
          {sheet.estimatedRevisionTime} revision
        </span>
        <ChevronRight size={14} strokeWidth={1.75} />
      </div>
    </Link>
  )
}
