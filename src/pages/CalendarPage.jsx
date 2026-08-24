import { useEffect, useMemo, useState } from 'react'
import CalendarStatsBar from '../components/calendar/CalendarStatsBar'
import ContributionHeatmap from '../components/calendar/ContributionHeatmap'
import DayDetailPanel from '../components/calendar/DayDetailPanel'
import CalendarFilters from '../components/calendar/CalendarFilters'
import RecentSessions from '../components/calendar/RecentSessions'
import SessionEditModal from '../components/calendar/SessionEditModal'
import { getAllStudySessions, SESSIONS_CHANGED_EVENT } from '../utils/studySessionsStorage'
import TaskService from '../services/TaskService'
import { TASK_STATUS } from '../constants/dailyStudyConstants'
import {
  groupSessionsByDate,
  getTodayTotalMs,
  getWeekTotalMs,
  getMonthTotalMs,
  computeStreaks,
  filterSessionsByRange,
  searchSessions,
  toDateKey,
} from '../utils/calendarStats'

/** Sprint 27: groups completed custom tasks by the date they were completed on. */
function groupCompletedTasksByDate(tasks) {
  const map = new Map()
  tasks
    .filter((task) => task.status === TASK_STATUS.COMPLETED && task.completedAt)
    .forEach((task) => {
      const key = toDateKey(task.completedAt)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(task)
    })
  return map
}

export default function CalendarPage() {
  const [allSessions, setAllSessions] = useState(() => getAllStudySessions())
  const sessionsByDate = useMemo(() => groupSessionsByDate(allSessions), [allSessions])
  const allTasks = useMemo(() => TaskService.getAllTasks(), [])
  const tasksByDate = useMemo(() => groupCompletedTasksByDate(allTasks), [allTasks])

  const [selectedDay, setSelectedDay] = useState(null)
  const [filter, setFilter] = useState('all')
  const [customRange, setCustomRange] = useState({ from: '', to: '' })
  const [search, setSearch] = useState('')
  const [editingSession, setEditingSession] = useState(null)

  useEffect(() => {
    const refresh = () => setAllSessions(getAllStudySessions())
    window.addEventListener(SESSIONS_CHANGED_EVENT, refresh)
    return () => window.removeEventListener(SESSIONS_CHANGED_EVENT, refresh)
  }, [])

  const todayMs = useMemo(() => getTodayTotalMs(sessionsByDate), [sessionsByDate])
  const weekMs = useMemo(() => getWeekTotalMs(allSessions), [allSessions])
  const monthMs = useMemo(() => getMonthTotalMs(allSessions), [allSessions])
  const { current: currentStreak, longest: longestStreak } = useMemo(
    () => computeStreaks(sessionsByDate),
    [sessionsByDate],
  )

  const filteredSessions = useMemo(() => {
    const byRange = filterSessionsByRange(allSessions, filter, customRange)
    return searchSessions(byRange, search)
  }, [allSessions, filter, customRange, search])

  const selectedDaySessions = selectedDay ? sessionsByDate.get(selectedDay.key) || [] : []
  const selectedDayTasks = selectedDay ? tasksByDate.get(selectedDay.key) || [] : []

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-[#e8e8e8]">Calendar</h1>

      <CalendarStatsBar
        todayMs={todayMs}
        weekMs={weekMs}
        monthMs={monthMs}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
      />

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-5 transition-colors duration-150">
        <h2 className="text-sm font-semibold text-[#e8e8e8]">Study Activity</h2>
        <div className="mt-4">
          <ContributionHeatmap
            sessionsByDate={sessionsByDate}
            selectedKey={selectedDay?.key ?? null}
            onSelectDay={setSelectedDay}
          />
        </div>
      </section>

      <CalendarFilters
        filter={filter}
        onFilterChange={setFilter}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        search={search}
        onSearchChange={setSearch}
      />

      <RecentSessions sessions={filteredSessions} onEditSession={setEditingSession} />

      <DayDetailPanel
        day={selectedDay}
        sessions={selectedDaySessions}
        tasks={selectedDayTasks}
        onClose={() => setSelectedDay(null)}
        onEditSession={setEditingSession}
      />
      <SessionEditModal
        session={editingSession}
        onClose={() => setEditingSession(null)}
        onSaved={setAllSessions}
      />
    </div>
  )
}
