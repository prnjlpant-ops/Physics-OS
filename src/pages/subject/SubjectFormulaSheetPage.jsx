import { useOutletContext } from 'react-router-dom'
import { getSubjectFormulaSheets } from '../../data/formulaSheetsData'
import ChapterFormulaSheetCard from '../../components/formulaSheets/ChapterFormulaSheetCard'

export default function SubjectFormulaSheetPage() {
  const { subject } = useOutletContext()
  const sheets = getSubjectFormulaSheets(subject)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {sheets.map((sheet) => (
        <ChapterFormulaSheetCard key={sheet.chapterSlug} subjectId={subject.id} sheet={sheet} />
      ))}
    </div>
  )
}
