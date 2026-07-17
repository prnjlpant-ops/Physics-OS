import { IMPORTANCE_LEVELS } from '../../constants/memorySheetSections'

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

export default function MemoryFilterBar({
  subjects = [],
  subjectId,
  onSubjectChange,
  hideSubject = false,
  chapters = [],
  chapterSlug,
  onChapterChange,
  hideChapter = false,
  importance,
  onImportanceChange,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {!hideSubject && (
        <Select value={subjectId} onChange={onSubjectChange} label="Filter by subject">
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </Select>
      )}

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

      <Select value={importance} onChange={onImportanceChange} label="Filter by importance">
        <option value="all">All Importance</option>
        {IMPORTANCE_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </Select>
    </div>
  )
}
