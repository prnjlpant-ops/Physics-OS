import { formatDuration, formatClockTime, formatDateLabel } from '../../utils/formatDuration'

export default function RecentSessions({ sessions }) {
  const recent = [...sessions]
    .sort((a, b) => (b.startTime || 0) - (a.startTime || 0))
    .slice(0, 10)

  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="text-sm font-semibold text-[#e8e8e8]">Recent Sessions</h2>

      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-[#858585]">No study sessions match the current filters.</p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-[#3c3c3c]">
          {recent.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between gap-4 py-3 transition-colors duration-150 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#e8e8e8]">{session.subject}</p>
                <p className="truncate text-xs text-[#858585]">
                  {session.chapter} · {session.task}
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end">
                <span className="font-mono text-xs text-[#cccccc]">
                  {formatDuration(session.totalStudyTime)}
                </span>
                <span className="text-[10px] text-[#858585]">
                  {formatDateLabel(session.startTime)} · {formatClockTime(session.startTime)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
