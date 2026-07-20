import { Link } from 'react-router-dom'
import { Target, PartyPopper, ArrowRight } from 'lucide-react'
import { useTodaysMission } from '../../hooks/useTodaysMission'
import { formatMinutesLabel } from '../../utils/formatDuration'
import TaskTypeIcon from '../../components/dailyStudy/TaskTypeIcon'
import TaskStatusBadge from '../../components/dailyStudy/TaskStatusBadge'

export default function TodaysMissionSection() {
  const { mission } = useTodaysMission()

  return (
    <section className="flex h-full flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#e8e8e8]">Today&apos;s Mission</h2>
        <Link
          to="/todays-mission"
          className="flex items-center gap-1 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          View all
          <ArrowRight size={12} strokeWidth={1.75} />
        </Link>
      </div>

      {mission.isEmpty && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-[#858585]">No tasks scheduled.</p>
        </div>
      )}

      {mission.isAllCaughtUp && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <PartyPopper size={20} strokeWidth={1.75} className="text-[#89d185]" />
          <p className="text-sm text-[#cccccc]">You&apos;re all caught up!</p>
        </div>
      )}

      {!mission.isEmpty && !mission.isAllCaughtUp && (
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#4fc1ff]">
              <Target size={15} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-[#858585]">
                {mission.subject.name} · {mission.chapter.name}
              </p>
              <p className="truncate text-sm font-medium text-[#e8e8e8]">{mission.topic.name}</p>
            </div>
          </div>

          {mission.tasks.length === 0 ? (
            <p className="text-xs text-[#858585]">No resources mapped to this topic yet.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {mission.tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5">
                  <TaskTypeIcon iconKey={task.iconKey} size={13} className="shrink-0 text-[#858585]" />
                  <p className="min-w-0 flex-1 truncate text-xs text-[#cccccc]">{task.title}</p>
                  <TaskStatusBadge status={task.status} />
                </div>
              ))}
              {mission.tasks.length > 3 && (
                <p className="text-[10px] text-[#6e6e6e]">+{mission.tasks.length - 3} more tasks</p>
              )}
            </div>
          )}

          <p className="mt-auto border-t border-[#3c3c3c] pt-2.5 text-[11px] text-[#858585]">
            Estimated total: {formatMinutesLabel(mission.totalEstimatedMinutes * 60000)}
          </p>
        </div>
      )}
    </section>
  )
}
