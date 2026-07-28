import { Bookmark } from 'lucide-react'
import { ALL_EXAMS_ORDER, EXAM_META, PAPER_STATUS_ORDER } from '../../constants/pyqLibraryConstants'

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

export default function PaperFilterBar({ years, subjects, filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.exam} onChange={(value) => onFilterChange('exam', value)} label="Filter by exam">
        <option value="all">All Exams</option>
        {ALL_EXAMS_ORDER.map((exam) => (
          <option key={exam} value={exam}>
            {EXAM_META[exam]?.label ?? exam}
            {EXAM_META[exam]?.comingSoon ? ' (Coming Soon)' : ''}
          </option>
        ))}
      </Select>

      <Select value={filters.year} onChange={(value) => onFilterChange('year', value)} label="Filter by year">
        <option value="all">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>

      <Select value={filters.subject} onChange={(value) => onFilterChange('subject', value)} label="Filter by subject">
        <option value="all">All Subjects</option>
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </Select>

      <Select value={filters.status} onChange={(value) => onFilterChange('status', value)} label="Filter by status">
        <option value="all">All Statuses</option>
        {PAPER_STATUS_ORDER.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>

      <button
        type="button"
        onClick={() => onFilterChange('bookmarkedOnly', !filters.bookmarkedOnly)}
        aria-pressed={filters.bookmarkedOnly}
        className={[
          'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors duration-150',
          filters.bookmarkedOnly
            ? 'border-[#e2c08d]/40 bg-[#e2c08d]/10 text-[#e2c08d]'
            : 'border-[#3c3c3c] bg-[#1e1e1e] text-[#9d9d9d] hover:border-[#4a4a4a] hover:text-[#cccccc]',
        ].join(' ')}
      >
        <Bookmark size={13} strokeWidth={1.75} fill={filters.bookmarkedOnly ? 'currentColor' : 'none'} />
        Bookmarked Only
      </button>
    </div>
  )
}
