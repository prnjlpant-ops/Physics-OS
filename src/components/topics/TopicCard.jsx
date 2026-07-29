import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import TopicStatusBadge from './TopicStatusBadge'

function countResources(topic) {
  return (
    topic.relatedBooks.length +
    topic.relatedFormulaSheets.length +
    topic.relatedMemorySheets.length +
    topic.relatedNotes.length +
    topic.relatedVideos.length +
    topic.relatedResearchPapers.length
  )
}

export default function TopicCard({ topic, showBreadcrumb = true }) {
  const resourceCount = countResources(topic)
  const pyqCount = topic.relatedPYQs.length

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#4a4a4a] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="min-w-0 flex-1">
        <Link to={`/topics/${topic.id}`} className="block truncate text-sm font-medium text-[#e8e8e8] hover:text-white">
          {topic.name}
        </Link>
        {showBreadcrumb && (
          <p className="mt-0.5 truncate text-[11px] text-[#858585]">
            {topic.subject} · {topic.chapter}
          </p>
        )}
      </div>

      {topic.description && (
        <p className="line-clamp-2 text-[11px] leading-relaxed text-[#9d9d9d]">{topic.description}</p>
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px]">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Resources</p>
          <p className="mt-0.5 truncate text-[#cccccc]">{resourceCount}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Related PYQs</p>
          <p className="mt-0.5 truncate text-[#cccccc]">{pyqCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <TopicStatusBadge status={topic.status} />
      </div>

      <Link
        to={`/topics/${topic.id}`}
        className="mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
      >
        <ArrowRight size={13} strokeWidth={1.75} />
        Open Topic
      </Link>
    </div>
  )
}
