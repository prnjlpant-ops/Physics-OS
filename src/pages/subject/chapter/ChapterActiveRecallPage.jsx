import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'
import { getChapterBySlug } from '../../../constants/subjects'
import { getChapterActiveRecallCards, getActiveRecallProgress } from '../../../data/activeRecallData'
import { useActiveRecallBookmarks } from '../../../hooks/useActiveRecallBookmarks'
import { useActiveRecallReviewed } from '../../../hooks/useActiveRecallReviewed'
import { useActiveRecallDifficulty } from '../../../hooks/useActiveRecallDifficulty'
import ActiveRecallCard from '../../../components/activeRecall/ActiveRecallCard'
import ActiveRecallProgressPanel from '../../../components/activeRecall/ActiveRecallProgressPanel'
import PageTitle from '../../../components/PageTitle'

export default function ChapterActiveRecallPage() {
  const { subjectId, chapterSlug } = useParams()
  const found = getChapterBySlug(subjectId, chapterSlug)
  const { bookmarkedIds, toggleBookmark } = useActiveRecallBookmarks()
  const { reviewedIds, markReviewed } = useActiveRecallReviewed()
  const { getDifficulty } = useActiveRecallDifficulty()

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found
  const cards = getChapterActiveRecallCards(subject, chapter)
  const progress = getActiveRecallProgress(cards, { reviewedIds, bookmarkedIds })

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link
          to={`/subjects/${subject.id}/chapters/${chapter.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          {chapter.name}
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#e8e8e8]">{chapter.name} Active Recall</h2>
            <p className="mt-0.5 text-xs text-[#858585]">{cards.length} cards in this chapter</p>
          </div>
          <Link
            to={`/subjects/${subject.id}/chapters/${chapter.slug}/active-recall/study`}
            className="flex items-center gap-1.5 rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 px-3 py-1.5 text-xs font-medium text-[#4fc1ff] transition-colors duration-150 hover:border-[#0e639c]/70"
          >
            <Play size={14} strokeWidth={1.75} />
            Start Study Mode
          </Link>
        </div>
      </div>

      <ActiveRecallProgressPanel progress={progress} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {cards.map((card) => (
          <ActiveRecallCard
            key={card.id}
            card={card}
            difficulty={getDifficulty(card)}
            isBookmarked={bookmarkedIds.includes(card.id)}
            onToggleBookmark={toggleBookmark}
            onReveal={markReviewed}
          />
        ))}
      </div>
    </div>
  )
}
