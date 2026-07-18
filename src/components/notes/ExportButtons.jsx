import { FileDown, FileType } from 'lucide-react'

export default function ExportButtons() {
  return (
    <div className="flex items-center gap-1.5 print:hidden">
      <button
        type="button"
        title="Export as Markdown"
        className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
      >
        <FileDown size={13} strokeWidth={1.75} />
        Markdown
      </button>
      <button
        type="button"
        title="Export as PDF"
        className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
      >
        <FileType size={13} strokeWidth={1.75} />
        PDF
      </button>
    </div>
  )
}
