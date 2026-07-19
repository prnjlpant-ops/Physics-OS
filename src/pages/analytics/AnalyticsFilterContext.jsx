import { createContext, useContext, useMemo, useState } from 'react'

const AnalyticsFilterContext = createContext(null)

export function AnalyticsFilterProvider({ children }) {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('All Modules')

  const value = useMemo(
    () => ({
      search,
      setSearch,
      subjectId,
      setSubjectId,
      dateRange,
      setDateRange,
      moduleFilter,
      setModuleFilter,
    }),
    [search, subjectId, dateRange, moduleFilter],
  )

  return <AnalyticsFilterContext.Provider value={value}>{children}</AnalyticsFilterContext.Provider>
}

export function useAnalyticsFilters() {
  const context = useContext(AnalyticsFilterContext)
  if (!context) {
    throw new Error('useAnalyticsFilters must be used within an AnalyticsFilterProvider')
  }
  return context
}
