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

export default function NotesFilterBar({
  subjects = [],
  subjectId,
  onSubjectChange,
  chapters = [],
  chapterSlug,
  onChapterChange,
  hideChapter = false,
  recentlyEditedOnly,
  onRecentlyEditedToggle,
  bookmarkedOnly,
  onBookmarkedToggle,
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

      <button
        type="button"
        onClick={() => onRecentlyEditedToggle(!recentlyEditedOnly)}
        aria-pressed={recentlyEditedOnly}
        className={[
          'rounded-md border px-2.5 py-1.5 text-xs transition-colors duration-150',
          recentlyEditedOnly
            ? 'border-[#0e639c]/50 bg-[#0e639c]/10 text-[#4fc1ff]'
            : 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] hover:border-[#4a4a4a]',
        ].join(' ')}
      >
        Recently Edited
      </button>

      <button
        type="button"
        onClick={() => onBookmarkedToggle(!bookmarkedOnly)}
        aria-pressed={bookmarkedOnly}
        className={[
          'rounded-md border px-2.5 py-1.5 text-xs transition-colors duration-150',
          bookmarkedOnly
            ? 'border-[#e2c08d]/40 bg-[#e2c08d]/10 text-[#e2c08d]'
            : 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] hover:border-[#4a4a4a]',
        ].join(' ')}
      >
        Bookmarked
      </button>
    </div>
  )
}
