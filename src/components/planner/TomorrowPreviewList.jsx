import { CalendarClock } from 'lucide-react'
import { formatMinutesLabel } from '../../utils/formatDuration'
import { TOMORROW_PREVIEW_PLACEHOLDER } from '../../constants/plannerConstants'
import TaskPriorityBadge from '../dailyStudy/TaskPriorityBadge'

export default function TomorrowPreviewList() {
  return (
    <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <div className="flex items-center gap-2">
        <CalendarClock size={15} strokeWidth={1.75} className="text-[#858585]" />
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Tomorrow Preview</h3>
      </div>
      <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
        Placeholder preview — will read from the syllabus engine in a future sprint.
      </p>

      <div className="mt-3 flex flex-col gap-2">
        {TOMORROW_PREVIEW_PLACEHOLDER.map((task) => (
          <div
            key={task.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#cccccc]">{task.name}</p>
              <p className="truncate text-[11px] text-[#858585]">
                {task.subject} · {task.chapter} · {task.topic}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
                {formatMinutesLabel(task.estimatedMinutes * 60000)}
              </span>
              <TaskPriorityBadge priority={task.priority} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
