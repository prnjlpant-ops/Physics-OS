import { useMemo } from 'react'
import { AlertOctagon, Clock3, CheckCircle2, TrendingDown, BookX, History } from 'lucide-react'
import { getAllErrors, getDashboardStats } from '../../data/errorLearningData'
import { useErrorStatus } from '../../hooks/useErrorStatus'
import { useErrorBookmarks } from '../../hooks/useErrorBookmarks'
import ErrorStatCard from '../../components/errorLearning/ErrorStatCard'
import ErrorCard from '../../components/errorLearning/ErrorCard'
import EmptyState from '../subject/EmptyState'

export default function ErrorDashboardPage() {
  const stats = useMemo(() => getDashboardStats(), [])
  const { getStatus, cycleStatus } = useErrorStatus()
  const { bookmarkedIds, toggleBookmark } = useErrorBookmarks()

  const recentErrors = useMemo(
    () =>
      [...getAllErrors()]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6),
    [],
  )

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <ErrorStatCard icon={AlertOctagon} label="Total Errors" value={stats.totalErrors} accent />
        <ErrorStatCard icon={Clock3} label="Pending Revision" value={stats.pendingRevision} />
        <ErrorStatCard icon={CheckCircle2} label="Resolved Errors" value={stats.resolvedErrors} />
        <ErrorStatCard icon={TrendingDown} label="Weakest Subject" value={stats.weakestSubject} />
        <ErrorStatCard icon={BookX} label="Weakest Chapter" value={stats.weakestChapter} />
        <ErrorStatCard icon={History} label="Last Error Added" value={stats.lastErrorAdded} />
      </section>

      <section className="flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Recently Added Errors</h3>
        {recentErrors.length === 0 ? (
          <EmptyState icon={AlertOctagon} title="No errors logged yet" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recentErrors.map((error) => (
              <ErrorCard
                key={error.id}
                error={error}
                status={getStatus(error)}
                onCycleStatus={cycleStatus}
                isBookmarked={bookmarkedIds.includes(error.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
