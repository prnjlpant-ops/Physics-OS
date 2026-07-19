import { formatHoursLabel } from '../../utils/formatDuration'

export default function GoalProgressRow({ label, currentMs, targetMinutes }) {
  const targetMs = targetMinutes * 60 * 1000
  const pct = targetMs > 0 ? Math.min(100, Math.round((currentMs / targetMs) * 100)) : 0
  const met = currentMs >= targetMs && targetMs > 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#cccccc]">{label}</span>
        <span className="text-[#858585]">
          {formatHoursLabel(currentMs)} / {formatHoursLabel(targetMs)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#3c3c3c]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${met ? 'bg-[#89d185]' : 'bg-[#0e639c]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-[#6e6e6e]">{pct}% of target{met ? ' — goal met' : ''}</p>
    </div>
  )
}
