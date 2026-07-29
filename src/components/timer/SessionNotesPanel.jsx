import { NotebookPen } from 'lucide-react'
import { useStudyTimer } from '../../context/StudyTimerContext'

/**
 * SESSION NOTES PANEL
 * ====================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * "Allow notes during study. Autosave notes. Persist locally." Notes live
 * on the active timer's state (`context/StudyTimerContext.jsx`'s `notes`
 * field), which is already written to localStorage on every state change
 * — so every keystroke here is autosaved with no extra debounce/service
 * needed, and `completeSession` carries the final text onto the saved
 * Session record.
 */
export default function SessionNotesPanel() {
  const { isSessionActive, notes, setNotes } = useStudyTimer()

  if (!isSessionActive) return null

  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
        <NotebookPen size={14} strokeWidth={1.75} />
        Session Notes
      </h2>
      <textarea
        rows={5}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Jot down anything worth remembering while you study — autosaved as you type."
        className="mt-3 w-full resize-none rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
      />
    </section>
  )
}
