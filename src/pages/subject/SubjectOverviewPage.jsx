import { Link, useOutletContext } from 'react-router-dom'
import { BookOpen, FolderOpen, ListChecks, Sparkles } from 'lucide-react'

function getChapterMetadata(chapter) {
  return { priority: chapter.priority ?? 'Medium', topicCount: chapter.topics?.length ?? 0 }
}

function buildSubjectZoteroUri(subject) {
  const subjectKey = String(subject?.id ?? subject?.slug ?? '').trim().toLowerCase()
  const map = {
    'mathematical-methods': 'math-methods',
    'classical-mechanics': 'classical-mechanics',
    'electromagnetism': 'electromagnetism',
    'quantum-mechanics': 'quantum-mechanics',
    'thermodynamics': 'thermodynamics',
  }

  const key = map[subjectKey] || subjectKey || 'math-methods'
  return `zotero://select/library/collections/${encodeURIComponent(key)}`
}

export default function SubjectOverviewPage() {
  const { subject } = useOutletContext()
  const chapters = [...(subject.chapters ?? [])]

  const totalTopics = chapters.reduce(
    (sum, chapter) => sum + getChapterMetadata(chapter).topicCount,
    0,
  )

  const stats = [
    { label: 'Chapters', value: chapters.length, icon: ListChecks },
    { label: 'Topics', value: totalTopics, icon: Sparkles },
    {
      label: 'Priority',
      value: subject.priority ? `${subject.priority} (${subject.priority === 'High' ? 'foundational' : 'guided'})` : 'Medium',
      icon: BookOpen,
    },
  ]

  const handleOpenZotero = () => {
    const uri = buildSubjectZoteroUri(subject)
    if (typeof window !== 'undefined' && window.physicsOSDesktop?.window?.openExternal) {
      window.physicsOSDesktop.window.openExternal(uri).catch(() => {
        try {
          window.open(uri, '_blank', 'noopener,noreferrer')
        } catch {
          // no-op: custom Zotero scheme is gracefully ignored in browser mode.
        }
      })
      return
    }

    try {
      window.open(uri, '_blank', 'noopener,noreferrer')
    } catch {
      // no-op: browser fallback only.
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Subject overview</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#9d9d9d]">
              {subject.description ?? 'Blueprint-backed subject overview built from the current curriculum source.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenZotero}
              className="inline-flex items-center gap-2 rounded-md border border-[#22c55e]/20 bg-[#22c55e]/10 px-3 py-2 text-[11px] font-medium text-[#bbf7d0] transition hover:bg-[#22c55e]/15"
            >
              <FolderOpen size={13} />
              Open in Zotero ↗
            </button>
            <div className="rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 px-3 py-2 text-right text-xs text-[#4fc1ff]">
              <p className="uppercase tracking-wide">ACTIVE SUBJECT</p>
              <p className="mt-1 text-sm font-semibold text-[#e8e8e8]">{subject.name}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
              <Icon size={17} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs text-[#858585]">{label}</p>
              <p className="mt-0.5 text-lg font-semibold text-[#e8e8e8]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {chapters.map((chapter) => {
          const meta = getChapterMetadata(chapter)
          return (
            <Link
              key={chapter.slug}
              to={`/subjects/${subject.id}/chapters/${chapter.slug}`}
              className="group rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3 transition-colors duration-150 hover:border-[#4a4a4a]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#e8e8e8]">{chapter.name}</p>
                  <p className="mt-1 text-xs text-[#858585]">
                    {meta.topicCount} topics · {meta.priority} priority
                  </p>
                </div>
                <span className="text-xs text-[#9d9d9d] transition-colors duration-150 group-hover:text-[#cccccc]">
                  Open chapter →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
