import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FlaskConical } from 'lucide-react'
import { getChapterBySlug } from '../../../constants/subjects'
import { getChapterPyqs } from '../../../data/pyqsData'
import { getPyqProgress } from '../../../data/pyqProgress'
import { usePyqBookmarks } from '../../../hooks/usePyqBookmarks'
import { usePyqRevisionQueue } from '../../../hooks/usePyqRevisionQueue'
import { usePyqStatus } from '../../../hooks/usePyqStatus'
import PyqFilterBar from '../../../components/pyqs/PyqFilterBar'
import PyqProgressPanel from '../../../components/pyqs/PyqProgressPanel'
import YearGroupedPyqs from '../../../components/pyqs/YearGroupedPyqs'
import EmptyState from '../EmptyState'
import PageTitle from '../../../components/PageTitle'

export default function ChapterPyqsPage() {
  const { subjectId, chapterSlug } = useParams()
  const found = getChapterBySlug(subjectId, chapterSlug)
  const [exam, setExam] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [queuedOnly, setQueuedOnly] = useState(false)

  const { bookmarkedIds, toggleBookmark } = usePyqBookmarks()
  const { queuedIds, toggleQueued } = usePyqRevisionQueue()
  const { getStatus, cycleStatus } = usePyqStatus()

  const chapterPyqs = useMemo(() => {
    if (!found) return []
    return getChapterPyqs(found.subject, found.chapter)
  }, [found])

  const filteredPyqs = useMemo(() => {
    return chapterPyqs.filter((pyq) => {
      if (exam !== 'all' && pyq.exam !== exam) return false
      if (difficulty !== 'all' && pyq.difficulty !== difficulty) return false
      if (bookmarkedOnly && !bookmarkedIds.includes(pyq.id)) return false
      if (queuedOnly && !queuedIds.includes(pyq.id)) return false
      return true
    })
  }, [chapterPyqs, exam, difficulty, bookmarkedOnly, queuedOnly, bookmarkedIds, queuedIds])

  const progress = useMemo(
    () => getPyqProgress(chapterPyqs, { getStatus, bookmarkedIds, queuedIds }),
    [chapterPyqs, getStatus, bookmarkedIds, queuedIds],
  )

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found

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

        <h2 className="mt-3 text-lg font-semibold text-[#e8e8e8]">{chapter.name} PYQs</h2>
        <p className="mt-0.5 text-xs text-[#858585]">Previous year questions, grouped by year</p>
      </div>

      <PyqProgressPanel progress={progress} />

      <PyqFilterBar
        hideSubject
        hideChapter
        exam={exam}
        onExamChange={setExam}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        bookmarkedOnly={bookmarkedOnly}
        onBookmarkedToggle={setBookmarkedOnly}
        queuedOnly={queuedOnly}
        onQueuedToggle={setQueuedOnly}
      />

      {filteredPyqs.length === 0 ? (
        <EmptyState icon={FlaskConical} title="No PYQs match your filters" />
      ) : (
        <YearGroupedPyqs
          pyqs={filteredPyqs}
          getStatus={getStatus}
          onCycleStatus={cycleStatus}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
          queuedIds={queuedIds}
          onToggleQueued={toggleQueued}
        />
      )}
    </div>
  )
}
