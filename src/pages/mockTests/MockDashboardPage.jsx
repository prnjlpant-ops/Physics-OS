import { useMemo } from 'react'
import {
  ClipboardList,
  FileStack,
  BookOpen,
  History,
  Target,
  Trophy,
  Percent,
  ListChecks,
  Clock3,
  PlayCircle,
  BarChart3,
  RefreshCw,
} from 'lucide-react'
import StatCard from '../../components/mockTests/StatCard'
import QuickActionButton from '../../components/mockTests/QuickActionButton'
import RecentAttemptRow from '../../components/mockTests/RecentAttemptRow'
import UpcomingMockCard from '../../components/mockTests/UpcomingMockCard'
import EmptyState from '../subject/EmptyState'
import {
  getMockCounts,
  getQuickStatistics,
  getRecentAttempts,
  getUpcomingMock,
} from '../../data/mockTestsData'

export default function MockDashboardPage() {
  const counts = useMemo(() => getMockCounts(), [])
  const stats = useMemo(() => getQuickStatistics(), [])
  const recentAttempts = useMemo(() => getRecentAttempts(5), [])
  const upcomingMock = useMemo(() => getUpcomingMock(), [])

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total Mocks" value={counts.total} accent />
        <StatCard icon={FileStack} label="Full Length" value={counts.fullLength} />
        <StatCard icon={BookOpen} label="Subject Tests" value={counts.subjectTests} />
        <StatCard icon={History} label="Chapter Tests" value={counts.chapterTests} />
      </section>

      <section>
        <h3 className="mb-2.5 text-sm font-semibold text-[#e8e8e8]">Quick Statistics</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard icon={Target} label="Average Score" value={`${stats.averageScore}%`} />
          <StatCard icon={Trophy} label="Best Score" value={`${stats.bestScore}%`} />
          <StatCard icon={Percent} label="Accuracy" value={`${stats.accuracy}%`} />
          <StatCard icon={ListChecks} label="Total Tests" value={stats.totalTests} />
          <StatCard icon={Clock3} label="Hours Practiced" value={stats.hoursPracticed} />
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-sm font-semibold text-[#e8e8e8]">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <QuickActionButton icon={PlayCircle} label="Start Full Mock" to="/mock-tests/library" />
          <QuickActionButton icon={BookOpen} label="Subject Test" to="/mock-tests/library" />
          <QuickActionButton icon={FileStack} label="Chapter Test" to="/mock-tests/library" />
          <QuickActionButton icon={BarChart3} label="View Analysis" to="/mock-tests/analysis" />
          <QuickActionButton icon={RefreshCw} label="Revision Queue" to="/mock-tests/revision-queue" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Recent Attempts</h3>
          {recentAttempts.length === 0 ? (
            <EmptyState icon={History} title="No attempts yet" description="Start a mock to see it here." />
          ) : (
            <div className="flex flex-col gap-2">
              {recentAttempts.map((test) => (
                <RecentAttemptRow key={test.id} test={test} />
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Upcoming Planned Mock</h3>
          <UpcomingMockCard test={upcomingMock} />
        </section>
      </div>
    </div>
  )
}
