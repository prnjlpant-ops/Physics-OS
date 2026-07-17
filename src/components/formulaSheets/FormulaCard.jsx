import BookmarkButton from './BookmarkButton'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#6e6e6e]">{label}</p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-[#9d9d9d]">{value}</p>
    </div>
  )
}

export default function FormulaCard({ card, isBookmarked, onToggleBookmark, showChapter = false }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-colors duration-150 hover:border-[#4a4a4a] print:break-inside-avoid print:border-[#c8c8c8] print:bg-white print:shadow-none">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {showChapter && (
            <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e] print:text-[#555]">
              {card.subjectName} · {card.chapterName}
            </p>
          )}
          <p className="mt-1 truncate rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 font-mono text-sm text-[#e8e8e8] print:border-[#c8c8c8] print:bg-[#f5f5f5] print:text-black">
            {card.formula}
          </p>
        </div>
        <BookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(card.id)} />
      </div>

      <div className="grid grid-cols-1 gap-2.5 border-t border-[#3c3c3c] pt-2.5 sm:grid-cols-2 print:border-[#c8c8c8]">
        <Field label="Meaning" value={card.meaning} />
        <Field label="Physical Interpretation" value={card.physicalInterpretation} />
        <Field label="When to Use" value={card.whenToUse} />
        <Field label="Special Conditions" value={card.specialConditions} />
      </div>

      <div className="rounded-md border border-dashed border-[#3c3c3c] px-2.5 py-2 text-[10px] italic text-[#6e6e6e] print:border-[#c8c8c8]">
        Space for derivation notes
      </div>
    </div>
  )
}
