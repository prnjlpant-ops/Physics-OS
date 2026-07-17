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

export default function FilterBar({
  subjects = [],
  subjectId,
  onSubjectChange,
  hideSubject = false,
  chapters = [],
  chapterSlug,
  onChapterChange,
  hideChapter = false,
  type,
  onTypeChange,
  typeOptions,
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

      <Select value={type} onChange={onTypeChange} label="Filter by resource type">
        <option value="all">All Types</option>
        {typeOptions.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  )
}
