import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Brain } from 'lucide-react'
import { getChapterBySlug } from '../../../constants/subjects'
import { getChapterPyqs } from '../../../data/pyqsData'
import { DIFFICULTY_STYLES } from '../../../constants/pyqConstants'
import { usePyqBookmarks } from '../../../hooks/usePyqBookmarks'
import { usePyqRevisionQueue } from '../../../hooks/usePyqRevisionQueue'
import { usePyqStatus } from '../../../hooks/usePyqStatus'
import { usePyqNotes } from '../../../hooks/usePyqNotes'
import PyqTabs from '../../../components/pyqs/PyqTabs'
import PyqStatusBadge from '../../../components/pyqs/PyqStatusBadge'
import PyqBookmarkButton from '../../../components/pyqs/PyqBookmarkButton'
import PyqRevisionQueueButton from '../../../components/pyqs/PyqRevisionQueueButton'
import PageTitle from '../../../components/PageTitle'

export default function PyqDetailPage() {
  const { subjectId, chapterSlug, pyqId } = useParams()
  const [activeTab, setActiveTab] = useState('question')
  const found = getChapterBySlug(subjectId, chapterSlug)

  const { bookmarkedIds, toggleBookmark } = usePyqBookmarks()
  const { queuedIds, toggleQueued } = usePyqRevisionQueue()
  const { getStatus, cycleStatus } = usePyqStatus()
  const { getNote, setNote } = usePyqNotes()

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found
  const pyq = getChapterPyqs(subject, chapter).find((item) => item.id === pyqId)

  if (!pyq) {
    return <PageTitle title="Question Not Found" />
  }

  const status = getStatus(pyq)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link
          to={`/subjects/${subject.id}/chapters/${chapter.slug}/pyqs`}
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          {chapter.name} PYQs
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#e8e8e8]">
              Q{pyq.questionNumber} · {pyq.exam} {pyq.year}
            </h2>
            <p className="mt-0.5 font-mono text-[10px] text-[#6e6e6e]">{pyq.id}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <PyqRevisionQueueButton active={queuedIds.includes(pyq.id)} onToggle={() => toggleQueued(pyq.id)} />
            <PyqBookmarkButton active={bookmarkedIds.includes(pyq.id)} onToggle={() => toggleBookmark(pyq.id)} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
            {pyq.subjectName}
          </span>
          <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
            {pyq.chapterName}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${DIFFICULTY_STYLES[pyq.difficulty]}`}>
            {pyq.difficulty}
          </span>
          <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
            {pyq.marks} marks
          </span>
          <PyqStatusBadge status={status} onCycle={() => cycleStatus(pyq)} />
          {pyq.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#6e6e6e]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <PyqTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        {activeTab === 'question' && (
          <p className="text-sm leading-relaxed text-[#cccccc]">{pyq.questionText}</p>
        )}

        {activeTab === 'solution' && (
          <p className="text-sm leading-relaxed text-[#cccccc]">{pyq.solutionText}</p>
        )}

        {activeTab === 'notes' && (
          <textarea
            value={getNote(pyq)}
            onChange={(event) => setNote(pyq.id, event.target.value)}
            placeholder="Add your notes for this question..."
            rows={8}
            className="w-full resize-none rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#cccccc] placeholder:text-[#6e6e6e] focus:border-[#0e639c] focus:outline-none"
          />
        )}

        {activeTab === 'relatedFormulaSheet' && (
          <Link
            to={pyq.relatedFormulaSheetPath}
            className="inline-flex items-center gap-2 rounded-md border border-[#3c3c3c] px-3 py-2 text-sm text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#4fc1ff]"
          >
            <FileText size={15} strokeWidth={1.75} />
            Open {chapter.name} Formula Sheet
          </Link>
        )}

        {activeTab === 'relatedMemorySheet' && (
          <Link
            to={pyq.relatedMemorySheetPath}
            className="inline-flex items-center gap-2 rounded-md border border-[#3c3c3c] px-3 py-2 text-sm text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#4fc1ff]"
          >
            <Brain size={15} strokeWidth={1.75} />
            Open {chapter.name} Memory Sheet
          </Link>
        )}
      </div>
    </div>
  )
}
