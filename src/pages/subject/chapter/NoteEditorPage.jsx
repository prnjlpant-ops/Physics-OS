import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { getChapterBySlug } from '../../../constants/subjects'
import { useNotes } from '../../../hooks/useNotes'
import NoteEditor from '../../../components/notes/NoteEditor'
import PageTitle from '../../../components/PageTitle'

export default function NoteEditorPage() {
  const { subjectId, chapterSlug, noteId } = useParams()
  const navigate = useNavigate()
  const found = getChapterBySlug(subjectId, chapterSlug)
  const { notes, addNote, saveNote, removeNote, togglePin, toggleBookmark } = useNotes()
  const [createdId, setCreatedId] = useState(null)

  const subject = found?.subject
  const chapter = found?.chapter

  useEffect(() => {
    if (!subject || !chapter) return
    if (noteId !== 'new') return
    const note = addNote({ subjectId: subject.id, chapterSlug: chapter.slug, title: 'Untitled Note' })
    setCreatedId(note.id)
    navigate(`/subjects/${subject.id}/chapters/${chapter.slug}/notes/${note.id}`, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId])

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const activeId = noteId === 'new' ? createdId : noteId
  const note = notes.find((item) => item.id === activeId)

  if (!note) {
    return <PageTitle title="Loading Note..." />
  }

  const handleDelete = () => {
    removeNote(note.id)
    navigate(`/subjects/${subject.id}/chapters/${chapter.slug}/notes`)
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={`/subjects/${subject.id}/chapters/${chapter.slug}/notes`}
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          {chapter.name} Notes
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] px-2.5 py-1.5 text-xs text-[#858585] transition-colors duration-150 hover:border-[#f48771]/40 hover:text-[#f48771]"
        >
          <Trash2 size={13} strokeWidth={1.75} />
          Delete
        </button>
      </div>

      <NoteEditor
        note={note}
        onChange={(changes) => saveNote(note.id, changes)}
        onTogglePin={togglePin}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  )
}
