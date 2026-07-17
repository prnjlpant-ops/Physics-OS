import { useMemo, useState } from 'react'
import { subjects } from '../constants/subjects'
import { getAllFormulaCards, getSubjectFormulaSheets } from '../data/formulaSheetsData'
import { useFormulaBookmarks } from '../hooks/useFormulaBookmarks'
import SearchBar from '../components/resources/SearchBar'
import FormulaFilterBar from '../components/formulaSheets/FormulaFilterBar'
import FormulaCard from '../components/formulaSheets/FormulaCard'
import ChapterFormulaSheetCard from '../components/formulaSheets/ChapterFormulaSheetCard'
import EmptyState from '../pages/subject/EmptyState'
import { FileText } from 'lucide-react'

export default function FormulaSheetsPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [chapterSlug, setChapterSlug] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const { bookmarkedIds, toggleBookmark } = useFormulaBookmarks()

  const chapters = useMemo(() => {
    if (subjectId === 'all') return []
    return subjects.find((subject) => subject.id === subjectId)?.chapters ?? []
  }, [subjectId])

  const isSearching = search.trim().length > 0

  const matchingCards = useMemo(() => {
    if (!isSearching) return []
    const query = search.trim().toLowerCase()
    return getAllFormulaCards().filter((card) => {
      if (subjectId !== 'all' && card.subjectId !== subjectId) return false
      if (chapterSlug !== 'all' && card.chapterSlug !== chapterSlug) return false
      if (difficulty !== 'all' && card.difficulty !== difficulty) return false
      const haystack = `${card.formula} ${card.sectionLabel} ${card.chapterName} ${card.subjectName}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [isSearching, search, subjectId, chapterSlug, difficulty])

  const visibleSubjects = useMemo(() => {
    return subjects
      .filter((subject) => subjectId === 'all' || subject.id === subjectId)
      .map((subject) => ({
        subject,
        sheets: getSubjectFormulaSheets(subject).filter((sheet) => {
          if (chapterSlug !== 'all' && sheet.chapterSlug !== chapterSlug) return false
          if (difficulty !== 'all' && sheet.difficulty !== difficulty) return false
          return true
        }),
      }))
      .filter((entry) => entry.sheets.length > 0)
  }, [subjectId, chapterSlug, difficulty])

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Formula Sheets</h2>
        <p className="mt-0.5 text-xs text-[#858585]">
          Concise, printable formula sheets for every chapter in the syllabus.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search formulas, chapters, subjects..." />
        <FormulaFilterBar
          subjects={subjects}
          subjectId={subjectId}
          onSubjectChange={(value) => {
            setSubjectId(value)
            setChapterSlug('all')
          }}
          chapters={chapters}
          chapterSlug={chapterSlug}
          onChapterChange={setChapterSlug}
          hideChapter={subjectId === 'all'}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      </div>

      {isSearching ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Matching Formulas</h3>
            <span className="text-xs text-[#858585]">{matchingCards.length} results</span>
          </div>
          {matchingCards.length === 0 ? (
            <EmptyState icon={FileText} title="No formulas match your search" />
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {matchingCards.map((card) => (
                <FormulaCard
                  key={card.id}
                  card={card}
                  isBookmarked={bookmarkedIds.includes(card.id)}
                  onToggleBookmark={toggleBookmark}
                  showChapter
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="flex flex-col gap-6">
          {visibleSubjects.map(({ subject, sheets }) => (
            <section key={subject.id} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-[#e8e8e8]">{subject.name}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {sheets.map((sheet) => (
                  <ChapterFormulaSheetCard key={sheet.chapterSlug} subjectId={subject.id} sheet={sheet} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
