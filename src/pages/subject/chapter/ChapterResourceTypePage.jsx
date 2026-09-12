import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { RESOURCE_TYPE_META } from '../../../constants/resourceTypes'
import BookShelf from '../../../components/books/BookShelf'
import ResourceGrid from '../../../components/resources/ResourceGrid'

export default function ChapterResourceTypePage({ type }) {
  const { resources } = useOutletContext()
  const meta = RESOURCE_TYPE_META[type]
  const [showMore, setShowMore] = useState(false)
  const items = resources[type] ?? []

  if (type === 'books') {
    return <BookShelf books={items} />
  }

  if (type === 'videos') {
    return (
      <ResourceGrid
        resources={items}
        favoriteIds={[]}
        onToggleFavorite={() => {}}
        showChapter
        emptyLabel="No lecture videos mapped to this chapter yet"
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <ResourceGrid
        resources={showMore ? items : items.slice(0, 1)}
        favoriteIds={[]}
        onToggleFavorite={() => {}}
        emptyLabel={`No ${meta.label.toLowerCase()} added yet`}
      />
      {items.length > 1 && <button type="button" onClick={() => setShowMore((value) => !value)} className="self-start rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs text-[#9d9d9d] hover:border-[#4a4a4a] hover:text-[#cccccc]">{showMore ? 'Show primary recommendation only' : `Show ${items.length - 1} additional ${meta.label.toLowerCase()}`}</button>}
    </div>
  )
}
