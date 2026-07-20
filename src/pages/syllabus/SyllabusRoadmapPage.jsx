import { useMemo } from 'react'
import { Flag } from 'lucide-react'
import { buildRoadmap, getRoadmapProgressCards, getUpcomingTasks } from '../../engine/roadmapEngine'
import { getBlueprintHighYieldChecklist } from '../../engine/blueprintService'
import { useSyllabusStatus } from '../../hooks/useSyllabusStatus'
import RoadmapProgressCard from '../../components/roadmap/RoadmapProgressCard'
import MonthlyTimeline from '../../components/roadmap/MonthlyTimeline'
import UpcomingTasks from '../../components/roadmap/UpcomingTasks'

/**
 * Roadmap Dashboard — Sprint 18B.
 * ================================
 * The Roadmap Engine (`engine/roadmapEngine.js`) reads the imported JEST
 * blueprint's month-by-month plan and joins it to the syllabus, producing
 * a Phase -> Month -> Subject -> Chapter -> Topic hierarchy. This page
 * composes that data into four pieces: Progress Cards (overall + per
 * phase), Upcoming Tasks, the Monthly Timeline itself, and the
 * blueprint's High-Yield Checklist carried over from Sprint 17.
 *
 * Completion is driven by real, live topic status (`useSyllabusStatus`) —
 * the same local-first tracker the rest of Syllabus already uses. Nothing
 * here schedules or adapts anything; it only reflects the blueprint's own
 * plan against where the person actually is.
 */
export default function SyllabusRoadmapPage() {
  const { overrides } = useSyllabusStatus()

  const phases = useMemo(() => buildRoadmap(overrides), [overrides])
  const progressCards = useMemo(() => getRoadmapProgressCards(phases), [phases])
  const upcomingTasks = useMemo(() => getUpcomingTasks(phases, 8), [phases])
  const highYield = getBlueprintHighYieldChecklist()

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Progress</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <RoadmapProgressCard
            title="Overall Roadmap"
            subtitle={`${progressCards.overall.monthCount} months`}
            completion={progressCards.overall.completion}
            chapterCount={progressCards.overall.chapterCount}
            estimatedHours={progressCards.overall.estimatedHours}
          />
          {progressCards.perPhase.map((phase) => (
            <RoadmapProgressCard
              key={phase.id}
              title={phase.phaseName}
              subtitle={phase.months.join(', ')}
              completion={phase.completion}
              chapterCount={phase.chapterCount}
              estimatedHours={phase.estimatedHours}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Upcoming Tasks</h3>
        <UpcomingTasks tasks={upcomingTasks} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Monthly Timeline</h3>
        <MonthlyTimeline phases={phases} />
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
