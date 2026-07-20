import { Link } from 'react-router-dom'
import { ArrowUp, ArrowDown, CheckCircle2, XCircle } from 'lucide-react'
import { formatMinutesLabel } from '../../utils/formatDuration'
import { TASK_STATUS } from '../../constants/dailyStudyConstants'
import TaskPriorityBadge from '../dailyStudy/TaskPriorityBadge'
import TaskStatusBadge from '../dailyStudy/TaskStatusBadge'

export default function PlannerTaskCard({
  task,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onMarkComplete,
  onSkip,
}) {
  const isCompleted = task.status === TASK_STATUS.COMPLETED
  const isSkipped = task.status === TASK_STATUS.SKIPPED
  const isSettled = isCompleted || isSkipped

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3">
      <div className="min-w-0">
        {task.link ? (
          <Link
            to={task.link}
            className={`truncate text-sm font-medium transition-colors duration-150 hover:text-[#4fc1ff] ${
              isSettled ? 'text-[#6e6e6e] line-through' : 'text-[#e8e8e8]'
            }`}
          >
            {task.name}
          </Link>
        ) : (
          <p className={`truncate text-sm font-medium ${isSettled ? 'text-[#6e6e6e] line-through' : 'text-[#e8e8e8]'}`}>
            {task.name}
          </p>
        )}
        <p className="mt-0.5 truncate text-[11px] text-[#858585]">
          {task.subjectName} · {task.chapterName} · {task.topicName}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
          {formatMinutesLabel(task.estimatedMinutes * 60000)}
        </span>
        <TaskPriorityBadge priority={task.priority} />
        <TaskStatusBadge status={task.status} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#3c3c3c] pt-2.5">
        <button
          type="button"
          onClick={() => onMoveUp(task.id)}
          disabled={isFirst}
          title="Move Up"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowUp size={13} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(task.id)}
          disabled={isLast}
          title="Move Down"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowDown size={13} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => onMarkComplete(task.id)}
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
        <button
          type="button"
          onClick={() => onSkip(task.id)}
          disabled={isSkipped}
          className={[
            'flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150',
            isSkipped
              ? 'cursor-not-allowed border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]'
              : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a]',
          ].join(' ')}
        >
          <XCircle size={13} strokeWidth={1.75} />
          Skip
        </button>
      </div>
    </div>
  )
}
