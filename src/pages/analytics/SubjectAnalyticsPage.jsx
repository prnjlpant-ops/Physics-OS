import { useMemo } from 'react'
import { BookOpen } from 'lucide-react'
import { getAllStudySessions } from '../../utils/studySessionsStorage'
import { getSubjectAnalyticsList } from '../../data/analyticsData'
import { useAnalyticsFilters } from './AnalyticsFilterContext'
import SubjectAnalyticsCard from '../../components/analytics/SubjectAnalyticsCard'
import EmptyState from '../subject/EmptyState'

export default function SubjectAnalyticsPage() {
  const { subjectId, search } = useAnalyticsFilters()

  const subjectList = useMemo(() => {
    const sessions = getAllStudySessions()
    return getSubjectAnalyticsList(sessions)
  }, [])

  const query = search.trim().toLowerCase()
  const filtered = subjectList.filter((subject) => {
    if (subjectId !== 'all' && subject.id !== subjectId) return false
    if (query && !subject.name.toLowerCase().includes(query)) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Subject Analytics</h3>
        <span className="text-xs text-[#858585]">{filtered.length} subjects</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No subjects match your search or filter" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((subject) => (
            <SubjectAnalyticsCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  )
}
