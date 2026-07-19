import { useMemo } from 'react'
import { FileText, Brain, RefreshCw, ListTodo } from 'lucide-react'
import { getAllFormulaCards } from '../../data/formulaSheetsData'
import { getAllMemoryCards } from '../../data/memorySheetsData'
import { getAllActiveRecallCards } from '../../data/activeRecallData'
import { useFormulaBookmarks } from '../../hooks/useFormulaBookmarks'
import { useMemoryReviewed } from '../../hooks/useMemoryReviewed'
import { useActiveRecallReviewed } from '../../hooks/useActiveRecallReviewed'
import { useMockRevisionQueue } from '../../hooks/useMockRevisionQueue'
import { usePyqRevisionQueue } from '../../hooks/usePyqRevisionQueue'
import { useErrorRevisionQueue } from '../../hooks/useErrorRevisionQueue'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import AnalyticsBarRow from '../../components/analytics/AnalyticsBarRow'

export default function RevisionAnalyticsPage() {
  const formulaCards = useMemo(() => getAllFormulaCards(), [])
  const memoryCards = useMemo(() => getAllMemoryCards(), [])
  const recallCards = useMemo(() => getAllActiveRecallCards(), [])

  const { bookmarkedIds: formulaBookmarked } = useFormulaBookmarks()
  const { reviewedIds: memoryReviewed } = useMemoryReviewed()
  const { reviewedIds: recallReviewed } = useActiveRecallReviewed()
  const { items: mockQueueItems } = useMockRevisionQueue()
  const { queuedIds: pyqQueue } = usePyqRevisionQueue()
  const { items: errorQueueItems } = useErrorRevisionQueue()

  const formulaPct = formulaCards.length > 0 ? Math.round((formulaBookmarked.length / formulaCards.length) * 100) : 0
  const memoryPct = memoryCards.length > 0 ? Math.round((memoryReviewed.length / memoryCards.length) * 100) : 0
  const recallPct = recallCards.length > 0 ? Math.round((recallReviewed.length / recallCards.length) * 100) : 0

  const totalQueueItems = mockQueueItems.length + pyqQueue.length + errorQueueItems.length

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <AnalyticsStatCard
          icon={FileText}
          label="Formula Sheets Reviewed"
          value={`${formulaBookmarked.length}/${formulaCards.length}`}
          accent
        />
        <AnalyticsStatCard
          icon={Brain}
          label="Memory Sheets Reviewed"
          value={`${memoryReviewed.length}/${memoryCards.length}`}
        />
        <AnalyticsStatCard
          icon={RefreshCw}
          label="Active Recall Progress"
          value={`${recallReviewed.length}/${recallCards.length}`}
        />
        <AnalyticsStatCard icon={ListTodo} label="Revision Queue Status" value={`${totalQueueItems} pending`} />
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Review Coverage</h3>
        <div className="flex flex-col gap-3">
          <AnalyticsBarRow
            label="Formula Sheets (bookmarked as reviewed)"
            sublabel={`${formulaBookmarked.length} of ${formulaCards.length}`}
            value={formulaPct}
          />
          <AnalyticsBarRow
            label="Memory Sheets"
            sublabel={`${memoryReviewed.length} of ${memoryCards.length}`}
            value={memoryPct}
            tone="good"
          />
          <AnalyticsBarRow
            label="Active Recall"
            sublabel={`${recallReviewed.length} of ${recallCards.length}`}
            value={recallPct}
            tone="warn"
          />
        </div>
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Revision Queue Breakdown</h3>
        <div className="flex flex-col gap-3">
          <AnalyticsBarRow
            label="Mock Tests"
            value={mockQueueItems.length}
            max={Math.max(totalQueueItems, 1)}
            suffix=""
            tone="accent"
          />
          <AnalyticsBarRow
            label="PYQs"
            value={pyqQueue.length}
            max={Math.max(totalQueueItems, 1)}
            suffix=""
            tone="good"
          />
          <AnalyticsBarRow
            label="Error Learning"
            value={errorQueueItems.length}
            max={Math.max(totalQueueItems, 1)}
            suffix=""
            tone="bad"
          />
        </div>
      </section>
    </div>
  )
}
