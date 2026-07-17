import { useState } from 'react'
import { useStudyTimer } from '../../context/StudyTimerContext'
import { formatDuration } from '../../utils/formatDuration'

const initialForm = {
  completedSummary: '',
  nextAction: '',
  conceptualTakeaway: '',
}

export default function EndSessionModal() {
  const { isEndModalOpen, elapsedMs, discardSession, completeSession } =
    useStudyTimer()
  const [form, setForm] = useState(initialForm)

  if (!isEndModalOpen) return null

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleCancel = () => {
    setForm(initialForm)
    discardSession()
  }

  const handleSave = () => {
    completeSession(form)
    setForm(initialForm)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close"
        onClick={handleCancel}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative flex max-h-full w-full max-w-lg flex-col overflow-y-auto rounded-lg border border-[#3c3c3c] bg-[#252526] p-6 shadow-2xl transition-all duration-150">
        <h2 className="text-lg font-semibold text-[#e8e8e8]">End Session</h2>
        <p className="mt-1 text-sm text-[#858585]">
          Total study time: {formatDuration(elapsedMs)}
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              What did you complete today?
            </span>
            <textarea
              rows={3}
              value={form.completedSummary}
              onChange={handleChange('completedSummary')}
              className="resize-none rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
              placeholder="e.g. Finished Vector Calculus reading, solved 10 problems"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              What should be the first thing you do when you return?
            </span>
            <input
              type="text"
              value={form.nextAction}
              onChange={handleChange('nextAction')}
              className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
              placeholder="e.g. Redo Q7, it wasn't fully clear"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              Write one conceptual idea you want Future You to remember.
            </span>
            <textarea
              rows={3}
              value={form.conceptualTakeaway}
              onChange={handleChange('conceptualTakeaway')}
              className="resize-none rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
              placeholder="e.g. Divergence measures outward flux per unit volume"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-4 py-2 text-sm font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#37373d]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md border border-[#0e639c] bg-[#0e639c] px-4 py-2 text-sm font-medium text-[#ffffff] transition-colors duration-150 hover:bg-[#1177bb]"
          >
            Save Session
          </button>
        </div>
      </div>
    </div>
  )
}
