import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import NotePinButton from './NotePinButton'
import NoteBookmarkButton from './NoteBookmarkButton'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function snippet(content) {
  const plain = (content ?? '').replace(/[#*`>_-]/g, '').trim()
  return plain.length > 110 ? `${plain.slice(0, 110)}…` : plain || 'No content yet'
}

export default function NoteListItem({ note, subjectName, chapterName, onTogglePin, onToggleBookmark, showBreadcrumb = false }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3 transition-colors duration-150 hover:border-[#4a4a4a]">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
        <FileText size={14} strokeWidth={1.75} />
      </span>

      <Link to={`/subjects/${note.subjectId}/chapters/${note.chapterSlug}/notes/${note.id}`} className="min-w-0 flex-1">
        {showBreadcrumb && (
          <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            {subjectName} / {chapterName}
          </p>
        )}
        <h4 className="mt-0.5 truncate text-sm font-medium text-[#e8e8e8]">{note.title || 'Untitled Note'}</h4>
        <p className="mt-0.5 truncate text-xs text-[#858585]">{snippet(note.content)}</p>
        <p className="mt-1 text-[10px] text-[#6e6e6e]">Edited {formatDate(note.modifiedAt)}</p>
      </Link>

      <div className="flex shrink-0 items-center gap-1.5">
        <NotePinButton active={note.pinned} onToggle={() => onTogglePin(note.id)} />
        <NoteBookmarkButton active={note.bookmarked} onToggle={() => onToggleBookmark(note.id)} />
      </div>
    </div>
  )
}
