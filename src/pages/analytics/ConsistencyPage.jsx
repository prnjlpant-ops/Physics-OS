import { useMemo, useState } from 'react'
import { CalendarDays, Trophy, CalendarRange, XCircle } from 'lucide-react'
import { getAllStudySessions } from '../../utils/studySessionsStorage'
import { groupSessionsByDate } from '../../utils/calendarStats'
import { formatHoursLabel } from '../../utils/formatDuration'
import { getConsistencySummary } from '../../data/analyticsData'
import ContributionHeatmap from '../../components/calendar/ContributionHeatmap'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import EmptyState from '../subject/EmptyState'

export default function ConsistencyPage() {
  const sessions = useMemo(() => getAllStudySessions(), [])
  const sessionsByDate = useMemo(() => groupSessionsByDate(sessions), [sessions])
  const summary = useMemo(() => getConsistencySummary(sessions), [sessions])
  const [selectedDay, setSelectedDay] = useState(null)

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No study history yet"
        description="Your consistency heatmap will fill in as you log Study Timer sessions."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <AnalyticsStatCard
          icon={Trophy}
          label="Best Week"
          value={summary.bestWeek ? formatHoursLabel(summary.bestWeek.ms) : '—'}
          accent
        />
        <AnalyticsStatCard
          icon={CalendarRange}
          label="Best Month"
          value={summary.bestMonth ? `${formatHoursLabel(summary.bestMonth.ms)} · ${summary.bestMonth.label}` : '—'}
        />
        <AnalyticsStatCard icon={XCircle} label="Missed Days" value={summary.missedDays} />
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="mb-4 text-sm font-semibold text-[#e8e8e8]">Contribution Heatmap</h3>
        <ContributionHeatmap
          sessionsByDate={sessionsByDate}
          selectedKey={selectedDay?.key}
          onSelectDay={setSelectedDay}
        />
      </section>
    </div>
  )
}
