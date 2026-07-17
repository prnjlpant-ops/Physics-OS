import { Search } from 'lucide-react'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'custom', label: 'Custom Range' },
]

export default function CalendarFilters({
  filter,
  onFilterChange,
  customRange,
  onCustomRangeChange,
  search,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onFilterChange(f.key)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
              filter === f.key
                ? 'border-[#0e639c] bg-[#0e639c] text-white'
                : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a] hover:bg-[#37373d]'
            }`}
          >
            {f.label}
          </button>
        ))}

        {filter === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customRange.from}
              onChange={(e) => onCustomRangeChange({ ...customRange, from: e.target.value })}
              className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1.5 text-xs text-[#cccccc] outline-none transition-colors duration-150 focus:border-[#0e639c]"
            />
            <span className="text-xs text-[#858585]">to</span>
            <input
              type="date"
              value={customRange.to}
              onChange={(e) => onCustomRangeChange({ ...customRange, to: e.target.value })}
              className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1.5 text-xs text-[#cccccc] outline-none transition-colors duration-150 focus:border-[#0e639c]"
            />
          </div>
        )}
      </div>

      <div className="relative sm:w-72">
        <Search
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858585]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search subject, chapter, or task"
          className="w-full rounded-md border border-[#3c3c3c] bg-[#1e1e1e] py-1.5 pl-8 pr-3 text-xs text-[#cccccc] outline-none transition-colors duration-150 focus:border-[#0e639c]"
        />
      </div>
    </div>
  )
}
