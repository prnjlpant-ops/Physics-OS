import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getChapterBySlug } from '../../../engine/blueprintService'
import { getChapterMemoryCardsFlat } from '../../../data/memorySheetsData'
import { useMemoryBookmarks } from '../../../hooks/useMemoryBookmarks'
import { useMemoryReviewed } from '../../../hooks/useMemoryReviewed'
import RevisionMode from '../../../components/memorySheets/RevisionMode'
import PageTitle from '../../../components/PageTitle'

export default function ChapterMemoryRevisionPage() {
  const { subjectId, chapterSlug } = useParams()
  const found = getChapterBySlug(subjectId, chapterSlug)
  const { bookmarkedIds, toggleBookmark } = useMemoryBookmarks()
  const { reviewedIds, toggleReviewed } = useMemoryReviewed()

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found
  const cards = getChapterMemoryCardsFlat(subject, chapter)

  return (
    <div className="flex flex-col gap-2 px-4 py-5 sm:px-6 lg:px-8">
      <Link
        to={`/subjects/${subject.id}/chapters/${chapter.slug}/memory-sheet`}
        className="inline-flex items-center gap-1.5 self-start text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
      >
        <ArrowLeft size={14} strokeWidth={1.75} />
        {chapter.name} Memory Sheet
      </Link>

      <RevisionMode
        cards={cards}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
        reviewedIds={reviewedIds}
        onToggleReviewed={toggleReviewed}
      />
    </div>
  )
}
