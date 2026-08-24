import { ExternalLink, FileText } from 'lucide-react'
import syllabiConfig from '../../data/resourcePaths.json'
import WindowService from '../../services/WindowService'

export default function OfficialSyllabi() {
  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <div className="flex items-center gap-2"><FileText size={16} className="text-[#858585]" /><h3 className="text-sm font-semibold text-[#e8e8e8]">Official syllabi</h3></div>
      <p className="mt-1 text-xs text-[#858585]">Open the current official document for each exam.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {syllabiConfig.syllabi.map((item) => <button key={item.id} type="button" onClick={() => WindowService.openExternal(item.url)} className="flex min-w-0 items-center justify-between gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-2 text-left hover:border-[#4a4a4a]">
          <span><span className="block text-xs font-medium text-[#e8e8e8]">{item.name}</span><span className="block text-[10px] text-[#858585]">{item.description}</span></span><ExternalLink size={14} className="shrink-0 text-[#858585]" />
        </button>)}
      </div>
    </section>
  )
}
