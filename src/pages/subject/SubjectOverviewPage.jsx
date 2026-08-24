import { Link, useOutletContext } from 'react-router-dom'
import { BookOpen, ListChecks, Sparkles } from 'lucide-react'
import roadmapTopics from '../../data/roadmap.json' with { type: 'json' }
import pyqIndexRaw from '../../data/pyq/pyq_index.json'
import chapterToTopicMap from '../../engine/chapterToTopicMap.json' with { type: 'json' }

function getHighestPriority(subjectId) {
  const topicIds = pyqIndexRaw.topics.filter((t) => t.subjectId === subjectId).map((t) => t.id)
  const roadmapItems = roadmapTopics.filter((r) => topicIds.includes(r.id) && r.priority)

  if (roadmapItems.length === 0) return 'Medium'

  const priorities = roadmapItems.map((r) => r.priority)
  if (priorities.includes('High')) return 'High'
  if (priorities.includes('Medium')) return 'Medium'
  return 'Low'
}

function getChapterMetadata(chapterSlug, fallbackWeightage) {
  const topicId = chapterToTopicMap[chapterSlug]
  const roadmapItem = topicId ? roadmapTopics.find((r) => r.id === topicId) : null
  return {
    priority: roadmapItem?.priority ?? fallbackWeightage ?? 'Medium',
    topicCount: 2,
  }
}

export default function SubjectOverviewPage() {
  const { subject } = useOutletContext()

  const totalTopics = (subject.chapters ?? []).reduce(
    (sum, chapter) => sum + getChapterMetadata(chapter.slug, chapter.weightage).topicCount,
    0,
  )
  const stats = [
    { label: 'Chapters', value: subject.chapters?.length ?? 0, icon: ListChecks },
    { label: 'Topics', value: totalTopics, icon: Sparkles },
    { label: 'Priority', value: getHighestPriority(subject.id), icon: BookOpen },
  ]

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
          <div className="rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 px-3 py-2 text-right text-xs text-[#4fc1ff]">
            <p className="uppercase tracking-wide">Active subject</p>
            <p className="mt-1 text-sm font-semibold text-[#e8e8e8]">{subject.name}</p>
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
        {subject.chapters?.map((chapter) => {
          const meta = getChapterMetadata(chapter.slug, chapter.weightage)
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
