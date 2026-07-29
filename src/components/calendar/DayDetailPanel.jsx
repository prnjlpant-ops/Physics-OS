import { X } from 'lucide-react'
import { formatDuration, formatClockTime } from '../../utils/formatDuration'

export default function DayDetailPanel({ day, sessions, tasks = [], onClose }) {
  if (!day) return null

  const totalMs = sessions.reduce((sum, s) => sum + (s.totalStudyTime || 0), 0)
  const dateLabel = day.date.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const sortedSessions = [...sessions].sort((a, b) => (a.startTime || 0) - (b.startTime || 0))

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-[#3c3c3c] bg-[#252526] p-6 shadow-2xl transition-transform duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[#e8e8e8]">{dateLabel}</h2>
            <p className="mt-1 text-sm text-[#858585]">
              {formatDuration(totalMs)} total · {sessions.length} session
              {sessions.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="flex-shrink-0 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] p-1.5 text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#37373d]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {sortedSessions.length === 0 && (
            <p className="text-sm text-[#858585]">No study sessions recorded on this day.</p>
          )}

          {sortedSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] p-4 transition-colors duration-150"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-[#e8e8e8]">
                  {session.subject}
                </span>
                <span className="flex-shrink-0 font-mono text-xs text-[#8fd18f]">
                  {formatDuration(session.totalStudyTime)}
                </span>
              </div>

              <p className="mt-1 truncate text-xs text-[#858585]">{session.chapter}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-sm text-[#cccccc]">{session.task}</p>
                {session.confidence && (
                  <span className="flex-shrink-0 rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#cccccc]">
                    Confidence {session.confidence}/5
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 font-mono text-xs text-[#858585]">
                <span>{formatClockTime(session.startTime)}</span>
                <span>→</span>
                <span>{formatClockTime(session.endTime)}</span>
              </div>

              {(session.completedSummary || session.nextAction || session.conceptualTakeaway) && (
                <div className="mt-3 flex flex-col gap-2 border-t border-[#3c3c3c] pt-3">
                  {session.completedSummary && (
                    <p className="text-xs text-[#a8a8a8]">
                      <span className="font-medium uppercase tracking-wide text-[#858585]">
                        Completed:{' '}
                      </span>
                      {session.completedSummary}
                    </p>
                  )}
                  {session.nextAction && (
                    <p className="text-xs text-[#a8a8a8]">
                      <span className="font-medium uppercase tracking-wide text-[#858585]">
                        Next:{' '}
                      </span>
                      {session.nextAction}
                    </p>
                  )}
                  {session.conceptualTakeaway && (
                    <p className="text-xs text-[#a8a8a8]">
                      <span className="font-medium uppercase tracking-wide text-[#858585]">
                        Takeaway:{' '}
                      </span>
                      {session.conceptualTakeaway}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {tasks.length > 0 && (
          <div className="mt-6 border-t border-[#3c3c3c] pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#858585]">
              Tasks Completed ({tasks.length})
            </h3>
            <div className="mt-2 flex flex-col gap-1.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-xs text-[#cccccc]"
                >
                  {task.title}
                  {task.subject && <span className="text-[#858585]"> · {task.subject}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
