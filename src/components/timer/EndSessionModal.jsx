import { useState } from 'react'
import { useStudyTimer } from '../../context/StudyTimerContext'
import { formatDuration } from '../../utils/formatDuration'
import { CONFIDENCE_SCALE, CONFIDENCE_LABELS, createBlankReflection } from '../../services/ReflectionService'

/**
 * END SESSION MODAL — REFLECTION
 * ===============================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Updated to ask the Reflection questions the sprint spec defines: What
 * did you study? What was difficult? Confidence (1-5)? What should be
 * revised? (`services/ReflectionService.js`). The "Key takeaway" field
 * from Sprint 15 is kept as an optional fifth field — useful, and
 * non-breaking to drop since it was never part of any required model.
 */

const initialForm = { ...createBlankReflection(), conceptualTakeaway: '' }

export default function EndSessionModal() {
  const { isEndModalOpen, elapsedMs, discardSession, completeSession } = useStudyTimer()
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
        <h2 className="text-lg font-semibold text-[#e8e8e8]">End Session — Reflection</h2>
        <p className="mt-1 text-sm text-[#858585]">
          Total study time: {formatDuration(elapsedMs)}
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              What did you study?
            </span>
            <textarea
              rows={3}
              value={form.whatStudied}
              onChange={handleChange('whatStudied')}
              className="resize-none rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
              placeholder="e.g. Finished Vector Calculus reading, solved 10 problems"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              What was difficult?
            </span>
            <textarea
              rows={2}
              value={form.whatWasDifficult}
              onChange={handleChange('whatWasDifficult')}
              className="resize-none rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
              placeholder="e.g. Couldn't fully follow the boundary condition derivation"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              Confidence (1–5)
            </span>
            <div className="flex gap-2">
              {CONFIDENCE_SCALE.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, confidence: value }))}
                  title={CONFIDENCE_LABELS[value]}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors duration-150 ${
                    form.confidence === value
                      ? 'border-[#0e639c] bg-[#0e639c] text-white'
                      : 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] hover:border-[#4a4a4a]'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            {form.confidence && (
              <span className="text-[11px] text-[#858585]">{CONFIDENCE_LABELS[form.confidence]}</span>
            )}
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              What should be revised?
            </span>
            <input
              type="text"
              value={form.whatToRevise}
              onChange={handleChange('whatToRevise')}
              className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
              placeholder="e.g. Redo Q7, it wasn't fully clear"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">
              Key takeaway (optional)
            </span>
            <textarea
              rows={2}
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
