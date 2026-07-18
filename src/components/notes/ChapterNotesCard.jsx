import { Link } from 'react-router-dom'
import { ChevronRight, FileStack } from 'lucide-react'
import { REVISION_STATUS } from '../../constants/notesConstants'

const STATUS_STYLES = {
  [REVISION_STATUS.NONE]: 'border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]',
  [REVISION_STATUS.FRESH]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  [REVISION_STATUS.DUE]: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

function formatDate(iso) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export default function ChapterNotesCard({ subjectId, subjectName, chapter, totalNotes, lastEdited, revisionStatus }) {
  return (
    <Link
      to={`/subjects/${subjectId}/chapters/${chapter.slug}/notes`}
      className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {subjectName && (
            <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">{subjectName}</p>
          )}
          <h3 className="mt-0.5 text-sm font-medium text-[#e8e8e8]">{chapter.name}</h3>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[revisionStatus]}`}>
          {revisionStatus}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-[#3c3c3c] pt-2.5 text-xs text-[#858585] transition-colors duration-150 group-hover:text-[#cccccc]">
        <span className="inline-flex items-center gap-1.5">
          <FileStack size={13} strokeWidth={1.75} />
          {totalNotes} {totalNotes === 1 ? 'note' : 'notes'} · Edited {formatDate(lastEdited)}
        </span>
        <ChevronRight size={14} strokeWidth={1.75} />
      </div>
    </Link>
  )
}
