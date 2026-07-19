import { DIFFICULTY_LEVELS, PRIORITY_LEVELS, TOPIC_STATUS_ORDER } from '../../constants/syllabusConstants'

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

export default function SyllabusFilterBar({
  subjects = [],
  subjectId,
  onSubjectChange,
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={subjectId} onChange={onSubjectChange} label="Filter by subject">
        <option value="all">All Subjects</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </Select>

      <Select value={difficulty} onChange={onDifficultyChange} label="Filter by difficulty">
        <option value="all">All Difficulties</option>
        {DIFFICULTY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </Select>

      <Select value={status} onChange={onStatusChange} label="Filter by status">
        <option value="all">All Statuses</option>
        {TOPIC_STATUS_ORDER.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </Select>

      <Select value={priority} onChange={onPriorityChange} label="Filter by priority">
        <option value="all">All Priorities</option>
        {PRIORITY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </Select>
    </div>
  )
}
