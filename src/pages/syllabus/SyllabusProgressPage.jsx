import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { getSyllabusProgress } from '../../data/syllabusData'
import { useSyllabusStatus } from '../../hooks/useSyllabusStatus'
import { useTopicProgress } from '../../hooks/useTopicProgress'
import { getRoadmapMissionSnapshot } from '../../engine/roadmapMissionService'
import SyllabusProgressPanel from '../../components/syllabus/SyllabusProgressPanel'
import CompletionBarRow from '../../components/syllabus/CompletionBarRow'

export default function SyllabusProgressPage() {
  const { overrides } = useSyllabusStatus()
  const { statuses: roadmapStatuses } = useTopicProgress()
  const roadmapSnapshot = useMemo(() => getRoadmapMissionSnapshot(roadmapStatuses, new Date()), [roadmapStatuses])
  const progress = useMemo(() => getSyllabusProgress(overrides), [overrides])
  const [expandedSubjectIds, setExpandedSubjectIds] = useState(() => new Set())

  const toggleSubject = (subjectId) => {
    setExpandedSubjectIds((prev) => {
      const next = new Set(prev)
      if (next.has(subjectId)) {
        next.delete(subjectId)
      } else {
        next.add(subjectId)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <SyllabusProgressPanel progress={progress} />

      <section className="rounded-lg border border-[#0e639c]/40 bg-[#0e639c]/10 p-4">
        <p className="text-[10px] uppercase tracking-wide text-[#4fc1ff]">Roadmap checkpoint</p>
        <p className="mt-1 text-sm font-medium text-[#e8e8e8]">{roadmapSnapshot.nextTopic?.title ?? 'All roadmap topics are complete.'}</p>
        <p className="mt-1 text-xs text-[#9d9d9d]">{roadmapSnapshot.checkpoint.label} · {roadmapSnapshot.completedTopics}/{roadmapSnapshot.totalTopics} topics complete</p>
      </section>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Subject Completion</h3>
        <div className="flex flex-col gap-2">
          {progress.bySubject.map((subject) => {
            const isExpanded = expandedSubjectIds.has(subject.id)
            const chapters = progress.byChapter.filter((chapter) =>
              chapter.id.startsWith(`${subject.id}__`),
            )

            return (
              <div key={subject.id} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => toggleSubject(subject.id)}
                  className="flex items-center gap-2 text-left"
                >
                  {isExpanded ? (
                    <ChevronDown size={14} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
                  ) : (
                    <ChevronRight size={14} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
                  )}
                  <div className="flex-1">
                    <CompletionBarRow
                      label={`${subject.examName} · ${subject.name}`}
                      sublabel={`${subject.topicCount} topics`}
                      completion={subject.completion}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="ml-6 flex flex-col gap-2">
                    {chapters.map((chapter) => (
                      <CompletionBarRow
                        key={chapter.id}
                        label={chapter.name}
                        sublabel={`${chapter.topicCount} topics`}
                        completion={chapter.completion}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
