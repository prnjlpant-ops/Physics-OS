const PRIORITY_STYLES = {
  High: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
  Medium: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  Low: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
}

export { PRIORITY_STYLES }

/**
 * RoadmapProgressCard — Sprint 18B.
 * ==================================
 * Used both for the single "Overall" summary card and for one card per
 * Phase on the Roadmap Dashboard.
 */
export default function RoadmapProgressCard({ title, subtitle, completion, chapterCount, estimatedHours }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <div>
        <p className="text-xs font-semibold text-[#e8e8e8]">{title}</p>
        {subtitle && <p className="mt-0.5 text-[10px] text-[#6e6e6e]">{subtitle}</p>}
      </div>

      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-[#e8e8e8]">{completion}%</span>
        <span className="text-[10px] text-[#858585]">complete</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3c3c3c]">
        <div
          className="h-full rounded-full bg-[#0e639c] transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-[#858585]">
        <span>{chapterCount} chapters</span>
        <span>{estimatedHours} hrs estimated</span>
      </div>
    </div>
  )
}
