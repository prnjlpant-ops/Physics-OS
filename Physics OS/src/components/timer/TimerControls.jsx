import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { useStudyTimer } from '../../context/StudyTimerContext'

const baseButtonClasses =
  'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40'

const neutralButtonClasses =
  'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a] hover:bg-[#37373d] disabled:hover:border-[#3c3c3c] disabled:hover:bg-[#2d2d2d]'

const primaryButtonClasses =
  'border-[#0e639c] bg-[#0e639c] text-[#ffffff] hover:bg-[#1177bb] disabled:hover:bg-[#0e639c]'

const dangerButtonClasses =
  'border-[#5a1d1d] bg-[#3a1f1f] text-[#f3b4b4] hover:bg-[#4a2626] disabled:hover:bg-[#3a1f1f]'

export default function TimerControls({ compact = false }) {
  const { status, start, pause, resume, endSession, reset } = useStudyTimer()

  const iconSize = compact ? 14 : 16

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {status !== 'running' && status !== 'paused' && (
        <button
          type="button"
          onClick={start}
          disabled={status === 'ending'}
          className={`${baseButtonClasses} ${primaryButtonClasses}`}
        >
          <Play size={iconSize} />
          Start
        </button>
      )}

      {status === 'running' && (
        <button
          type="button"
          onClick={pause}
          className={`${baseButtonClasses} ${neutralButtonClasses}`}
        >
          <Pause size={iconSize} />
          Pause
        </button>
      )}

      {status === 'paused' && (
        <button
          type="button"
          onClick={resume}
          className={`${baseButtonClasses} ${primaryButtonClasses}`}
        >
          <Play size={iconSize} />
          Resume
        </button>
      )}

      <button
        type="button"
        onClick={endSession}
        disabled={status !== 'running' && status !== 'paused'}
        className={`${baseButtonClasses} ${dangerButtonClasses}`}
      >
        <Square size={iconSize} />
        End Session
      </button>

      {!compact && (
        <button
          type="button"
          onClick={reset}
          disabled={status !== 'idle'}
          className={`${baseButtonClasses} ${neutralButtonClasses}`}
        >
          <RotateCcw size={iconSize} />
          Reset
        </button>
      )}
    </div>
  )
}
