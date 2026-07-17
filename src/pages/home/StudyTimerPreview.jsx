import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useStudyTimer } from '../../context/StudyTimerContext'
import TimerDisplay from '../../components/timer/TimerDisplay'
import TimerControls from '../../components/timer/TimerControls'

export default function StudyTimerPreview() {
  const { elapsedMs } = useStudyTimer()

  return (
    <section className="flex h-full flex-col rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#e8e8e8]">Study Timer</h2>
        <Link
          to="/study-timer"
          className="flex items-center gap-1 text-xs font-medium text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          Open
          <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="mt-6 flex flex-1 flex-col items-center justify-center">
        <TimerDisplay elapsedMs={elapsedMs} size="sm" />

        <div className="mt-6">
          <TimerControls compact />
        </div>
      </div>
    </section>
  )
}
