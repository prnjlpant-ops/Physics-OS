import { useMemo, useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { subjects } from '../constants/subjects'
import { getAllPyqs } from '../data/pyqsData'
import { getPyqProgress, getChapterPyqStats } from '../data/pyqProgress'
import { usePyqBookmarks } from '../hooks/usePyqBookmarks'
import { usePyqRevisionQueue } from '../hooks/usePyqRevisionQueue'
import { usePyqStatus } from '../hooks/usePyqStatus'
import SearchBar from '../components/resources/SearchBar'
import PyqFilterBar from '../components/pyqs/PyqFilterBar'
import PyqProgressPanel from '../components/pyqs/PyqProgressPanel'
import PyqCard from '../components/pyqs/PyqCard'
import ChapterPyqsCard from '../components/pyqs/ChapterPyqsCard'
import EmptyState from './subject/EmptyState'

export default function PyqsPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [chapterSlug, setChapterSlug] = useState('all')
  const [exam, setExam] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [queuedOnly, setQueuedOnly] = useState(false)

  const { bookmarkedIds, toggleBookmark } = usePyqBookmarks()
  const { queuedIds, toggleQueued } = usePyqRevisionQueue()
  const { getStatus, cycleStatus } = usePyqStatus()

  const allPyqs = useMemo(() => getAllPyqs(), [])

  const chapters = useMemo(() => {
    if (subjectId === 'all') return []
    return subjects.find((subject) => subject.id === subjectId)?.chapters ?? []
  }, [subjectId])

  const isSearching = search.trim().length > 0

  const filteredPyqs = useMemo(() => {
    return allPyqs.filter((pyq) => {
      if (subjectId !== 'all' && pyq.subjectId !== subjectId) return false
      if (chapterSlug !== 'all' && pyq.chapterSlug !== chapterSlug) return false
      if (exam !== 'all' && pyq.exam !== exam) return false
      if (difficulty !== 'all' && pyq.difficulty !== difficulty) return false
      if (bookmarkedOnly && !bookmarkedIds.includes(pyq.id)) return false
      if (queuedOnly && !queuedIds.includes(pyq.id)) return false
      return true
    })
  }, [allPyqs, subjectId, chapterSlug, exam, difficulty, bookmarkedOnly, queuedOnly, bookmarkedIds, queuedIds])

  const searchResults = useMemo(() => {
    if (!isSearching) return []
    const query = search.trim().toLowerCase()
    return filteredPyqs.filter((pyq) => {
      const haystack = `${pyq.id} ${pyq.questionText} ${pyq.exam} ${pyq.subjectName} ${pyq.chapterName} ${pyq.tags.join(' ')}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [isSearching, search, filteredPyqs])

  const progress = useMemo(
    () => getPyqProgress(filteredPyqs, { getStatus, bookmarkedIds, queuedIds }),
    [filteredPyqs, getStatus, bookmarkedIds, queuedIds],
  )

  const visibleSubjects = useMemo(() => {
    return subjects
      .filter((subject) => subjectId === 'all' || subject.id === subjectId)
      .map((subject) => ({
        subject,
        chapters: subject.chapters
          .filter((chapter) => chapterSlug === 'all' || chapter.slug === chapterSlug)
          .map((chapter) => ({
            chapter,
            ...getChapterPyqStats(allPyqs, subject.id, chapter.slug, getStatus),
          })),
      }))
  }, [subjectId, chapterSlug, allPyqs, getStatus])

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">PYQs</h2>
        <p className="mt-0.5 text-xs text-[#858585]">
          Previous year questions from JEST, IIT JAM, GATE and TIFR, organized by Subject and Chapter.
        </p>
      </div>

      <PyqProgressPanel progress={progress} />

      <div className="flex flex-col gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search questions by id, keyword, exam..." />
        <PyqFilterBar
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
          exam={exam}
          onExamChange={setExam}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          bookmarkedOnly={bookmarkedOnly}
          onBookmarkedToggle={setBookmarkedOnly}
          queuedOnly={queuedOnly}
          onQueuedToggle={setQueuedOnly}
        />
      </div>

      {isSearching ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Matching Questions</h3>
            <span className="text-xs text-[#858585]">{searchResults.length} results</span>
          </div>
          {searchResults.length === 0 ? (
            <EmptyState icon={FlaskConical} title="No questions match your search" />
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {searchResults.map((pyq) => (
                <PyqCard
                  key={pyq.id}
                  pyq={pyq}
                  status={getStatus(pyq)}
                  onCycleStatus={cycleStatus}
                  isBookmarked={bookmarkedIds.includes(pyq.id)}
                  onToggleBookmark={toggleBookmark}
                  isQueued={queuedIds.includes(pyq.id)}
                  onToggleQueued={toggleQueued}
                  showChapter
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="flex flex-col gap-6">
          {visibleSubjects.map(({ subject, chapters: subjectChapters }) => {
            const nonEmpty = subjectChapters.filter((entry) => entry.totalQuestions > 0)
            if (nonEmpty.length === 0) return null
            return (
              <section key={subject.id} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-[#e8e8e8]">{subject.name}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {nonEmpty.map(({ chapter, totalQuestions, solved }) => (
                    <ChapterPyqsCard
                      key={chapter.slug}
                      subjectId={subject.id}
                      chapter={chapter}
                      totalQuestions={totalQuestions}
                      solved={solved}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
