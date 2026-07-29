import { formatDuration, formatMinutesLabel, formatDateLabel } from '../../utils/formatDuration'

/**
 * PROGRESS SUMMARY BAR
 * ====================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Renders the Progress metrics the sprint spec lists, sourced live from
 * `hooks/useProgress.js`. Mirrors `components/calendar/CalendarStatsBar.jsx`'s
 * card grid so Progress reads as the same visual language already used for
 * study-time stats, rather than a new pattern.
 */
export default function ProgressSummaryBar({ progress }) {
  const stats = [
    { label: 'Total Study Time', value: formatDuration(progress.totalStudyTimeMs) },
    { label: "Today's Study Time", value: formatDuration(progress.todayStudyTimeMs) },
    { label: 'Weekly Study Time', value: formatMinutesLabel(progress.weeklyStudyTimeMs) },
    { label: 'Completed Tasks', value: String(progress.completedTasks) },
    { label: 'Completed Sessions', value: String(progress.completedSessions) },
    {
      label: 'Completed Topics',
      value: progress.totalTopics > 0 ? `${progress.completedTopics} / ${progress.totalTopics}` : '0',
    },
    {
      label: 'Last Studied',
      value: progress.lastStudiedDate ? formatDateLabel(new Date(progress.lastStudiedDate).getTime()) : 'Never',
    },
    { label: 'Current Streak', value: `${progress.currentStreak} day${progress.currentStreak === 1 ? '' : 's'}` },
  ]

  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="text-sm font-semibold text-[#e8e8e8]">Progress</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2.5 transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#858585]">{stat.label}</p>
            <p className="mt-1 truncate font-mono text-sm text-[#e8e8e8]">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
