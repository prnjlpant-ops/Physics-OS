import { useMemo, useState } from 'react'
import { FileSearch } from 'lucide-react'
import { subjects } from '../../constants/subjects'
import { getAllErrors } from '../../data/errorLearningData'
import { useErrorStatus } from '../../hooks/useErrorStatus'
import { useErrorBookmarks } from '../../hooks/useErrorBookmarks'
import ErrorFilterBar from '../../components/errorLearning/ErrorFilterBar'
import ErrorCard from '../../components/errorLearning/ErrorCard'
import EmptyState from '../subject/EmptyState'

const ALL_ERRORS = getAllErrors()

export default function ErrorLibraryPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [chapterSlug, setChapterSlug] = useState('all')
  const [source, setSource] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [status, setStatus] = useState('All')

  const { getStatus, cycleStatus } = useErrorStatus()
  const { bookmarkedIds, toggleBookmark } = useErrorBookmarks()

  const chapters = useMemo(() => {
    if (subjectId === 'all') return []
    return subjects.find((subject) => subject.id === subjectId)?.chapters ?? []
  }, [subjectId])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return ALL_ERRORS.filter((error) => {
      if (subjectId !== 'all' && error.subjectId !== subjectId) return false
      if (chapterSlug !== 'all' && error.chapterSlug !== chapterSlug) return false
      if (source !== 'all' && error.source !== source) return false
      if (difficulty !== 'all' && error.difficulty !== difficulty) return false
      if (status !== 'All' && getStatus(error) !== status) return false
      if (query) {
        const haystack = `${error.id} ${error.errorType} ${error.subjectName} ${error.chapterName} ${error.correctConcept} ${error.tags.join(' ')}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [search, subjectId, chapterSlug, source, difficulty, status, getStatus])

  return (
    <div className="flex flex-col gap-5">
      <ErrorFilterBar
        search={search}
        onSearchChange={setSearch}
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
        source={source}
        onSourceChange={setSource}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Error Library</h3>
        <span className="text-xs text-[#858585]">{filtered.length} results</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileSearch} title="No errors match your filters" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((error) => (
            <ErrorCard
              key={error.id}
              error={error}
              status={getStatus(error)}
              onCycleStatus={cycleStatus}
              isBookmarked={bookmarkedIds.includes(error.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
