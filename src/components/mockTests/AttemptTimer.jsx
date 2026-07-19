import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'
import { formatDuration } from '../../utils/formatDuration'

/**
 * Attempt-screen timer. This is UI-only: it counts down from the test's
 * duration purely for visual realism. Nothing is evaluated or submitted
 * automatically when it reaches zero — actual question solving / auto
 * evaluation is explicitly out of scope for this sprint.
 */
export default function AttemptTimer({ durationMinutes }) {
  const [remainingMs, setRemainingMs] = useState(durationMinutes * 60 * 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs((prev) => Math.max(prev - 1000, 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const isLow = remainingMs < 5 * 60 * 1000

  return (
    <div
      className={[
        'flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium tabular-nums',
        isLow
          ? 'border-[#f48771]/40 bg-[#f48771]/10 text-[#f48771]'
          : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc]',
      ].join(' ')}
    >
      <Timer size={15} strokeWidth={1.75} />
      {formatDuration(remainingMs)}
    </div>
  )
}
