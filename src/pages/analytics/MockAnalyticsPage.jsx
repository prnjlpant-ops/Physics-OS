import { useMemo } from 'react'
import { ClipboardCheck, Target, Trophy, Percent, Clock3 } from 'lucide-react'
import { getMockAnalyticsSummary } from '../../data/analyticsData'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import AnalyticsBarRow from '../../components/analytics/AnalyticsBarRow'
import EmptyState from '../subject/EmptyState'

export default function MockAnalyticsPage() {
  const { counts, quickStats, subjectPerformance, avgTimeUtilization } = useMemo(
    () => getMockAnalyticsSummary(),
    [],
  )

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <AnalyticsStatCard icon={ClipboardCheck} label="Total Mocks" value={counts.total} accent />
        <AnalyticsStatCard icon={Target} label="Average Score" value={`${quickStats.averageScore}%`} />
        <AnalyticsStatCard icon={Trophy} label="Best Score" value={`${quickStats.bestScore}%`} />
        <AnalyticsStatCard icon={Percent} label="Accuracy" value={`${quickStats.accuracy}%`} />
        <AnalyticsStatCard icon={Clock3} label="Time Management" value={`${avgTimeUtilization}% used`} />
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Subject Performance</h3>
        {subjectPerformance.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title="No mock attempts yet" />
        ) : (
          <div className="flex flex-col gap-3">
            {subjectPerformance.map((subject) => (
              <AnalyticsBarRow
                key={subject.id}
                label={subject.name}
                sublabel={`${subject.attempted} attempted`}
                value={subject.accuracy}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
