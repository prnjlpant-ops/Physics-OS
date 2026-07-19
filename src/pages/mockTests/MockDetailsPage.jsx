import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, PlayCircle, ListChecks, Clock3, Award, BookMarked } from 'lucide-react'
import { getMockTestById } from '../../data/mockTestsData'
import { useMockBookmarks } from '../../hooks/useMockBookmarks'
import DifficultyBadge from '../../components/mockTests/DifficultyBadge'
import StatusBadge from '../../components/mockTests/StatusBadge'
import MockBookmarkButton from '../../components/mockTests/MockBookmarkButton'
import PageTitle from '../../components/PageTitle'

export default function MockDetailsPage() {
  const { testId } = useParams()
  const test = getMockTestById(testId)
  const { bookmarkedIds, toggleBookmark } = useMockBookmarks()

  if (!test) {
    return <PageTitle title="Mock Test Not Found" />
  }

  const isBookmarked = bookmarkedIds.includes(test.id)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <Link
        to="/mock-tests/library"
        className="inline-flex w-fit items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
      >
        <ArrowLeft size={14} strokeWidth={1.75} />
        Test Library
      </Link>

      <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#6e6e6e]">
              {test.exam} · {test.type}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-[#e8e8e8]">{test.title}</h2>
          </div>
          <MockBookmarkButton active={isBookmarked} onToggle={() => toggleBookmark(test.id)} />
        </div>

        <p className="text-sm leading-relaxed text-[#9d9d9d]">{test.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={test.difficulty} />
          <StatusBadge status={test.status} />
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-[#3c3c3c] pt-3.5 text-xs text-[#9d9d9d] sm:grid-cols-3">
          <div className="flex items-center gap-1.5">
            <ListChecks size={14} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
            {test.questions} Questions
          </div>
          <div className="flex items-center gap-1.5">
            <Clock3 size={14} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
            {test.duration} minutes
          </div>
          <div className="flex items-center gap-1.5">
            <Award size={14} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
            {test.marks} marks
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="flex flex-col gap-2.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
            <BookMarked size={15} strokeWidth={1.75} className="text-[#858585]" />
            Syllabus Covered
          </h3>
          <ul className="flex flex-col gap-1.5 text-xs text-[#9d9d9d]">
            {test.syllabus.map((topic) => (
              <li key={topic} className="flex items-center gap-2">
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#6e6e6e]" />
                {topic}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-2.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Instructions</h3>
          <ol className="flex list-decimal flex-col gap-1.5 pl-4 text-xs text-[#9d9d9d]">
            {test.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
        </section>
      </div>

      <div className="flex gap-3">
        <Link
          to={`/mock-tests/${test.id}/attempt`}
          className="flex items-center gap-2 rounded-md bg-[#0e639c] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1177bb]"
        >
          <PlayCircle size={16} strokeWidth={1.75} />
          Start
        </Link>
        <button
          type="button"
          onClick={() => toggleBookmark(test.id)}
          className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-4 py-2 text-sm font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <BookMarked size={16} strokeWidth={1.75} className={isBookmarked ? 'text-[#e2c08d]' : ''} />
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>
    </div>
  )
}
