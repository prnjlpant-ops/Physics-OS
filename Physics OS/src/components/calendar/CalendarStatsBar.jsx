import { formatDuration } from '../../utils/formatDuration'

export default function CalendarStatsBar({
  todayMs,
  weekMs,
  monthMs,
  currentStreak,
  longestStreak,
}) {
  const stats = [
    { label: "Today's Study Time", value: formatDuration(todayMs) },
    { label: 'Current Week', value: formatDuration(weekMs) },
    { label: 'Current Month', value: formatDuration(monthMs) },
    { label: 'Current Streak', value: `${currentStreak} day${currentStreak === 1 ? '' : 's'}` },
    { label: 'Longest Streak', value: `${longestStreak} day${longestStreak === 1 ? '' : 's'}` },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3 transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-[#858585]">
            {stat.label}
          </p>
          <p className="mt-1.5 truncate font-mono text-lg text-[#e8e8e8]">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
