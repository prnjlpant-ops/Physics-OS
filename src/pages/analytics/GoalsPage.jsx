import { useMemo } from 'react'
import { getAllStudySessions } from '../../utils/studySessionsStorage'
import { getWeekTotalMs, getMonthTotalMs, getTodayTotalMs, groupSessionsByDate } from '../../utils/calendarStats'
import { useAnalyticsGoals } from '../../hooks/useAnalyticsGoals'
import {
  DAILY_GOAL_PRESETS_MINUTES,
  WEEKLY_GOAL_PRESETS_MINUTES,
  MONTHLY_GOAL_PRESETS_MINUTES,
} from '../../constants/analyticsConstants'
import GoalSelectRow from '../../components/analytics/GoalSelectRow'
import GoalProgressRow from '../../components/analytics/GoalProgressRow'

function formatMinutesOption(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export default function GoalsPage() {
  const { goals, setGoal } = useAnalyticsGoals()

  const sessions = useMemo(() => getAllStudySessions(), [])
  const sessionsByDate = useMemo(() => groupSessionsByDate(sessions), [sessions])
  const todayMs = useMemo(() => getTodayTotalMs(sessionsByDate), [sessionsByDate])
  const weekMs = useMemo(() => getWeekTotalMs(sessions), [sessions])
  const monthMs = useMemo(() => getMonthTotalMs(sessions), [sessions])

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Progress Toward Goals</h3>
        <GoalProgressRow label="Daily Goal" currentMs={todayMs} targetMinutes={goals.daily} />
        <GoalProgressRow label="Weekly Goal" currentMs={weekMs} targetMinutes={goals.weekly} />
        <GoalProgressRow label="Monthly Goal" currentMs={monthMs} targetMinutes={goals.monthly} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Goal Targets</h3>
        <div className="flex flex-col gap-3">
          <GoalSelectRow
            label="Daily Goal"
            description="Target study time per day."
            value={goals.daily}
            onChange={(value) => setGoal('daily', value)}
            options={DAILY_GOAL_PRESETS_MINUTES}
            formatOption={formatMinutesOption}
          />
          <GoalSelectRow
            label="Weekly Goal"
            description="Target study time per week."
            value={goals.weekly}
            onChange={(value) => setGoal('weekly', value)}
            options={WEEKLY_GOAL_PRESETS_MINUTES}
            formatOption={formatMinutesOption}
          />
          <GoalSelectRow
            label="Monthly Goal"
            description="Target study time per month."
            value={goals.monthly}
            onChange={(value) => setGoal('monthly', value)}
            options={MONTHLY_GOAL_PRESETS_MINUTES}
            formatOption={formatMinutesOption}
          />
        </div>
      </section>
    </div>
  )
}
