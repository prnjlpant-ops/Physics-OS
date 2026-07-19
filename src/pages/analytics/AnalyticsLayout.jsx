import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import { ANALYTICS_TABS } from '../../constants/analyticsConstants'
import { AnalyticsFilterProvider, useAnalyticsFilters } from './AnalyticsFilterContext'
import AnalyticsFilterBar from '../../components/analytics/AnalyticsFilterBar'

function AnalyticsFilterBarConnected() {
  const { search, setSearch, subjectId, setSubjectId, dateRange, setDateRange, moduleFilter, setModuleFilter } =
    useAnalyticsFilters()

  return (
    <AnalyticsFilterBar
      search={search}
      onSearchChange={setSearch}
      subjectId={subjectId}
      onSubjectChange={setSubjectId}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      moduleFilter={moduleFilter}
      onModuleFilterChange={setModuleFilter}
    />
  )
}

export default function AnalyticsLayout() {
  return (
    <AnalyticsFilterProvider>
      <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc]">
            <BarChart3 size={22} strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#e8e8e8]">Analytics</h2>
            <p className="text-xs text-[#858585]">
              What have I studied, where am I weak, and what should I revise next.
            </p>
          </div>
        </div>

        <AnalyticsFilterBarConnected />

        <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-[#3c3c3c] px-1 pb-px">
          {ANALYTICS_TABS.map((tab) => (
            <NavLink
              key={tab.label}
              to={tab.to}
              end={tab.to === '.'}
              className={({ isActive }) =>
                [
                  'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors duration-150',
                  isActive
                    ? 'border-[#0e639c] text-[#e8e8e8]'
                    : 'border-transparent text-[#9d9d9d] hover:text-[#cccccc]',
                ].join(' ')
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>
    </AnalyticsFilterProvider>
  )
}
