import { LIBRARY_CATEGORY_ORDER, LIBRARY_CATEGORY_META, LIBRARY_PRIORITY_ORDER } from '../../constants/libraryConstants'

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

export default function LibraryFilterBar({ subjects, authors, filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={filters.subjectId} onChange={(value) => onFilterChange('subjectId', value)} label="Filter by subject">
        <option value="all">All Subjects</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </Select>

      <Select value={filters.priority} onChange={(value) => onFilterChange('priority', value)} label="Filter by priority">
        <option value="all">All Priorities</option>
        {LIBRARY_PRIORITY_ORDER.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </Select>

      <Select value={filters.categoryKey} onChange={(value) => onFilterChange('categoryKey', value)} label="Filter by category">
        <option value="all">All Categories</option>
        {LIBRARY_CATEGORY_ORDER.map((key) => (
          <option key={key} value={key}>
            {LIBRARY_CATEGORY_META[key].label}
            {LIBRARY_CATEGORY_META[key].placeholderOnly ? ' (Coming Soon)' : ''}
          </option>
        ))}
      </Select>

      <Select value={filters.author} onChange={(value) => onFilterChange('author', value)} label="Filter by author">
        <option value="all">All Authors</option>
        {authors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </Select>
    </div>
  )
}
