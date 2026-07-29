import { Link } from 'react-router-dom'
import { Clock, Printer, Play } from 'lucide-react'
import { IMPORTANCE_STYLES, REVISION_STATUS_STYLES } from '../../constants/memorySheetSections'
import WindowService from '../../services/WindowService'

function MetaField({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-[#858585] print:text-[#555]">
        {label}
      </p>
      <p className="mt-0.5 text-xs text-[#cccccc] print:text-black">{value}</p>
    </div>
  )
}

export default function MemorySheetHeader({ sheet, revisionPath }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4 print:border-[#c8c8c8] print:bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#858585] print:text-[#555]">
            {sheet.subjectName}
          </p>
          <h2 className="mt-0.5 text-lg font-semibold text-[#e8e8e8] print:text-black">
            {sheet.chapterName}
          </h2>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {revisionPath && (
            <Link
              to={revisionPath}
              className="flex items-center gap-1.5 rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 px-3 py-1.5 text-xs font-medium text-[#4fc1ff] transition-colors duration-150 hover:border-[#0e639c]/70"
            >
              <Play size={14} strokeWidth={1.75} />
              Start Revision
            </Link>
          )}
          <button
            type="button"
            onClick={() => WindowService.print()}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#ffffff]"
          >
            <Printer size={14} strokeWidth={1.75} />
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-[#3c3c3c] pt-3 sm:grid-cols-3 print:border-[#c8c8c8]">
        <MetaField
          label="Est. Revision Time"
          value={
            <span className="inline-flex items-center gap-1">
              <Clock size={12} strokeWidth={1.75} />
              {sheet.estimatedRevisionTime}
            </span>
          }
        />
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#858585] print:text-[#555]">
            Importance
          </p>
          <span
            className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium print:border-[#c8c8c8] print:bg-white print:text-black ${IMPORTANCE_STYLES[sheet.importance]}`}
          >
            {sheet.importance}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#858585] print:text-[#555]">
            Revision Status
          </p>
          <span
            className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium print:border-[#c8c8c8] print:bg-white print:text-black ${REVISION_STATUS_STYLES[sheet.revisionStatus]}`}
          >
            {sheet.revisionStatus}
          </span>
        </div>
      </div>
    </div>
  )
}
