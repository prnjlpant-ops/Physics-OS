import { Search } from 'lucide-react'
import { subjects } from '../../constants/subjects'
import { DATE_RANGE_OPTIONS, MODULE_OPTIONS } from '../../constants/analyticsConstants'

function Select({ value, onChange, label, children }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
      className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] focus:border-[#0e639c] focus:outline-none"
    >
      {children}
    </select>
  )
}

export default function AnalyticsFilterBar({
  search,
  onSearchChange,
  subjectId,
  onSubjectChange,
  dateRange,
  onDateRangeChange,
  moduleFilter,
  onModuleFilterChange,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative lg:w-72">
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858585]" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by subject or module..."
          className="w-full rounded-md border border-[#3c3c3c] bg-[#1e1e1e] py-1.5 pl-8 pr-3 text-xs text-[#cccccc] outline-none transition-colors duration-150 focus:border-[#0e639c]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={subjectId} onChange={onSubjectChange} label="Filter by subject">
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </Select>

        <Select value={dateRange} onChange={onDateRangeChange} label="Filter by date range">
          {DATE_RANGE_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select value={moduleFilter} onChange={onModuleFilterChange} label="Filter by module">
          <option value="All Modules">All Modules</option>
          {MODULE_OPTIONS.map((mod) => (
            <option key={mod} value={mod}>
              {mod}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
