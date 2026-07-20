import { TIME_BLOCK_DESCRIPTIONS } from '../../constants/plannerConstants'
import PlannerTaskCard from './PlannerTaskCard'

export default function PlannerBlockColumn({ block, tasks, onMoveUp, onMoveDown, onMarkComplete, onSkip }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] p-3">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">{block}</h3>
          <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#858585]">
            {tasks.length}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">{TIME_BLOCK_DESCRIPTIONS[block]}</p>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-[#3c3c3c] px-3 py-6">
          <p className="text-center text-[11px] text-[#6e6e6e]">No tasks in this block.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {tasks.map((task, index) => (
            <PlannerTaskCard
              key={task.id}
              task={task}
              isFirst={index === 0}
              isLast={index === tasks.length - 1}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onMarkComplete={onMarkComplete}
              onSkip={onSkip}
            />
          ))}
        </div>
      )}
    </div>
  )
}
