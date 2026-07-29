import { useEffect, useState } from 'react'
import { CUSTOM_TASK_TYPE_ORDER, TASK_PRIORITIES, createBlankTaskDraft } from '../../constants/taskConstants'

const inputClasses =
  'rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]'

/**
 * TASK FORM MODAL
 * ===============
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Add Task / Edit Task, in one component (edit is just Add pre-filled with
 * an existing task). Every field maps 1:1 to the sprint's Task Model.
 */
export default function TaskFormModal({ open, initialTask, onSave, onClose }) {
  const [form, setForm] = useState(createBlankTaskDraft())

  useEffect(() => {
    if (open) setForm(initialTask ?? createBlankTaskDraft())
  }, [open, initialTask])

  if (!open) return null

  const set = (key) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [key]: key === 'estimatedDuration' ? Number(value) : value }))
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />

      <div className="relative flex max-h-full w-full max-w-lg flex-col overflow-y-auto rounded-lg border border-[#3c3c3c] bg-[#252526] p-6 shadow-2xl transition-all duration-150">
        <h2 className="text-lg font-semibold text-[#e8e8e8]">{initialTask ? 'Edit Task' : 'Add Task'}</h2>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Title</span>
            <input type="text" value={form.title} onChange={set('title')} className={inputClasses} placeholder="e.g. Read Griffiths Ch. 4" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Description</span>
            <textarea rows={2} value={form.description} onChange={set('description')} className={`resize-none ${inputClasses}`} />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Task Type</span>
              <select value={form.type} onChange={set('type')} className={inputClasses}>
                {CUSTOM_TASK_TYPE_ORDER.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Priority</span>
              <select value={form.priority} onChange={set('priority')} className={inputClasses}>
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Subject</span>
              <input type="text" value={form.subject} onChange={set('subject')} className={inputClasses} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Chapter</span>
              <input type="text" value={form.chapter} onChange={set('chapter')} className={inputClasses} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Topic</span>
              <input type="text" value={form.topic} onChange={set('topic')} className={inputClasses} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Estimated Duration (min)</span>
              <input type="number" min={5} step={5} value={form.estimatedDuration} onChange={set('estimatedDuration')} className={inputClasses} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Due Date</span>
              <input type="date" value={form.dueDate ?? ''} onChange={set('dueDate')} className={inputClasses} />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">Notes</span>
            <textarea rows={2} value={form.notes} onChange={set('notes')} className={`resize-none ${inputClasses}`} />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-4 py-2 text-sm font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#37373d]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="rounded-md border border-[#0e639c] bg-[#0e639c] px-4 py-2 text-sm font-medium text-[#ffffff] transition-colors duration-150 hover:bg-[#1177bb] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {initialTask ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
