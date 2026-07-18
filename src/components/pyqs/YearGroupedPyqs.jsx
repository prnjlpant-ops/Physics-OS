import PyqCard from './PyqCard'

export default function YearGroupedPyqs({ pyqs, getStatus, onCycleStatus, bookmarkedIds, onToggleBookmark, queuedIds, onToggleQueued }) {
  const years = [...new Set(pyqs.map((pyq) => pyq.year))].sort((a, b) => b - a)

  return (
    <div className="flex flex-col gap-6">
      {years.map((year) => (
        <section key={year} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">{year}</h3>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {pyqs
              .filter((pyq) => pyq.year === year)
              .map((pyq) => (
                <PyqCard
                  key={pyq.id}
                  pyq={pyq}
                  status={getStatus(pyq)}
                  onCycleStatus={onCycleStatus}
                  isBookmarked={bookmarkedIds.includes(pyq.id)}
                  onToggleBookmark={onToggleBookmark}
                  isQueued={queuedIds.includes(pyq.id)}
                  onToggleQueued={onToggleQueued}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
