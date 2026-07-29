import { ChevronRight } from 'lucide-react'

/**
 * Sprint 26 — a small, reusable breadcrumb used both inside the Topic
 * Navigator (drill-down) and on the Topic Details page, so the
 * Subject -> Chapter -> Topic trail always looks identical everywhere it
 * appears. Any segment can be omitted (e.g. no `topicName` while browsing
 * chapters) and `onSelectSubject` / `onSelectChapter` are optional —
 * passing them makes that segment clickable.
 */
export default function TopicBreadcrumb({ subjectName, chapterName, topicName, onSelectSubject, onSelectChapter }) {
  const segments = [
    subjectName && { label: subjectName, onClick: onSelectSubject },
    chapterName && { label: chapterName, onClick: onSelectChapter },
    topicName && { label: topicName, onClick: null },
  ].filter(Boolean)

  if (!segments.length) return null

  return (
    <div className="flex flex-wrap items-center gap-1 text-xs text-[#858585]">
      {segments.map((segment, index) => (
        <span key={`${segment.label}-${index}`} className="flex items-center gap-1">
          {index > 0 && <ChevronRight size={12} strokeWidth={1.75} className="text-[#4a4a4a]" />}
          {segment.onClick ? (
            <button
              type="button"
              onClick={segment.onClick}
              className="transition-colors duration-150 hover:text-[#cccccc]"
            >
              {segment.label}
            </button>
          ) : (
            <span className={index === segments.length - 1 ? 'text-[#cccccc]' : ''}>{segment.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}
