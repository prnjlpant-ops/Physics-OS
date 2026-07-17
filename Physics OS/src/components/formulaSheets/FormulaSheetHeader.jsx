import { Clock, Printer } from 'lucide-react'
import { DIFFICULTY_STYLES } from '../../constants/formulaSheetSections'

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

export default function FormulaSheetHeader({ sheet }) {
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

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#ffffff] print:hidden"
        >
          <Printer size={14} strokeWidth={1.75} />
          Print
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-[#3c3c3c] pt-3 sm:grid-cols-3 print:border-[#c8c8c8]">
        <MetaField label="Last Updated" value={sheet.lastUpdated} />
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#858585] print:text-[#555]">
            Difficulty
          </p>
          <span
            className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium print:border-[#c8c8c8] print:bg-white print:text-black ${DIFFICULTY_STYLES[sheet.difficulty]}`}
          >
            {sheet.difficulty}
          </span>
        </div>
        <MetaField
          label="Est. Revision Time"
          value={
            <span className="inline-flex items-center gap-1">
              <Clock size={12} strokeWidth={1.75} />
              {sheet.estimatedRevisionTime}
            </span>
          }
        />
      </div>
    </div>
  )
}
