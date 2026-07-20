import { ListTodo } from 'lucide-react'
import { PRIORITY_STYLES } from './RoadmapProgressCard'

/**
 * UpcomingTasks — Sprint 18B.
 * ============================
 * The next not-yet-complete chapters, in roadmap order — a simple,
 * non-adaptive "what's next" list. No scheduling algorithm: just the
 * roadmap's own chronology, filtered to what isn't done yet.
 */
export default function UpcomingTasks({ tasks }) {
  if (tasks.length === 0) {
    return (
      <p className="text-xs text-[#6e6e6e]">Every chapter on the roadmap is marked complete — nothing upcoming.</p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div
          key={`${task.subjectId}-${task.slug}`}
          className="flex items-center gap-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2.5"
        >
          <ListTodo size={14} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[#e8e8e8]">{task.name}</p>
            <p className="mt-0.5 truncate text-[10px] text-[#6e6e6e]">
              {task.subjectName} · {task.month} · {task.phaseName}
            </p>
          </div>
          <span className="shrink-0 text-[10px] text-[#858585]">{task.estimatedHours} hrs</span>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
              PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.Low
            }`}
          >
            {task.priority}
          </span>
        </div>
      ))}
    </div>
  )
}
