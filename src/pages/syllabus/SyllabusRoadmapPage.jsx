import { CalendarClock, Flag } from 'lucide-react'
import { getBlueprintRoadmap, getBlueprintHighYieldChecklist } from '../../engine/blueprintService'
import SyllabusBadge from '../../components/syllabus/SyllabusBadge'

/**
 * Roadmap — Sprint 17.
 * ====================
 * The study roadmap is generated automatically from the imported JEST
 * blueprint's month-by-month plan (see engine/blueprintService.js ->
 * getBlueprintRoadmap). Nothing here is hand-authored — replacing the
 * blueprint file updates this page automatically.
 */

const INTENSITY_STYLES = {
  low: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  moderate: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  high: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
  'very high': 'border-[#f48771]/50 bg-[#f48771]/20 text-[#f48771]',
}

function intensityStyle(intensity) {
  const key = String(intensity ?? '').toLowerCase()
  const matched = Object.keys(INTENSITY_STYLES).find((k) => key.includes(k))
  return INTENSITY_STYLES[matched] ?? INTENSITY_STYLES.low
}

export default function SyllabusRoadmapPage() {
  const roadmap = getBlueprintRoadmap()
  const highYield = getBlueprintHighYieldChecklist()

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock size={16} strokeWidth={1.75} className="text-[#858585]" />
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Eight-Month Strategic Timeline</h3>
        </div>
        <div className="flex flex-col gap-2">
          {roadmap.map((phase) => (
            <div
              key={phase.month}
              className="flex flex-col gap-1.5 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3 transition-colors duration-150 hover:border-[#4a4a4a]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#e8e8e8]">{phase.month}</p>
                <div className="flex items-center gap-2">
                  <SyllabusBadge label={phase.phase} styleClass="border-[#4fc1ff]/30 bg-[#4fc1ff]/10 text-[#4fc1ff]" />
                  <SyllabusBadge label={phase.intensity} styleClass={intensityStyle(phase.intensity)} />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[#9d9d9d]">{phase.focus}</p>
              {phase.notes && <p className="text-[11px] leading-relaxed text-[#6e6e6e]">{phase.notes}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Flag size={16} strokeWidth={1.75} className="text-[#858585]" />
          <h3 className="text-sm font-semibold text-[#e8e8e8]">High-Yield Checklist</h3>
        </div>
        <div className="flex flex-col gap-2">
          {highYield.map((item) => (
            <div
              key={item.rank}
              className="flex items-start gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3 transition-colors duration-150 hover:border-[#4a4a4a]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#1e1e1e] text-[11px] font-semibold text-[#cccccc]">
                {item.rank}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#e8e8e8]">{item.topic}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#6e6e6e]">{item.subject}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#9d9d9d]">{item.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
