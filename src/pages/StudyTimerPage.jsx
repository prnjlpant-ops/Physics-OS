import { useStudyTimer } from '../context/StudyTimerContext'
import TimerDisplay from '../components/timer/TimerDisplay'
import TimerControls from '../components/timer/TimerControls'
import SessionPanel from '../components/timer/SessionPanel'
import TopicLinkSelector from '../components/timer/TopicLinkSelector'
import SessionResourceLinks from '../components/timer/SessionResourceLinks'
import SessionNotesPanel from '../components/timer/SessionNotesPanel'
import FocusTargetPanel from '../components/timer/FocusTargetPanel'
import { formatDuration } from '../utils/formatDuration'

const statusLabel = {
  idle: 'Idle',
  running: 'Running',
  paused: 'Paused',
  ending: 'Ending',
}

export default function StudyTimerPage() {
  const { status, elapsedMs, subject, chapter, task, focusTargetMs } = useStudyTimer()

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <section className="flex flex-col items-center gap-6 rounded-lg border border-[#3c3c3c] bg-[#252526] px-6 py-10 transition-colors duration-150 sm:py-14">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors duration-150 ${
            status === 'running'
              ? 'border-[#2e5a2e] bg-[#1f2e1f] text-[#8fd18f]'
              : status === 'paused'
                ? 'border-[#5a4a1d] bg-[#2e2919] text-[#d1b98f]'
                : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]'
          }`}
        >
          {statusLabel[status] ?? 'Idle'}
        </span>

        <TimerDisplay elapsedMs={elapsedMs} size="lg" />

        <TimerControls />
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-3">
          <p className="text-[10px] uppercase tracking-wide text-[#858585]">Subject</p>
          <p className="mt-1 text-sm font-medium text-[#e8e8e8]">{subject}</p>
        </div>
        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-3">
          <p className="text-[10px] uppercase tracking-wide text-[#858585]">Chapter</p>
          <p className="mt-1 text-sm font-medium text-[#e8e8e8]">{chapter}</p>
        </div>
        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-3">
          <p className="text-[10px] uppercase tracking-wide text-[#858585]">Task</p>
          <p className="mt-1 text-sm font-medium text-[#e8e8e8]">{task}</p>
        </div>
        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-3">
          <p className="text-[10px] uppercase tracking-wide text-[#858585]">Focus target</p>
          <p className="mt-1 text-sm font-medium text-[#e8e8e8]">{formatDuration(focusTargetMs)}</p>
        </div>
      </section>

      <FocusTargetPanel />

      <TopicLinkSelector />

      <SessionPanel />

      <SessionResourceLinks />

      <SessionNotesPanel />
    </div>
  )
}
