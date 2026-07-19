import { Link } from 'react-router-dom'
import { formatDateLabel } from '../../utils/formatDuration'

export default function RecentAttemptRow({ test }) {
  return (
    <Link
      to={`/mock-tests/${test.id}/result`}
      className="flex items-center justify-between gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3 transition-colors duration-150 hover:border-[#4a4a4a]"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#e8e8e8]">{test.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-[#858585]">
          {test.exam} · {formatDateLabel(test.lastAttempt.date)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-[#e8e8e8]">{test.lastAttempt.percentage}%</p>
        <p className="text-[10px] text-[#6e6e6e]">Score {test.lastAttempt.score}</p>
      </div>
    </Link>
  )
}
