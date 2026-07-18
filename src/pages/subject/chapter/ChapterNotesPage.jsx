import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, NotebookPen, Plus } from 'lucide-react'
import { getChapterBySlug } from '../../../constants/subjects'
import { useNotes } from '../../../hooks/useNotes'
import NoteListItem from '../../../components/notes/NoteListItem'
import EmptyState from '../EmptyState'
import PageTitle from '../../../components/PageTitle'

export default function ChapterNotesPage() {
  const { subjectId, chapterSlug } = useParams()
  const navigate = useNavigate()
  const found = getChapterBySlug(subjectId, chapterSlug)
  const { notes, addNote, togglePin, toggleBookmark } = useNotes()

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found
  const chapterNotes = notes
    .filter((note) => note.subjectId === subject.id && note.chapterSlug === chapter.slug)
    .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))

  const handleCreate = () => {
    const note = addNote({ subjectId: subject.id, chapterSlug: chapter.slug, title: 'Untitled Note' })
    navigate(`/subjects/${subject.id}/chapters/${chapter.slug}/notes/${note.id}`)
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link
          to={`/subjects/${subject.id}/chapters`}
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          {subject.name}
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#e8e8e8]">{chapter.name} Notes</h2>
            <p className="mt-0.5 text-xs text-[#858585]">{chapterNotes.length} notes in this chapter</p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#0e639c]/50 bg-[#0e639c]/10 px-3 py-1.5 text-xs font-medium text-[#4fc1ff] transition-colors duration-150 hover:border-[#0e639c]"
          >
            <Plus size={14} strokeWidth={1.75} />
            New Note
          </button>
        </div>
      </div>

      {chapterNotes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notes added yet"
          description={`Notes for ${chapter.name} will appear here.`}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {chapterNotes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              onTogglePin={togglePin}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
