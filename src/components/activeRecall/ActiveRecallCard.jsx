import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, FileText, Brain, NotebookPen } from 'lucide-react'
import { DIFFICULTY_STYLES } from '../../constants/activeRecallConstants'
import ActiveRecallBookmarkButton from './ActiveRecallBookmarkButton'

export default function ActiveRecallCard({
  card,
  difficulty,
  isBookmarked,
  onToggleBookmark,
  onReveal,
  showChapter = false,
}) {
  const [revealed, setRevealed] = useState(false)

  const handleToggleReveal = () => {
    setRevealed((prev) => {
      const next = !prev
      if (next) onReveal?.(card.id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-colors duration-150 hover:border-[#4a4a4a]">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {showChapter && (
            <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">
              {card.subjectName} · {card.chapterName}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
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
          <p className="mt-2 text-sm font-medium leading-snug text-[#e8e8e8]">{card.question}</p>
        </div>
        <ActiveRecallBookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(card.id)} />
      </div>

      <button
        type="button"
        onClick={handleToggleReveal}
        aria-expanded={revealed}
        className="flex w-fit items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
      >
        {revealed ? <ChevronUp size={13} strokeWidth={1.75} /> : <ChevronDown size={13} strokeWidth={1.75} />}
        {revealed ? 'Hide Answer' : 'Reveal Answer'}
      </button>

      {revealed && (
        <p className="rounded-md border border-dashed border-[#3c3c3c] px-3 py-2 text-xs leading-relaxed text-[#9d9d9d]">
          {card.answer}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-[#3c3c3c] pt-2.5">
        <Link
          to={card.relatedFormulaSheetPath}
          className="inline-flex items-center gap-1 text-[10px] text-[#858585] transition-colors duration-150 hover:text-[#4fc1ff]"
        >
          <FileText size={12} strokeWidth={1.75} />
          Formula Sheet
        </Link>
        <Link
          to={card.relatedMemorySheetPath}
          className="inline-flex items-center gap-1 text-[10px] text-[#858585] transition-colors duration-150 hover:text-[#4fc1ff]"
        >
          <Brain size={12} strokeWidth={1.75} />
          Memory Sheet
        </Link>
        <Link
          to={card.relatedNotesPath}
          className="inline-flex items-center gap-1 text-[10px] text-[#858585] transition-colors duration-150 hover:text-[#4fc1ff]"
        >
          <NotebookPen size={12} strokeWidth={1.75} />
          Notes
        </Link>
      </div>
    </div>
  )
}
