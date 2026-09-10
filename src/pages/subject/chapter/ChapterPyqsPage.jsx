import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FlaskConical } from 'lucide-react'
import { getChapterBySlug } from '../../../engine/blueprintService'
import { getChapterPyqs } from '../../../data/pyqsData'
import { getQuestionsForChapter } from '../../../engine/pyq/questionBankService'
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
  const questionBankQuestions = getQuestionsForChapter(subject, chapter)

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

      <section className="rounded-lg border border-[#0e639c]/40 bg-[#0e639c]/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#e8e8e8]">Imported Question Bank</p>
            <p className="mt-1 text-xs text-[#9d9d9d]">{questionBankQuestions.length} GATE questions matched to this chapter from the app-wide bank.</p>
          </div>
          <Link to="/pyqs/practice" className="rounded-md border border-[#0e639c] px-3 py-1.5 text-xs font-medium text-[#4fc1ff] hover:bg-[#0e639c]/20">Open question bank</Link>
        </div>
        {questionBankQuestions.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2">{questionBankQuestions.slice(0, 6).map((question) => <Link key={question.id} to={`/pyqs/practice/${question.id}`} className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-xs text-[#cccccc] hover:border-[#4a4a4a]">{question.exam} {question.year} · Q{question.questionNumber}<span className="mt-0.5 block truncate text-[10px] text-[#858585]">{question.subtopic}</span></Link>)}</div>}
      </section>

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
