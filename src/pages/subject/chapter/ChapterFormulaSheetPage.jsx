import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getChapterBySlug } from '../../../engine/blueprintService'
import { getChapterFormulaSheet } from '../../../data/formulaSheetsData'
import { useFormulaBookmarks } from '../../../hooks/useFormulaBookmarks'
import FormulaSheetHeader from '../../../components/formulaSheets/FormulaSheetHeader'
import FormulaSection from '../../../components/formulaSheets/FormulaSection'
import PageTitle from '../../../components/PageTitle'

export default function ChapterFormulaSheetPage() {
  const { subjectId, chapterSlug } = useParams()
  const found = getChapterBySlug(subjectId, chapterSlug)
  const { bookmarkedIds, toggleBookmark } = useFormulaBookmarks()

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found
  const sheet = getChapterFormulaSheet(subject, chapter)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 print:px-0 print:py-0">
      <div className="print:hidden">
        <Link
          to={`/subjects/${subject.id}/chapters/${chapter.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          {chapter.name}
        </Link>
      </div>

      <FormulaSheetHeader sheet={sheet} />

      <div className="flex flex-col gap-6">
        {sheet.sections.map((section) => (
          <FormulaSection
            key={section.key}
            section={section}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
          />
        ))}
      </div>
    </div>
  )
}
