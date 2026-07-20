import { CalendarClock } from 'lucide-react'
import SyllabusBadge from '../syllabus/SyllabusBadge'
import ChapterRoadmapRow from './ChapterRoadmapRow'

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

/**
 * MonthlyTimeline — Sprint 18B.
 * ==============================
 * Renders the full Phase -> Month -> Subject -> Chapter roadmap built by
 * `engine/roadmapEngine.js`. Each month shows every matched Subject with
 * its Chapters (Estimated Hours / Completion / Priority); clicking a
 * chapter expands its Resources / Notes / Formula Sheet / Memory Sheet /
 * PYQs links (see `ChapterRoadmapRow`).
 */
export default function MonthlyTimeline({ phases }) {
  return (
    <div className="flex flex-col gap-5">
      {phases.map((phase) => (
        <section key={phase.id} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CalendarClock size={14} strokeWidth={1.75} className="text-[#858585]" />
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[#9d9d9d]">{phase.phaseName}</h4>
          </div>

          <div className="flex flex-col gap-3">
            {phase.months.map((month) => (
              <div key={month.id} className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[#e8e8e8]">{month.month}</p>
                  <SyllabusBadge label={month.intensity} styleClass={intensityStyle(month.intensity)} />
                </div>
                <p className="text-xs leading-relaxed text-[#9d9d9d]">{month.focus}</p>
                {month.notes && <p className="text-[11px] leading-relaxed text-[#6e6e6e]">{month.notes}</p>}

                {month.subjects.length === 0 ? (
                  <p className="text-[11px] text-[#6e6e6e]">No syllabus subjects matched to this month yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {month.subjects.map((subject) => (
                      <div key={subject.id} className="flex flex-col gap-1.5">
                        <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{subject.name}</p>
                        <div className="flex flex-col gap-1.5">
                          {subject.chapters.map((chapter) => (
                            <ChapterRoadmapRow key={`${chapter.subjectId}-${chapter.slug}`} chapter={chapter} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
