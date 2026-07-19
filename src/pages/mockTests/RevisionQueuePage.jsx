import { RefreshCw } from 'lucide-react'
import { useMockRevisionQueue } from '../../hooks/useMockRevisionQueue'
import RevisionQueueItem from '../../components/mockTests/RevisionQueueItem'
import EmptyState from '../subject/EmptyState'

export default function RevisionQueuePage() {
  const { items, removeItem, toggleReviewed } = useMockRevisionQueue()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Revision Queue</h3>
        <span className="text-xs text-[#858585]">{items.length} questions</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="Your revision queue is empty"
          description="Questions marked for review during a mock will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <RevisionQueueItem
              key={item.id}
              item={item}
              onToggleReviewed={toggleReviewed}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}
