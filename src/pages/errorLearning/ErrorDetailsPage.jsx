import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Brain, NotebookPen, RefreshCw, KeyRound, Lightbulb } from 'lucide-react'
import { getErrorById } from '../../data/errorLearningData'
import { useErrorStatus } from '../../hooks/useErrorStatus'
import { useErrorBookmarks } from '../../hooks/useErrorBookmarks'
import ErrorDifficultyBadge from '../../components/errorLearning/ErrorDifficultyBadge'
import ErrorStatusBadge from '../../components/errorLearning/ErrorStatusBadge'
import ErrorSourceBadge from '../../components/errorLearning/ErrorSourceBadge'
import ErrorBookmarkButton from '../../components/errorLearning/ErrorBookmarkButton'
import PageTitle from '../../components/PageTitle'

function DetailBlock({ title, children }) {
  return (
    <section className="flex flex-col gap-1.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <h3 className="text-sm font-semibold text-[#e8e8e8]">{title}</h3>
      <p className="text-sm leading-relaxed text-[#cccccc]">{children}</p>
    </section>
  )
}

export default function ErrorDetailsPage() {
  const { errorId } = useParams()
  const error = getErrorById(errorId)
  const { getStatus, cycleStatus } = useErrorStatus()
  const { bookmarkedIds, toggleBookmark } = useErrorBookmarks()

  if (!error) {
    return <PageTitle title="Error Not Found" />
  }

  const status = getStatus(error)
  const isBookmarked = bookmarkedIds.includes(error.id)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <Link
        to="/error-learning/library"
        className="inline-flex w-fit items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
      >
        <ArrowLeft size={14} strokeWidth={1.75} />
        Error Library
      </Link>

      <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#6e6e6e]">
              {error.subjectName} · {error.chapterName}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-[#e8e8e8]">{error.errorType}</h2>
            <p className="mt-0.5 font-mono text-[10px] text-[#6e6e6e]">{error.id}</p>
          </div>
          <ErrorBookmarkButton active={isBookmarked} onToggle={() => toggleBookmark(error.id)} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <ErrorSourceBadge source={error.source} />
          <ErrorDifficultyBadge difficulty={error.difficulty} />
          <ErrorStatusBadge status={status} onCycle={() => cycleStatus(error)} />
          <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#6e6e6e]">
            {error.date}
          </span>
          {error.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#6e6e6e]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <DetailBlock title="Question">{error.question}</DetailBlock>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DetailBlock title="Your Attempt">{error.yourAttempt}</DetailBlock>
        <DetailBlock title="Correct Approach">{error.correctApproach}</DetailBlock>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DetailBlock title="Root Cause">{error.rootCause}</DetailBlock>
        <DetailBlock title="Correct Concept">{error.correctConcept}</DetailBlock>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="flex flex-col gap-1.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
            <KeyRound size={15} strokeWidth={1.75} className="text-[#858585]" />
            Key Formula
          </h3>
          <p className="text-sm leading-relaxed text-[#cccccc]">{error.keyFormula}</p>
        </section>
        <section className="flex flex-col gap-1.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
            <Lightbulb size={15} strokeWidth={1.75} className="text-[#858585]" />
            Memory Hook
          </h3>
          <p className="text-sm leading-relaxed text-[#cccccc]">{error.memoryHook}</p>
        </section>
      </div>

      <section className="flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Related</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to={error.relatedNotePath}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#3c3c3c] px-3 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#4fc1ff]"
          >
            <NotebookPen size={13} strokeWidth={1.75} />
            Related Note
          </Link>
          <Link
            to={error.relatedFormulaSheetPath}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#3c3c3c] px-3 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#4fc1ff]"
          >
            <FileText size={13} strokeWidth={1.75} />
            Related Formula Sheet
          </Link>
          <Link
            to={error.relatedMemorySheetPath}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#3c3c3c] px-3 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#4fc1ff]"
          >
            <Brain size={13} strokeWidth={1.75} />
            Related Memory Sheet
          </Link>
          <Link
            to={error.relatedActiveRecallPath}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#3c3c3c] px-3 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#4fc1ff]"
          >
            <RefreshCw size={13} strokeWidth={1.75} />
            Related Active Recall
          </Link>
        </div>
      </section>
    </div>
  )
}
