import { useMemo, useState } from 'react'
import { Brain } from 'lucide-react'
import { subjects } from '../constants/subjects'
import { getAllMemoryCards, getSubjectMemorySheets } from '../data/memorySheetsData'
import { useMemoryBookmarks } from '../hooks/useMemoryBookmarks'
import SearchBar from '../components/resources/SearchBar'
import MemoryFilterBar from '../components/memorySheets/MemoryFilterBar'
import MemoryCard from '../components/memorySheets/MemoryCard'
import ChapterMemorySheetCard from '../components/memorySheets/ChapterMemorySheetCard'
import EmptyState from './subject/EmptyState'

export default function MemorySheetsPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [chapterSlug, setChapterSlug] = useState('all')
  const [importance, setImportance] = useState('all')
  const { bookmarkedIds, toggleBookmark } = useMemoryBookmarks()

  const chapters = useMemo(() => {
    if (subjectId === 'all') return []
    return subjects.find((subject) => subject.id === subjectId)?.chapters ?? []
  }, [subjectId])

  const isSearching = search.trim().length > 0

  const matchingCards = useMemo(() => {
    if (!isSearching) return []
    const query = search.trim().toLowerCase()
    return getAllMemoryCards().filter((card) => {
      if (subjectId !== 'all' && card.subjectId !== subjectId) return false
      if (chapterSlug !== 'all' && card.chapterSlug !== chapterSlug) return false
      if (importance !== 'all' && card.importance !== importance) return false
      const haystack = `${card.concept} ${card.sectionLabel} ${card.chapterName} ${card.subjectName}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [isSearching, search, subjectId, chapterSlug, importance])

  const visibleSubjects = useMemo(() => {
    return subjects
      .filter((subject) => subjectId === 'all' || subject.id === subjectId)
      .map((subject) => ({
        subject,
        sheets: getSubjectMemorySheets(subject).filter((sheet) => {
          if (chapterSlug !== 'all' && sheet.chapterSlug !== chapterSlug) return false
          if (importance !== 'all' && sheet.importance !== importance) return false
          return true
        }),
      }))
      .filter((entry) => entry.sheets.length > 0)
  }, [subjectId, chapterSlug, importance])

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Memory Sheets</h2>
        <p className="mt-0.5 text-xs text-[#858585]">
          What you must remember forever — rapid revision before IIT JAM and JEST.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search concepts, chapters, subjects..." />
        <MemoryFilterBar
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
          importance={importance}
          onImportanceChange={setImportance}
        />
      </div>

      {isSearching ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Matching Cards</h3>
            <span className="text-xs text-[#858585]">{matchingCards.length} results</span>
          </div>
          {matchingCards.length === 0 ? (
            <EmptyState icon={Brain} title="No memory cards match your search" />
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {matchingCards.map((card) => (
                <MemoryCard
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
                  <ChapterMemorySheetCard key={sheet.chapterSlug} subjectId={subject.id} sheet={sheet} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
