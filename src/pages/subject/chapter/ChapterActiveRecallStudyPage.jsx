import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getChapterBySlug } from '../../../constants/subjects'
import { getChapterActiveRecallCards } from '../../../data/activeRecallData'
import { useActiveRecallBookmarks } from '../../../hooks/useActiveRecallBookmarks'
import { useActiveRecallReviewed } from '../../../hooks/useActiveRecallReviewed'
import { useActiveRecallDifficulty } from '../../../hooks/useActiveRecallDifficulty'
import StudyMode from '../../../components/activeRecall/StudyMode'
import PageTitle from '../../../components/PageTitle'

export default function ChapterActiveRecallStudyPage() {
  const { subjectId, chapterSlug } = useParams()
  const found = getChapterBySlug(subjectId, chapterSlug)
  const { bookmarkedIds, toggleBookmark } = useActiveRecallBookmarks()
  const { markReviewed } = useActiveRecallReviewed()
  const { getDifficulty, setDifficulty } = useActiveRecallDifficulty()

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found
  const cards = getChapterActiveRecallCards(subject, chapter)

  return (
    <div className="flex flex-col gap-2 px-4 py-5 sm:px-6 lg:px-8">
      <Link
        to={`/subjects/${subject.id}/chapters/${chapter.slug}/active-recall`}
        className="inline-flex items-center gap-1.5 self-start text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
      >
        <ArrowLeft size={14} strokeWidth={1.75} />
        {chapter.name} Active Recall
      </Link>

      <StudyMode
        cards={cards}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
        getDifficulty={getDifficulty}
        onSetDifficulty={setDifficulty}
        onReveal={markReviewed}
      />
    </div>
  )
}
