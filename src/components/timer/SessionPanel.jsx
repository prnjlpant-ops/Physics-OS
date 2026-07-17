import { useStudyTimer } from '../../context/StudyTimerContext'
import { formatDuration, formatClockTime } from '../../utils/formatDuration'

export default function SessionPanel() {
  const { subject, chapter, task, startTime, elapsedMs, isSessionActive } =
    useStudyTimer()

  const fields = [
    { label: 'Current Subject', value: subject },
    { label: 'Current Chapter', value: chapter },
    { label: 'Current Task', value: task },
    {
      label: 'Session Start Time',
      value: isSessionActive ? formatClockTime(startTime) : '--:--',
    },
    { label: 'Elapsed Time', value: formatDuration(elapsedMs) },
  ]

  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="text-sm font-semibold text-[#e8e8e8]">Session</h2>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {fields.map((field) => (
          <div key={field.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              {field.label}
            </dt>
            <dd className="mt-1 truncate font-mono text-sm text-[#cccccc]">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
