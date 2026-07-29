import { ChevronRight, BookOpen, Layers } from 'lucide-react'
import TopicBreadcrumb from './TopicBreadcrumb'
import TopicGrid from './TopicGrid'

/**
 * Sprint 26 — the primary Topic Navigation surface: Subject -> Chapter ->
 * Topic, entirely within one page via drill-down selection (no extra
 * routes), matching the PRD's "maximum three navigation levels" /
 * "everything important within two clicks" principles. Deliberately
 * simpler than the existing Syllabus Explorer (`components/syllabus/*`) —
 * that engine drives a much larger Exam -> Subject -> Unit -> Chapter ->
 * Topic -> Subtopic blueprint tree; this one is a lightweight browser over
 * whatever `pyq_index.json` currently declares, which may be sparse or
 * empty.
 */
export default function TopicNavigator({
  subjects,
  selectedSubjectId,
  selectedChapterSlug,
  selectedChapters,
  selectedChapterTopics,
  selectSubject,
  selectChapter,
  resetSelection,
}) {
  if (!subjects.length) {
    return (
      <div className="rounded-lg border border-dashed border-[#3c3c3c] px-4 py-10 text-center text-xs text-[#6e6e6e]">
        No subjects to browse yet — topics will appear here once pyq_index.json&apos;s topics array is populated.
      </div>
    )
  }

  const selectedSubject = subjects.find((subject) => subject.subjectId === selectedSubjectId) ?? null

  // Level 3 — a chapter is selected: show its topics.
  if (selectedSubject && selectedChapterSlug) {
    const chapter = selectedChapters.find((entry) => entry.chapterSlug === selectedChapterSlug)
    return (
      <div className="flex flex-col gap-3">
        <TopicBreadcrumb
          subjectName={selectedSubject.subjectName}
          chapterName={chapter?.chapterName}
          onSelectSubject={resetSelection}
          onSelectChapter={null}
        />
        <TopicGrid topics={selectedChapterTopics} showBreadcrumb={false} emptyLabel="No topics in this chapter yet" />
      </div>
    )
  }

  // Level 2 — a subject is selected: show its chapters.
  if (selectedSubject) {
    return (
      <div className="flex flex-col gap-3">
        <TopicBreadcrumb subjectName={selectedSubject.subjectName} onSelectSubject={resetSelection} />
        {!selectedChapters.length ? (
          <div className="rounded-lg border border-dashed border-[#3c3c3c] px-4 py-10 text-center text-xs text-[#6e6e6e]">
            No chapters indexed for this subject yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {selectedChapters.map((chapter) => (
              <button
                key={chapter.chapterSlug}
                type="button"
                onClick={() => selectChapter(chapter.chapterSlug)}
                className="flex items-center justify-between gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-3.5 py-3 text-left transition-colors duration-150 hover:border-[#4a4a4a]"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#9d9d9d]">
                    <Layers size={15} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#e8e8e8]">{chapter.chapterName}</p>
                    <p className="mt-0.5 text-[11px] text-[#858585]">
                      {chapter.topics.length} topic{chapter.topics.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={15} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Level 1 — nothing selected: show every subject that has at least one topic.
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => {
        const topicCount = subject.chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0)
        return (
          <button
            key={subject.subjectId}
            type="button"
            onClick={() => selectSubject(subject.subjectId)}
            className="flex items-center justify-between gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-3.5 py-3 text-left transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#9d9d9d]">
                <BookOpen size={15} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-[#e8e8e8]">{subject.subjectName}</p>
                <p className="mt-0.5 text-[11px] text-[#858585]">
                  {subject.chapters.length} chapter{subject.chapters.length === 1 ? '' : 's'} · {topicCount} topic
                  {topicCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <ChevronRight size={15} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
          </button>
        )
      })}
    </div>
  )
}
