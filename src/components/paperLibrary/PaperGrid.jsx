import PaperCard from './PaperCard'

export default function PaperGrid({ papers, bookmarkIds, onToggleBookmark, emptyLabel = 'No papers found' }) {
  if (!papers.length) {
    return (
      <div className="rounded-lg border border-dashed border-[#3c3c3c] px-4 py-10 text-center text-xs text-[#6e6e6e]">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          isBookmarked={bookmarkIds.includes(paper.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  )
}
