import { Search } from 'lucide-react'

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

export default function MockFilterBar({
  search,
  onSearchChange,
  subjectId,
  onSubjectChange,
  subjects,
  exam,
  onExamChange,
  exams,
  difficulty,
  onDifficultyChange,
  difficulties,
  status,
  onStatusChange,
  statuses,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 transition-colors duration-150 focus-within:border-[#0e639c]">
        <Search size={15} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search mock tests..."
          className="w-full bg-transparent text-sm text-[#e8e8e8] placeholder:text-[#6e6e6e] focus:outline-none"
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

        <Select value={exam} onChange={onExamChange} label="Filter by exam">
          <option value="all">All Exams</option>
          {exams.map((examOption) => (
            <option key={examOption} value={examOption}>
              {examOption}
            </option>
          ))}
        </Select>

        <Select value={difficulty} onChange={onDifficultyChange} label="Filter by difficulty">
          <option value="all">All Difficulties</option>
          {difficulties.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>

        <Select value={status} onChange={onStatusChange} label="Filter by status">
          {statuses.map((option) => (
            <option key={option} value={option}>
              {option === 'All' ? 'All Statuses' : option}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
