export default function SyllabusProgressPanel({ progress }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
      <div className="flex flex-col gap-1 rounded-lg border border-[#3c3c3c] bg-[#252526] px-3 py-2.5">
        <span className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Overall Completion</span>
        <span className="text-lg font-semibold text-[#e8e8e8]">{progress.overallCompletion}%</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-[#3c3c3c] bg-[#252526] px-3 py-2.5">
        <span className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Total Topics</span>
        <span className="text-lg font-semibold text-[#e8e8e8]">{progress.totalTopics}</span>
      </div>
    </div>
  )
}
