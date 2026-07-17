import { Pause, Play, Square } from 'lucide-react'

export default function StudyTimerPreview() {
  return (
    <section className="flex h-full flex-col rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="text-sm font-semibold text-[#e8e8e8]">Study Timer</h2>

      <div className="mt-6 flex flex-1 flex-col items-center justify-center">
        <p className="font-mono text-4xl font-medium tracking-wider text-[#e8e8e8]">
          00:00:00
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-sm text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#37373d]"
          >
            <Play size={14} />
            Start
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-sm text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#37373d]"
          >
            <Pause size={14} />
            Pause
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-sm text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#37373d]"
          >
            <Square size={14} />
            Stop
          </button>
        </div>
      </div>
    </section>
  )
}
