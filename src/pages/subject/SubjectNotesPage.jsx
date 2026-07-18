import { useOutletContext } from 'react-router-dom'
import { useNotes } from '../../hooks/useNotes'
import { getSubjectNoteStats } from '../../data/notesData'
import ChapterNotesCard from '../../components/notes/ChapterNotesCard'

export default function SubjectNotesPage() {
  const { subject } = useOutletContext()
  const { notes } = useNotes()
  const stats = getSubjectNoteStats(notes, subject)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map(({ chapter, totalNotes, lastEdited, revisionStatus }) => (
        <ChapterNotesCard
          key={chapter.slug}
          subjectId={subject.id}
          chapter={chapter}
          totalNotes={totalNotes}
          lastEdited={lastEdited}
          revisionStatus={revisionStatus}
        />
      ))}
    </div>
  )
}
