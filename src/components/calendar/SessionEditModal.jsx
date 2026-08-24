import { useEffect, useState } from 'react'
import TopicCascadeSelect from '../timer/TopicCascadeSelect'
import { updateStudySession } from '../../utils/studySessionsStorage'

function sessionValue(session) {
  return { subject: session.subject ?? '', chapter: session.chapter ?? '', task: session.task ?? '', topicId: session.topicId ?? session.topic ?? '' }
}

/** Edits only a saved session's topic link; its original date/time remain untouched. */
export default function SessionEditModal({ session, onClose, onSaved }) {
  const [value, setValue] = useState(() => session ? sessionValue(session) : null)

  useEffect(() => setValue(session ? sessionValue(session) : null), [session])
  if (!session || !value) return null

  const save = () => {
    const updated = updateStudySession(session.id, {
      subject: value.subject,
      chapter: value.chapter,
      task: value.task,
      topicId: value.topicId,
      topic: value.topicId,
    })
    onSaved(updated)
    onClose()
  }

  return <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
    <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />
    <div className="relative w-full max-w-2xl rounded-lg border border-[#3c3c3c] bg-[#252526] p-6 shadow-2xl">
      <h2 className="text-lg font-semibold text-[#e8e8e8]">Edit session topic</h2>
      <p className="mt-1 text-sm text-[#858585]">This changes the topic link only. The session date and recorded time stay the same.</p>
      <div className="mt-5"><TopicCascadeSelect value={value} onChange={setValue} /></div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-4 py-2 text-sm font-medium text-[#cccccc] hover:bg-[#37373d]">Cancel</button>
        <button type="button" onClick={save} disabled={!value.topicId} className="rounded-md border border-[#0e639c] bg-[#0e639c] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#1177bb]">Save changes</button>
      </div>
    </div>
  </div>
}
