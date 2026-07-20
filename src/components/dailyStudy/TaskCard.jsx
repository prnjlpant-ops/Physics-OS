import { Link } from 'react-router-dom'
import { PlayCircle, CheckCircle2 } from 'lucide-react'
import { formatMinutesLabel } from '../../utils/formatDuration'
import { TASK_STATUS } from '../../constants/dailyStudyConstants'
import TaskTypeIcon from './TaskTypeIcon'
import TaskPriorityBadge from './TaskPriorityBadge'
import TaskStatusBadge from './TaskStatusBadge'

export default function TaskCard({ task, onStart, onComplete }) {
  const isCompleted = task.status === TASK_STATUS.COMPLETED

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
            <TaskTypeIcon iconKey={task.iconKey} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{task.type}</p>
            <p className={`mt-0.5 truncate text-sm font-medium ${isCompleted ? 'text-[#6e6e6e] line-through' : 'text-[#e8e8e8]'}`}>
              {task.title}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#3c3c3c] pt-2.5">
        <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
          {formatMinutesLabel(task.estimatedMinutes * 60000)}
        </span>
        <TaskPriorityBadge priority={task.priority} />
        <TaskStatusBadge status={task.status} />
      </div>

      <div className="flex gap-2 border-t border-[#3c3c3c] pt-2.5">
        <Link
          to={task.link ?? '#'}
          onClick={() => onStart(task.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 py-1.5 text-xs font-medium text-[#4fc1ff] transition-colors duration-150 hover:bg-[#0e639c]/20"
        >
          <PlayCircle size={13} strokeWidth={1.75} />
          Start Session
        </Link>
        <button
          type="button"
          onClick={() => onComplete(task.id)}
          disabled={isCompleted}
          className={[
            'flex flex-1 items-center justify-center gap-1.5 rounded-md border py-1.5 text-xs font-medium transition-colors duration-150',
            isCompleted
              ? 'cursor-not-allowed border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]'
              : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a]',
          ].join(' ')}
        >
          <CheckCircle2 size={13} strokeWidth={1.75} />
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  )
}
