import { ChevronRight, Clock3 } from 'lucide-react'
import { formatMinutesLabel } from '../../utils/formatDuration'

export default function MissionHeader({ mission }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">
        <span className="font-medium text-[#e8e8e8]">{mission.subject.name}</span>
        <ChevronRight size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
        <span className="text-[#cccccc]">{mission.chapter.name}</span>
        <ChevronRight size={13} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
        <span className="text-[#9d9d9d]">{mission.topic.name}</span>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#cccccc]">
        <Clock3 size={13} strokeWidth={1.75} className="text-[#858585]" />
        {formatMinutesLabel(mission.totalEstimatedMinutes * 60000)} total
      </span>
    </div>
  )
}
