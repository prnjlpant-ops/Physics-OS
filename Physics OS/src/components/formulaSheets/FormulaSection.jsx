import FormulaCard from './FormulaCard'

export default function FormulaSection({ section, bookmarkedIds, onToggleBookmark, showChapter = false }) {
  if (section.cards.length === 0) return null

  return (
    <section className="flex flex-col gap-3 print:break-inside-avoid">
      <h3 className="text-sm font-semibold text-[#e8e8e8] print:text-black">{section.label}</h3>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {section.cards.map((card) => (
          <FormulaCard
            key={card.id}
            card={card}
            isBookmarked={bookmarkedIds.includes(card.id)}
            onToggleBookmark={onToggleBookmark}
            showChapter={showChapter}
          />
        ))}
      </div>
    </section>
  )
}
