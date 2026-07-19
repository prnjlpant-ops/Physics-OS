import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff, FileText, Brain, NotebookPen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DIFFICULTY_LEVELS, DIFFICULTY_STYLES } from '../../constants/activeRecallConstants'
import ActiveRecallBookmarkButton from './ActiveRecallBookmarkButton'

export default function StudyMode({
  cards,
  bookmarkedIds,
  onToggleBookmark,
  getDifficulty,
  onSetDifficulty,
  onReveal,
}) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  // Keep the index in range if the filtered card list shrinks/changes.
  useEffect(() => {
    setIndex(0)
    setRevealed(false)
  }, [cards.length])

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#3c3c3c] bg-[#252526] px-6 py-16 text-center">
        <p className="text-sm text-[#858585]">No Active Recall cards match your filters yet.</p>
      </div>
    )
  }

  const safeIndex = index % cards.length
  const card = cards[safeIndex]
  const isBookmarked = bookmarkedIds.includes(card.id)
  const difficulty = getDifficulty(card)

  const goTo = (nextIndex) => {
    setIndex(nextIndex)
    setRevealed(false)
  }

  const goPrevious = () => goTo((safeIndex - 1 + cards.length) % cards.length)
  const goNext = () => goTo((safeIndex + 1) % cards.length)
  const goRandom = () => {
    if (cards.length <= 1) return
    let next = Math.floor(Math.random() * cards.length)
    while (next === safeIndex) next = Math.floor(Math.random() * cards.length)
    goTo(next)
  }

  const handleReveal = () => {
    setRevealed((prev) => {
      const next = !prev
      if (next) onReveal?.(card.id)
      return next
    })
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="flex w-full max-w-xl items-center justify-between text-xs text-[#858585]">
        <span>
          {card.subjectName} · {card.chapterName}
        </span>
        <span>
          {safeIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-[#3c3c3c] bg-[#252526] p-6 transition-colors duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
              {card.typeLabel}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${DIFFICULTY_STYLES[difficulty]}`}
            >
              {difficulty}
            </span>
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#6e6e6e]"
              >
                {tag}
              </span>
            ))}
          </div>
          <ActiveRecallBookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(card.id)} />
        </div>

        <h3 className="text-lg font-semibold leading-snug text-[#e8e8e8]">{card.question}</h3>

        <button
          type="button"
          onClick={handleReveal}
          aria-expanded={revealed}
          className={[
            'flex w-fit items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150',
            revealed
              ? 'border-[#0e639c]/50 bg-[#0e639c]/10 text-[#4fc1ff]'
              : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a]',
          ].join(' ')}
        >
          {revealed ? <EyeOff size={14} strokeWidth={1.75} /> : <Eye size={14} strokeWidth={1.75} />}
          {revealed ? 'Hide Answer' : 'Reveal Answer'}
        </button>

        {revealed && (
          <p className="rounded-md border border-dashed border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2.5 text-sm leading-relaxed text-[#9d9d9d]">
            {card.answer}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-[#3c3c3c] pt-3 text-[10px] text-[#6e6e6e]">
          <Link
            to={card.relatedFormulaSheetPath}
            className="inline-flex items-center gap-1 transition-colors duration-150 hover:text-[#4fc1ff]"
          >
            <FileText size={12} strokeWidth={1.75} />
            Formula Sheet
          </Link>
          <Link
            to={card.relatedMemorySheetPath}
            className="inline-flex items-center gap-1 transition-colors duration-150 hover:text-[#4fc1ff]"
          >
            <Brain size={12} strokeWidth={1.75} />
            Memory Sheet
          </Link>
          <Link
            to={card.relatedNotesPath}
            className="inline-flex items-center gap-1 transition-colors duration-150 hover:text-[#4fc1ff]"
          >
            <NotebookPen size={12} strokeWidth={1.75} />
            Notes
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={goPrevious}
          className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <ChevronLeft size={14} strokeWidth={1.75} />
          Previous
        </button>
        <button
          type="button"
          onClick={goRandom}
          className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <Shuffle size={14} strokeWidth={1.75} />
          Random
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          Next
          <ChevronRight size={14} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Mark:</span>
        {DIFFICULTY_LEVELS.map((level) => {
          const isActive = difficulty === level
          return (
            <button
              key={level}
              type="button"
              onClick={() => onSetDifficulty(card.id, level)}
              aria-pressed={isActive}
              className={[
                'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150',
                isActive ? DIFFICULTY_STYLES[level] : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a]',
              ].join(' ')}
            >
              {level}
            </button>
          )
        })}
      </div>
    </div>
  )
}
