import { formatDuration } from '../../utils/formatDuration'

export default function TimerDisplay({ elapsedMs, size = 'lg' }) {
  const sizeClasses =
    size === 'lg'
      ? 'text-6xl sm:text-7xl'
      : 'text-4xl'

  return (
    <p
      className={`font-mono ${sizeClasses} font-semibold tracking-wider text-[#e8e8e8] tabular-nums transition-colors duration-150`}
    >
      {formatDuration(elapsedMs)}
    </p>
  )
}
