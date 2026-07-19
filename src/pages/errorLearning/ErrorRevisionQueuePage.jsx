import { RefreshCw } from 'lucide-react'
import { useErrorRevisionQueue } from '../../hooks/useErrorRevisionQueue'
import { useErrorStatus } from '../../hooks/useErrorStatus'
import { useErrorBookmarks } from '../../hooks/useErrorBookmarks'
import ErrorRevisionQueueItem from '../../components/errorLearning/ErrorRevisionQueueItem'
import EmptyState from '../subject/EmptyState'

export default function ErrorRevisionQueuePage() {
  const { items, removeItem, setPriority } = useErrorRevisionQueue()
  const { getStatus, cycleStatus } = useErrorStatus()
  const { bookmarkedIds, toggleBookmark } = useErrorBookmarks()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Revision Queue</h3>
        <span className="text-xs text-[#858585]">{items.length} errors</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="Your revision queue is empty"
          description="Pending errors from the Error Library will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ErrorRevisionQueueItem
              key={item.id}
              item={item}
              status={getStatus(item)}
              onCycleStatus={cycleStatus}
              isBookmarked={bookmarkedIds.includes(item.id)}
              onToggleBookmark={toggleBookmark}
              onSetPriority={setPriority}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}
