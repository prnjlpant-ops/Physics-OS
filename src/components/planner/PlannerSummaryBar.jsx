import { Clock3, CheckCircle2, Hourglass, ListChecks } from 'lucide-react'
import { formatMinutesLabel } from '../../utils/formatDuration'

function SummaryStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#252526] text-[#858585]">
        <Icon size={14} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10px] uppercase tracking-wide text-[#6e6e6e]">{label}</p>
        <p className="truncate text-sm font-medium text-[#e8e8e8]">{value}</p>
      </div>
    </div>
  )
}

export default function PlannerSummaryBar({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      <SummaryStat icon={Clock3} label="Planned" value={formatMinutesLabel(summary.plannedMinutes * 60000)} />
      <SummaryStat icon={CheckCircle2} label="Completed Time" value={formatMinutesLabel(summary.completedMinutes * 60000)} />
      <SummaryStat icon={Hourglass} label="Remaining" value={formatMinutesLabel(summary.remainingMinutes * 60000)} />
      <SummaryStat
        icon={ListChecks}
        label="Completed Tasks"
        value={`${summary.completedTaskCount} / ${summary.totalTaskCount}`}
      />
    </div>
  )
}
