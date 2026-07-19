import { useMemo } from 'react'
import {
  Clock3,
  ListChecks,
  Gauge,
  Flame,
  Trophy,
  CheckCircle2,
  Calendar,
  Timer,
  BookOpen,
  Library,
  FileText,
  Brain,
  NotebookPen,
  FlaskConical,
  RefreshCw,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react'
import { getAllStudySessions } from '../../utils/studySessionsStorage'
import { computeStreaks, groupSessionsByDate } from '../../utils/calendarStats'
import { getAllNotes } from '../../utils/notesStorage'
import { formatHoursLabel } from '../../utils/formatDuration'
import { getDashboardOverview } from '../../data/analyticsData'
import { getMockCounts, getQuickStatistics } from '../../data/mockTestsData'
import { getDashboardStats as getErrorDashboardStats } from '../../data/errorLearningData'
import { getAllResources } from '../../data/resourcesData'
import { getAllPyqs } from '../../data/pyqsData'
import { getAllFormulaCards } from '../../data/formulaSheetsData'
import { getAllMemoryCards } from '../../data/memorySheetsData'
import { getAllActiveRecallCards } from '../../data/activeRecallData'
import { useFormulaBookmarks } from '../../hooks/useFormulaBookmarks'
import { useMemoryReviewed } from '../../hooks/useMemoryReviewed'
import { useActiveRecallReviewed } from '../../hooks/useActiveRecallReviewed'
import { usePyqRevisionQueue } from '../../hooks/usePyqRevisionQueue'
import { useFavorites } from '../../hooks/useFavorites'
import { useAnalyticsGoals } from '../../hooks/useAnalyticsGoals'
import { useAnalyticsFilters } from './AnalyticsFilterContext'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import ModuleSnapshotCard from '../../components/analytics/ModuleSnapshotCard'
import GoalProgressRow from '../../components/analytics/GoalProgressRow'
import EmptyState from '../subject/EmptyState'

export default function AnalyticsDashboardPage() {
  const { search, moduleFilter } = useAnalyticsFilters()
  const { goals } = useAnalyticsGoals()

  const overview = useMemo(() => getDashboardOverview(), [])
  const { current: currentStreak, longest: longestStreak } = useMemo(() => {
    const sessions = getAllStudySessions()
    return computeStreaks(groupSessionsByDate(sessions))
  }, [])

  const mockCounts = useMemo(() => getMockCounts(), [])
  const mockStats = useMemo(() => getQuickStatistics(), [])
  const errorStats = useMemo(() => getErrorDashboardStats(), [])
  const resourceCount = useMemo(() => getAllResources().length, [])
  const pyqCount = useMemo(() => getAllPyqs().length, [])
  const formulaCards = useMemo(() => getAllFormulaCards(), [])
  const memoryCards = useMemo(() => getAllMemoryCards(), [])
  const recallCards = useMemo(() => getAllActiveRecallCards(), [])
  const noteCount = useMemo(() => getAllNotes().length, [])

  const { bookmarkedIds: formulaBookmarked } = useFormulaBookmarks()
  const { reviewedIds: memoryReviewed } = useMemoryReviewed()
  const { reviewedIds: recallReviewed } = useActiveRecallReviewed()
  const { queuedIds: pyqQueued } = usePyqRevisionQueue()
  const { favoriteIds: resourceFavorites } = useFavorites()

  const modules = [
    {
      label: 'Study Timer',
      icon: Timer,
      value: `${overview.totalSessions} sessions`,
      sublabel: formatHoursLabel(overview.totalStudyMs),
      to: '/study-timer',
    },
    {
      label: 'Calendar',
      icon: Calendar,
      value: `${currentStreak}-day streak`,
      sublabel: `Longest: ${longestStreak} days`,
      to: '/calendar',
    },
    {
      label: 'Subjects',
      icon: BookOpen,
      value: `${overview.completion}% complete`,
      sublabel: 'Across the full syllabus',
      to: '/subjects',
    },
    {
      label: 'Resources',
      icon: Library,
      value: `${resourceCount} catalogued`,
      sublabel: `${resourceFavorites?.length ?? 0} favorited`,
      to: '/resources',
    },
    {
      label: 'Formula Sheets',
      icon: FileText,
      value: `${formulaBookmarked.length}/${formulaCards.length} bookmarked`,
      sublabel: 'Cards starred for quick recall',
      to: '/formula-sheets',
    },
    {
      label: 'Memory Sheets',
      icon: Brain,
      value: `${memoryReviewed.length}/${memoryCards.length} reviewed`,
      sublabel: 'Revision Mode progress',
      to: '/memory-sheets',
    },
    {
      label: 'Notes',
      icon: NotebookPen,
      value: `${noteCount} notes`,
      sublabel: 'Written across all chapters',
      to: '/notes',
    },
    {
      label: 'PYQs',
      icon: FlaskConical,
      value: `${pyqQueued.length} in revision`,
      sublabel: `${pyqCount} questions catalogued`,
      to: '/pyqs',
    },
    {
      label: 'Active Recall',
      icon: RefreshCw,
      value: `${recallReviewed.length}/${recallCards.length} reviewed`,
      sublabel: 'Cards seen at least once',
      to: '/active-recall',
    },
    {
      label: 'Mock Tests',
      icon: ClipboardCheck,
      value: `${mockStats.totalTests}/${mockCounts.total} attempted`,
      sublabel: `Avg. score ${mockStats.averageScore}%`,
      to: '/mock-tests',
    },
    {
      label: 'Error Learning',
      icon: AlertTriangle,
      value: `${errorStats.pendingRevision} pending`,
      sublabel: `${errorStats.resolvedErrors} resolved`,
      to: '/error-learning',
    },
  ]

  const query = search.trim().toLowerCase()
  const filteredModules = modules.filter((mod) => {
    if (moduleFilter !== 'All Modules' && mod.label !== moduleFilter) return false
    if (query && !mod.label.toLowerCase().includes(query)) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <AnalyticsStatCard icon={Clock3} label="Total Study Hours" value={formatHoursLabel(overview.totalStudyMs)} accent />
        <AnalyticsStatCard icon={ListChecks} label="Total Sessions" value={overview.totalSessions} />
        <AnalyticsStatCard icon={Gauge} label="Avg. Daily Study Time" value={formatHoursLabel(overview.avgDailyMs)} />
        <AnalyticsStatCard icon={CheckCircle2} label="Completion %" value={`${overview.completion}%`} />
        <AnalyticsStatCard icon={Flame} label="Current Streak" value={`${overview.currentStreak} days`} />
        <AnalyticsStatCard icon={Trophy} label="Longest Streak" value={`${overview.longestStreak} days`} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Weekly Progress</h3>
            {overview.weeklyTrendPct !== null && (
              <span className={overview.weeklyTrendPct >= 0 ? 'text-xs text-[#89d185]' : 'text-xs text-[#f48771]'}>
                {overview.weeklyTrendPct >= 0 ? '+' : ''}
                {overview.weeklyTrendPct}% vs last week
              </span>
            )}
          </div>
          <GoalProgressRow label="This week" currentMs={overview.weekMs} targetMinutes={goals.weekly} />
        </div>

        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Monthly Progress</h3>
            {overview.monthlyTrendPct !== null && (
              <span className={overview.monthlyTrendPct >= 0 ? 'text-xs text-[#89d185]' : 'text-xs text-[#f48771]'}>
                {overview.monthlyTrendPct >= 0 ? '+' : ''}
                {overview.monthlyTrendPct}% vs last month
              </span>
            )}
          </div>
          <GoalProgressRow label="This month" currentMs={overview.monthMs} targetMinutes={goals.monthly} />
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Module Snapshot</h3>
        {filteredModules.length === 0 ? (
          <EmptyState icon={AlertTriangle} title="No modules match your search or filter" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredModules.map((mod) => (
              <ModuleSnapshotCard key={mod.label} {...mod} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
