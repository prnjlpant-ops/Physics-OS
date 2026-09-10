import { Target, PartyPopper } from 'lucide-react'
import { RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import { useDailyPlanner } from '../hooks/useDailyPlanner'
import { usePlannerSettings } from '../hooks/usePlannerSettings'
import { useProgress } from '../hooks/useProgress'
import { TIME_BLOCK_ORDER } from '../constants/plannerConstants'
import { toDateKey } from '../utils/calendarStats'
import PlannerSummaryBar from '../components/planner/PlannerSummaryBar'
import PlannerBlockColumn from '../components/planner/PlannerBlockColumn'
import TomorrowPreviewList from '../components/planner/TomorrowPreviewList'
import PlannerSettingsPanel from '../components/planner/PlannerSettingsPanel'
import ProgressSummaryBar from '../components/dailyStudy/ProgressSummaryBar'
import CustomTaskList from '../components/dailyStudy/CustomTaskList'
import EmptyState from './subject/EmptyState'
import { useSyllabusStatus } from '../hooks/useSyllabusStatus'
import { getMissionQueueSummary } from '../engine/dailyStudyService'

/**
 * TODAY'S MISSION / ADAPTIVE DAILY PLANNER
 * =========================================
 * Sprint 19A gave this page a flat task list generated from the syllabus's
 * current in-focus topic. Sprint 19B expands that into a full Adaptive
 * Daily Planner: the same tasks, organized into Morning / Afternoon /
 * Evening / Flexible, reorderable, with a Daily Summary, a placeholder
 * Tomorrow Preview, and UI-only Planner Settings. See hooks/useDailyPlanner.js
 * and engine/plannerService.js for the logic behind this page.
 */
export default function TodaysMissionPage() {
  const { plan, moveUp, moveDown, markComplete, skipTask, resetToday } = useDailyPlanner()
  const { settings, updateSetting, resetSettings } = usePlannerSettings()
  const progress = useProgress()
  const { overrides: syllabusStatuses } = useSyllabusStatus()
  const queueSummary = useMemo(() => getMissionQueueSummary(syllabusStatuses), [syllabusStatuses])
  const roadmapSnapshot = {
    outOfSequence: queueSummary.coreRemaining > 0
      ? [{ title: `${queueSummary.coreRemaining} core item${queueSummary.coreRemaining === 1 ? '' : 's'} still required before bonus and Phase B` }]
      : [],
  }
  const todayKey = toDateKey(new Date())

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <ProgressSummaryBar progress={progress} />

      {queueSummary.nextTopic && (
        <section className="rounded-lg border border-[#0e639c]/50 bg-[#0e639c]/10 p-4">
          <p className="text-[10px] uppercase tracking-wide text-[#4fc1ff]">Gated roadmap focus</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2">
              <p className="text-xs font-medium text-[#e8e8e8]">{queueSummary.nextTopic.name}</p>
              <p className="mt-0.5 text-[10px] text-[#858585]">Current gate: {queueSummary.stageLabel}</p>
            </div>
            {roadmapSnapshot.outOfSequence.length > 0 && (
              <div className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2">
                <p className="text-xs font-medium text-[#e8e8e8]">Core-gated sequence</p>
                <p className="mt-0.5 text-[10px] text-[#858585]">{roadmapSnapshot.outOfSequence.slice(0, 2).map((topic) => topic.title).join(' · ')}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#e8e8e8]">Today&apos;s Mission</h2>
          <p className="text-xs text-[#858585]">
            Adaptive Daily Planner — organized from your current syllabus progress.
          </p>
        </div>
        {!plan.isEmpty && !plan.isAllCaughtUp && (
          <button
            type="button"
            onClick={resetToday}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <RotateCcw size={13} strokeWidth={1.75} />
            Reset Today
          </button>
        )}
      </div>

      {plan.isEmpty && (
        <EmptyState
          icon={Target}
          title="No syllabus data available"
          description="Today's Mission needs syllabus content to generate a plan."
        />
      )}

      {plan.isAllCaughtUp && (
        <EmptyState
          icon={PartyPopper}
          title="You're all caught up!"
          description="Every topic in the syllabus is marked Mastered. Revisit a chapter to keep it sharp."
        />
      )}

      {!plan.isEmpty && !plan.isAllCaughtUp && (
        <div className="flex flex-col gap-5">
          <PlannerSummaryBar summary={plan.summary} />

          {plan.summary.totalTaskCount === 0 ? (
            <EmptyState
              icon={Target}
              title="No resources mapped to this topic yet"
              description="Add books, videos, PYQs or revision material for this chapter to populate tasks here."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {TIME_BLOCK_ORDER.map((block) => (
                <PlannerBlockColumn
                  key={block}
                  block={block}
                  tasks={plan.blocks[block]}
                  onMoveUp={moveUp}
                  onMoveDown={moveDown}
                  onMarkComplete={markComplete}
                  onSkip={skipTask}
                />
              ))}
            </div>
          )}

          <TomorrowPreviewList />

          <PlannerSettingsPanel settings={settings} onChange={updateSetting} onReset={resetSettings} />
        </div>
      )}

      <CustomTaskList dateKey={todayKey} />
    </div>
  )
}
