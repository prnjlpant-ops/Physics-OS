import { ChevronUp, ChevronDown, Copy, Pencil, Trash2, Check, RotateCcw } from 'lucide-react'
import TaskTypeIcon from './TaskTypeIcon'
import TaskStatusBadge from './TaskStatusBadge'
import TaskPriorityBadge from './TaskPriorityBadge'
import { CUSTOM_TASK_TYPE_ICON_KEY } from '../../constants/taskConstants'
import { TASK_STATUS } from '../../constants/dailyStudyConstants'

const iconButtonClasses =
  'rounded-md border border-[#3c3c3c] bg-[#2d2d2d] p-1.5 text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#37373d] disabled:cursor-not-allowed disabled:opacity-30'

/**
 * CUSTOM TASK CARD
 * ================
 * Sprint 27 — Study Engine & Today's Mission.
 * One row in the manual Task list: Complete/Reopen, Edit, Duplicate,
 * Delete, and Move Up/Down for reordering.
 */
export default function CustomTaskCard({ task, isFirst, isLast, onComplete, onReopen, onEdit, onDuplicate, onDelete, onMoveUp, onMoveDown }) {
  const isCompleted = task.status === TASK_STATUS.COMPLETED

  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] px-4 py-3 transition-colors duration-150 hover:border-[#4a4a4a]">
      <div className="mt-0.5 flex flex-col gap-1">
        <button type="button" disabled={isFirst} onClick={() => onMoveUp(task.id)} className={iconButtonClasses} aria-label="Move up">
          <ChevronUp size={12} strokeWidth={1.75} />
        </button>
        <button type="button" disabled={isLast} onClick={() => onMoveDown(task.id)} className={iconButtonClasses} aria-label="Move down">
          <ChevronDown size={12} strokeWidth={1.75} />
        </button>
      </div>

      <div className="mt-0.5 text-[#858585]">
        <TaskTypeIcon iconKey={CUSTOM_TASK_TYPE_ICON_KEY[task.type] ?? 'task'} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`text-sm font-medium ${isCompleted ? 'text-[#858585] line-through' : 'text-[#e8e8e8]'}`}>{task.title}</p>
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>

        {(task.subject || task.chapter || task.topic) && (
          <p className="mt-1 truncate text-xs text-[#858585]">
            {[task.subject, task.chapter, task.topic].filter(Boolean).join(' · ')}
          </p>
        )}

        {task.description && <p className="mt-1 text-xs text-[#a8a8a8]">{task.description}</p>}

        <p className="mt-1.5 font-mono text-[10px] text-[#6e6e6e]">
          {task.estimatedDuration} min{task.dueDate ? ` · due ${task.dueDate}` : ''}
        </p>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        {isCompleted ? (
          <button type="button" onClick={() => onReopen(task.id)} className={iconButtonClasses} aria-label="Reopen task">
            <RotateCcw size={13} strokeWidth={1.75} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onComplete(task.id)}
            className={`${iconButtonClasses} hover:border-[#2e5a2e] hover:text-[#8fd18f]`}
            aria-label="Complete task"
          >
            <Check size={13} strokeWidth={1.75} />
          </button>
        )}
        <button type="button" onClick={() => onEdit(task)} className={iconButtonClasses} aria-label="Edit task">
          <Pencil size={13} strokeWidth={1.75} />
        </button>
        <button type="button" onClick={() => onDuplicate(task.id)} className={iconButtonClasses} aria-label="Duplicate task">
          <Copy size={13} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className={`${iconButtonClasses} hover:border-[#5a1d1d] hover:text-[#f3b4b4]`}
          aria-label="Delete task"
        >
          <Trash2 size={13} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}
