import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Library, NotebookPen, FileText, Brain, FlaskConical } from 'lucide-react'
import { buildLinkedModuleRoutes } from '../../engine/blueprintMappingLayer'
import { PRIORITY_STYLES } from './RoadmapProgressCard'

const QUICK_LINKS = [
  { key: 'resources', label: 'Resources', icon: Library },
  { key: 'notes', label: 'Notes', icon: NotebookPen },
  { key: 'formulaSheet', label: 'Formula Sheet', icon: FileText },
  { key: 'memorySheet', label: 'Memory Sheet', icon: Brain },
  { key: 'pyqs', label: 'PYQs', icon: FlaskConical },
]

/**
 * ChapterRoadmapRow — Sprint 18B.
 * ================================
 * A single Chapter within a Month's Subject group: Estimated Hours,
 * Completion, Priority. Clicking the row opens Resources / Notes /
 * Formula Sheet / Memory Sheet / PYQs for that chapter, per the Sprint
 * 18B brief — reusing the exact route convention already established in
 * `engine/blueprintMappingLayer.js` (`buildLinkedModuleRoutes`).
 */
export default function ChapterRoadmapRow({ chapter }) {
  const [isOpen, setIsOpen] = useState(false)
  const routes = buildLinkedModuleRoutes(chapter.subjectId, chapter.slug)

  return (
    <div className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        {isOpen ? (
          <ChevronDown size={13} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
        ) : (
          <ChevronRight size={13} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-[#e8e8e8]">{chapter.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1 w-20 overflow-hidden rounded-full bg-[#3c3c3c]">
              <div
                className="h-full rounded-full bg-[#0e639c] transition-all duration-300"
                style={{ width: `${chapter.completion}%` }}
              />
            </div>
            <span className="text-[10px] text-[#6e6e6e]">{chapter.completion}%</span>
          </div>
        </div>

        <span className="shrink-0 text-[10px] text-[#858585]">{chapter.estimatedHours} hrs</span>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
            PRIORITY_STYLES[chapter.priority] ?? PRIORITY_STYLES.Low
          }`}
        >
          {chapter.priority}
        </span>
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 gap-1.5 border-t border-[#3c3c3c] p-2.5 sm:grid-cols-5">
          {QUICK_LINKS.map(({ key, label, icon: Icon }) => (
            <Link
              key={key}
              to={routes[key]}
              className="flex flex-col items-center gap-1 rounded-md border border-[#3c3c3c] bg-[#252526] px-2 py-2 text-center transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#2d2d2d]"
            >
              <Icon size={14} strokeWidth={1.75} className="text-[#858585]" />
              <span className="text-[10px] text-[#cccccc]">{label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
