import { useMemo } from 'react'
import { Clock3 } from 'lucide-react'
import { getAllStudySessions } from '../../utils/studySessionsStorage'
import { filterSessionsByRange } from '../../utils/calendarStats'
import { formatHoursLabel, formatMinutesLabel } from '../../utils/formatDuration'
import { getStudyAnalytics } from '../../data/analyticsData'
import { getSubjects } from '../../engine/blueprintService'
import { useAnalyticsFilters } from './AnalyticsFilterContext'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import AnalyticsColumnChart from '../../components/analytics/AnalyticsColumnChart'
import AnalyticsBarRow from '../../components/analytics/AnalyticsBarRow'
import EmptyState from '../subject/EmptyState'

export default function StudyAnalyticsPage() {
  const { subjectId, dateRange } = useAnalyticsFilters()

  const filteredSessions = useMemo(() => {
    const all = getAllStudySessions()
    const byRange = filterSessionsByRange(all, dateRange)
    if (subjectId === 'all') return byRange
    const subject = getSubjects().find((s) => s.id === subjectId)
    return byRange.filter((s) => s.subject === subject?.name)
  }, [subjectId, dateRange])

  const analytics = useMemo(() => getStudyAnalytics(filteredSessions), [filteredSessions])

  if (filteredSessions.length === 0) {
    return (
      <EmptyState
        icon={Clock3}
        title="No study sessions yet"
        description="Log a session in the Study Timer to see your analytics here."
      />
    )
  }

  const maxDayOfWeekMs = Math.max(...analytics.dayOfWeekDistribution.map((d) => d.ms), 1)
  const maxWeeklyMs = Math.max(...analytics.weeklyDistribution.map((d) => d.ms), 1)
  const maxMonthlyMs = Math.max(...analytics.monthlyDistribution.map((d) => d.ms), 1)

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AnalyticsStatCard icon={Clock3} label="Sessions in Range" value={filteredSessions.length} accent />
        <AnalyticsStatCard
          icon={Clock3}
          label="Total Hours in Range"
          value={formatHoursLabel(filteredSessions.reduce((sum, s) => sum + (s.totalStudyTime || 0), 0))}
        />
        <AnalyticsStatCard
          icon={Clock3}
          label="Average Session Length"
          value={formatMinutesLabel(analytics.avgSessionLengthMs)}
        />
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="mb-4 text-sm font-semibold text-[#e8e8e8]">Study Hours — Last 30 Days</h3>
        <AnalyticsColumnChart series={analytics.dailyHoursSeries} height={140} />
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Daily Distribution</h3>
          <div className="flex flex-col gap-3">
            {analytics.dayOfWeekDistribution.map((day) => (
              <AnalyticsBarRow
                key={day.label}
                label={day.label}
                value={Math.round((day.ms / 3_600_000) * 10) / 10}
                max={Math.round((maxDayOfWeekMs / 3_600_000) * 10) / 10 || 1}
                suffix="h"
              />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Weekly Distribution — Last 8 Weeks</h3>
          <div className="flex flex-col gap-3">
            {analytics.weeklyDistribution.map((week, i) => (
              <AnalyticsBarRow
                key={`${week.label}-${i}`}
                label={`Week of ${week.label}`}
                value={Math.round((week.ms / 3_600_000) * 10) / 10}
                max={Math.round((maxWeeklyMs / 3_600_000) * 10) / 10 || 1}
                suffix="h"
                tone="good"
              />
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Monthly Distribution — Last 6 Months</h3>
        <div className="flex flex-col gap-3">
          {analytics.monthlyDistribution.map((month, i) => (
            <AnalyticsBarRow
              key={`${month.label}-${i}`}
              label={month.label}
              value={Math.round((month.ms / 3_600_000) * 10) / 10}
              max={Math.round((maxMonthlyMs / 3_600_000) * 10) / 10 || 1}
              suffix="h"
              tone="warn"
            />
          ))}
        </div>
      </section>
    </div>
  )
}
