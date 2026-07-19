import { Link } from 'react-router-dom'
import { BookOpen, Clock3, RefreshCw, Target } from 'lucide-react'
import { formatHoursLabel } from '../../utils/formatDuration'
import AnalyticsBarRow from './AnalyticsBarRow'

export default function SubjectAnalyticsCard({ subject }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/subjects/${subject.id}/progress`}
          className="truncate text-sm font-medium text-[#e8e8e8] hover:text-[#4fc1ff]"
        >
          {subject.name}
        </Link>
        <span className="shrink-0 text-xs font-semibold text-[#4fc1ff]">{subject.completion}%</span>
      </div>

      <AnalyticsBarRow label="Completion" value={subject.completion} />

      <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px] text-[#9d9d9d]">
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
          {subject.chaptersCompleted}/{subject.totalChapters} ch.
        </div>
        <div className="flex items-center gap-1.5">
          <Clock3 size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
          {formatHoursLabel(subject.studyHoursMs)}
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
          {subject.revisionPercent}% rev.
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px] text-[#9d9d9d]">
        <Target size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
        Mock Accuracy:{' '}
        <span className="font-medium text-[#e8e8e8]">
          {subject.mockAccuracy !== null ? `${subject.mockAccuracy}%` : 'No attempts yet'}
        </span>
      </div>
    </div>
  )
}
