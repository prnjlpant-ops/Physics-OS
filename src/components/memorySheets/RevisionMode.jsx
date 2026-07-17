import { useState } from 'react'
import { ChevronLeft, ChevronRight, Shuffle, Check } from 'lucide-react'
import MemoryBookmarkButton from './MemoryBookmarkButton'

export default function RevisionMode({ cards, bookmarkedIds, onToggleBookmark, reviewedIds, onToggleReviewed }) {
  const [index, setIndex] = useState(0)

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#3c3c3c] bg-[#252526] px-6 py-16 text-center">
        <p className="text-sm text-[#858585]">No memory cards available for revision yet.</p>
      </div>
    )
  }

  const card = cards[index]
  const isReviewed = reviewedIds.includes(card.id)
  const isBookmarked = bookmarkedIds.includes(card.id)

  const goPrevious = () => setIndex((current) => (current - 1 + cards.length) % cards.length)
  const goNext = () => setIndex((current) => (current + 1) % cards.length)
  const goRandom = () => {
    if (cards.length <= 1) return
    let next = Math.floor(Math.random() * cards.length)
    while (next === index) next = Math.floor(Math.random() * cards.length)
    setIndex(next)
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="flex w-full max-w-xl items-center justify-between text-xs text-[#858585]">
        <span>{card.sectionLabel}</span>
        <span>
          {index + 1} / {cards.length}
        </span>
      </div>

      <div className="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-[#3c3c3c] bg-[#252526] p-6 transition-colors duration-150">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            {card.subjectName} · {card.chapterName}
          </p>
          <MemoryBookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(card.id)} />
        </div>

        <h3 className="text-lg font-semibold leading-snug text-[#e8e8e8]">{card.concept}</h3>

        <div className="flex flex-col gap-3 border-t border-[#3c3c3c] pt-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#6e6e6e]">
              Short Explanation
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#9d9d9d]">{card.shortExplanation}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#6e6e6e]">Why it Matters</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#9d9d9d]">{card.whyItMatters}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#6e6e6e]">Typical Mistake</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#9d9d9d]">{card.typicalMistake}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="rounded-md border border-dashed border-[#3c3c3c] px-2.5 py-2 text-[10px] italic text-[#6e6e6e]">
            Visual cue: {card.visualCue}
          </div>
          <div className="rounded-md border border-dashed border-[#3c3c3c] px-2.5 py-2 text-[10px] italic text-[#6e6e6e]">
            Memory hook: {card.memoryHook}
          </div>
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
          onClick={() => onToggleReviewed(card.id)}
          aria-pressed={isReviewed}
          className={[
            'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150',
            isReviewed
              ? 'border-[#89d185]/40 bg-[#89d185]/10 text-[#89d185]'
              : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a]',
          ].join(' ')}
        >
          <Check size={14} strokeWidth={1.75} />
          {isReviewed ? 'Reviewed' : 'Mark Reviewed'}
        </button>
        <button
          type="button"
          onClick={goRandom}
          className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <Shuffle size={14} strokeWidth={1.75} />
          Random Card
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
    </div>
  )
}
