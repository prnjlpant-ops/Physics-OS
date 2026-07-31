import { useMemo, useState } from 'react'
import { FileSearch } from 'lucide-react'
import { getSubjects } from '../../engine/blueprintService'
import { EXAMS, DIFFICULTY_LEVELS, STATUS_OPTIONS } from '../../constants/mockTestConstants'
import { getAllMockTests } from '../../data/mockTestsData'
import { useMockBookmarks } from '../../hooks/useMockBookmarks'
import MockFilterBar from '../../components/mockTests/MockFilterBar'
import MockTestCard from '../../components/mockTests/MockTestCard'
import EmptyState from '../subject/EmptyState'

const ALL_TESTS = getAllMockTests()

export default function TestLibraryPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [exam, setExam] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [status, setStatus] = useState('All')
  const { bookmarkedIds, toggleBookmark } = useMockBookmarks()

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return ALL_TESTS.filter((test) => {
      if (subjectId !== 'all' && test.subjectId !== subjectId) return false
      if (exam !== 'all' && test.exam !== exam) return false
      if (difficulty !== 'all' && test.difficulty !== difficulty) return false
      if (status !== 'All' && test.status !== status) return false
      if (query) {
        const haystack = `${test.title} ${test.exam} ${test.type} ${test.subjectName ?? ''}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [search, subjectId, exam, difficulty, status])

  return (
    <div className="flex flex-col gap-5">
      <MockFilterBar
        search={search}
        onSearchChange={setSearch}
        subjectId={subjectId}
        onSubjectChange={setSubjectId}
        subjects={getSubjects()}
        exam={exam}
        onExamChange={setExam}
        exams={EXAMS}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        difficulties={DIFFICULTY_LEVELS}
        status={status}
        onStatusChange={setStatus}
        statuses={STATUS_OPTIONS}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Test Library</h3>
        <span className="text-xs text-[#858585]">{filtered.length} results</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileSearch} title="No tests match your filters" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((test) => (
            <MockTestCard
              key={test.id}
              test={test}
              isBookmarked={bookmarkedIds.includes(test.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
