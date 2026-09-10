import { useOutletContext } from 'react-router-dom'
import ChapterCard from './ChapterCard'

function roadmapOrder(chapter) {
  const orders = (chapter.topics ?? []).map((topic) => {
    const phase = String(topic.roadmapPhase ?? '')
    const core = /^Topic\s+(\d+)/i.exec(phase)
    if (core) return Number(core[1])
    const bonus = /Bonus\s*#?(\d+)/i.exec(phase)
    if (bonus) return 100 + Number(bonus[1])
    const tier = /Tier\s*(\d+)/i.exec(phase)
    if (tier) return 200 + Number(tier[1])
    return Number.MAX_SAFE_INTEGER
  })
  return Math.min(...orders, Number.MAX_SAFE_INTEGER)
}

const priorityRank = { High: 0, Medium: 1, Low: 2 }

export default function SubjectChaptersPage() {
  const { subject } = useOutletContext()
  const chapters = [...subject.chapters].sort((left, right) =>
    roadmapOrder(left) - roadmapOrder(right)
      || (priorityRank[left.priority] ?? 1) - (priorityRank[right.priority] ?? 1)
      || left.name.localeCompare(right.name),
  )

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[#858585]">Chapters are ordered by the earliest v3 roadmap phase, then by priority. Difficulty is shown to help you budget study time.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {chapters.map((chapter) => <ChapterCard key={chapter.slug} subjectId={subject.id} chapter={chapter} />)}
      </div>
    </div>
  )
}
