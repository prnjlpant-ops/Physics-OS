import { useOutletContext } from 'react-router-dom'
import { getSubjectMemorySheets } from '../../data/memorySheetsData'
import ChapterMemorySheetCard from '../../components/memorySheets/ChapterMemorySheetCard'

export default function SubjectMemorySheetPage() {
  const { subject } = useOutletContext()
  const sheets = getSubjectMemorySheets(subject)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {sheets.map((sheet) => (
        <ChapterMemorySheetCard key={sheet.chapterSlug} subjectId={subject.id} sheet={sheet} />
      ))}
    </div>
  )
}
