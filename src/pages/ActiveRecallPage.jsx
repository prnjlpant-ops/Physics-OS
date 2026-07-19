import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BrainCircuit, ChevronRight, Play, ListFilter } from 'lucide-react'
import { subjects } from '../constants/subjects'
import { getAllActiveRecallCards, getActiveRecallProgress } from '../data/activeRecallData'
import { useActiveRecallBookmarks } from '../hooks/useActiveRecallBookmarks'
import { useActiveRecallReviewed } from '../hooks/useActiveRecallReviewed'
import { useActiveRecallDifficulty } from '../hooks/useActiveRecallDifficulty'
import ActiveRecallSearchBar from '../components/activeRecall/ActiveRecallSearchBar'
import ActiveRecallFilterBar from '../components/activeRecall/ActiveRecallFilterBar'
import ActiveRecallProgressPanel from '../components/activeRecall/ActiveRecallProgressPanel'
import ActiveRecallCard from '../components/activeRecall/ActiveRecallCard'
import StudyMode from '../components/activeRecall/StudyMode'

const ALL_CARDS = getAllActiveRecallCards()

const MODES = [
  { key: 'study', label: 'Study Mode' },
  { key: 'revise', label: 'Revision Mode' },
]

export default function ActiveRecallPage() {
  const [mode, setMode] = useState('study')
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [chapterSlug, setChapterSlug] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)

  const { bookmarkedIds, toggleBookmark } = useActiveRecallBookmarks()
  const { reviewedIds, markReviewed } = useActiveRecallReviewed()
  const { getDifficulty, setDifficulty: setCardDifficulty } = useActiveRecallDifficulty()

  const chapters = useMemo(() => {
    if (subjectId === 'all') return []
    return subjects.find((subject) => subject.id === subjectId)?.chapters ?? []
  }, [subjectId])

  const filteredCards = useMemo(() => {
    const query = search.trim().toLowerCase()
    return ALL_CARDS.filter((card) => {
      if (subjectId !== 'all' && card.subjectId !== subjectId) return false
      if (chapterSlug !== 'all' && card.chapterSlug !== chapterSlug) return false
      if (difficulty !== 'all' && getDifficulty(card) !== difficulty) return false
      if (bookmarkedOnly && !bookmarkedIds.includes(card.id)) return false
      if (query) {
        const haystack =
          `${card.question} ${card.typeLabel} ${card.tags.join(' ')} ${card.subjectName} ${card.chapterName}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [search, subjectId, chapterSlug, difficulty, bookmarkedOnly, bookmarkedIds, getDifficulty])

  const progress = useMemo(
    () => getActiveRecallProgress(ALL_CARDS, { reviewedIds, bookmarkedIds }),
    [reviewedIds, bookmarkedIds],
  )

  const groupedByChapter = useMemo(() => {
    const groups = new Map()
    filteredCards.forEach((card) => {
      const key = `${card.subjectId}__${card.chapterSlug}`
      if (!groups.has(key)) {
        groups.set(key, {
          subjectId: card.subjectId,
          subjectName: card.subjectName,
          chapterSlug: card.chapterSlug,
          chapterName: card.chapterName,
          cards: [],
        })
      }
      groups.get(key).cards.push(card)
    })
    return Array.from(groups.values())
  }, [filteredCards])

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Active Recall</h2>
        <p className="mt-0.5 text-xs text-[#858585]">
          Revise concepts by explaining, comparing, predicting, and reasoning — not by re-reading.
        </p>
      </div>

      <ActiveRecallProgressPanel progress={progress} />

      <div className="flex flex-wrap items-center gap-1 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-1">
        {MODES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setMode(item.key)}
            className={[
              'flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors duration-150',
              mode === item.key
                ? 'bg-[#0e639c]/20 text-[#4fc1ff]'
                : 'text-[#9d9d9d] hover:text-[#cccccc]',
            ].join(' ')}
          >
            {item.key === 'study' ? <Play size={13} strokeWidth={1.75} /> : <ListFilter size={13} strokeWidth={1.75} />}
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <ActiveRecallSearchBar value={search} onChange={setSearch} />
        <ActiveRecallFilterBar
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
          bookmarkedOnly={bookmarkedOnly}
          onBookmarkedToggle={setBookmarkedOnly}
        />
      </div>

      {mode === 'study' ? (
        <StudyMode
          cards={filteredCards}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
          getDifficulty={getDifficulty}
          onSetDifficulty={setCardDifficulty}
          onReveal={markReviewed}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">
              {filteredCards.length} card{filteredCards.length === 1 ? '' : 's'}
            </h3>
          </div>

          {groupedByChapter.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#3c3c3c] bg-[#252526] px-6 py-16 text-center">
              <BrainCircuit size={22} strokeWidth={1.75} className="text-[#858585]" />
              <p className="text-sm text-[#858585]">No Active Recall cards match your filters.</p>
            </div>
          ) : (
            groupedByChapter.map((group) => (
              <section key={`${group.subjectId}__${group.chapterSlug}`} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{group.subjectName}</p>
                    <h4 className="text-sm font-semibold text-[#e8e8e8]">{group.chapterName}</h4>
                  </div>
                  <Link
                    to={`/subjects/${group.subjectId}/chapters/${group.chapterSlug}/active-recall`}
                    className="inline-flex shrink-0 items-center gap-1 text-xs text-[#858585] transition-colors duration-150 hover:text-[#4fc1ff]"
                  >
                    Open Chapter
                    <ChevronRight size={13} strokeWidth={1.75} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {group.cards.map((card) => (
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
              </section>
            ))
          )}
        </div>
      )}
    </div>
  )
}
