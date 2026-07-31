import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, ChevronRight } from 'lucide-react'
import { useSyllabusStatus } from '../../hooks/useSyllabusStatus'
import { getSyllabusProgress } from '../../data/syllabusData'

const STATUS_STYLES = {
  Completed: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  'In Progress': 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  'Not Started': 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
}

const TRACK_STYLES = {
  Completed: 'bg-[#89d185]',
  'In Progress': 'bg-[#0e639c]',
  'Not Started': 'bg-[#3c3c3c]',
}

function MiniStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#858585]">
        {label}
      </p>
      <p className="mt-0.5 text-xs text-[#cccccc]">{value}</p>
    </div>
  )
}

export default function ChapterCard({ subjectId, chapter }) {
  const { overrides } = useSyllabusStatus()
  const { completion, status } = useMemo(() => {
    const syllabusProgress = getSyllabusProgress(overrides)
    const chapterId = `${subjectId}__${chapter.slug}`
    const completion = syllabusProgress.byChapter.find((item) => item.id === chapterId)?.completion ?? 0
    const status = completion === 100 ? 'Completed' : completion > 0 ? 'In Progress' : 'Not Started'
    return { completion, status }
  }, [overrides, subjectId, chapter.slug])

  return (
    <Link
      to={`/subjects/${subjectId}/chapters/${chapter.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-[#e8e8e8]">{chapter.name}</h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3c3c3c]">
          <div
            className={`h-full rounded-full ${TRACK_STYLES[status]}`}
            style={{ width: `${completion}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-[#9d9d9d]">
          {completion}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-[#3c3c3c] pt-3">
        <MiniStat label="Reading" value={chapter.reading} />
        <MiniStat label="Problems" value={chapter.problems} />
        <MiniStat label="Revision" value={chapter.revision} />
      </div>

      <div className="flex items-center justify-between border-t border-[#3c3c3c] pt-2.5 text-xs text-[#858585] transition-colors duration-150 group-hover:text-[#cccccc]">
        <span className="inline-flex items-center gap-1.5">
          <FileStack size={13} strokeWidth={1.75} />
          Resources
        </span>
        <ChevronRight size={14} strokeWidth={1.75} />
      </div>
    </Link>
  )
}
