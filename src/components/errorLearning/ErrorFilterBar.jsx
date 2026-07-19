import { Search } from 'lucide-react'
import { ERROR_SOURCES, DIFFICULTY_LEVELS, STATUS_OPTIONS } from '../../constants/errorLearningConstants'

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

export default function ErrorFilterBar({
  search,
  onSearchChange,
  subjects = [],
  subjectId,
  onSubjectChange,
  chapters = [],
  chapterSlug,
  onChapterChange,
  hideChapter = false,
  source,
  onSourceChange,
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 transition-colors duration-150 focus-within:border-[#0e639c]">
        <Search size={15} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search errors by keyword, concept, tag..."
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

        {!hideChapter && (
          <Select value={chapterSlug} onChange={onChapterChange} label="Filter by chapter">
            <option value="all">All Chapters</option>
            {chapters.map((chapter) => (
              <option key={chapter.slug} value={chapter.slug}>
                {chapter.name}
              </option>
            ))}
          </Select>
        )}

        <Select value={source} onChange={onSourceChange} label="Filter by source">
          <option value="all">All Sources</option>
          {ERROR_SOURCES.map((option) => (
            <option key={option} value={option}>
              {option}
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
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === 'All' ? 'All Statuses' : option}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
