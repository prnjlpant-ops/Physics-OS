import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getChapter, getResources } from '../../../engine/blueprintService'
import { RESOURCE_TYPE_ORDER, RESOURCE_TYPE_META } from '../../../constants/resourceTypes'
import PageTitle from '../../../components/PageTitle'
import WorkspaceService from '../../../services/WorkspaceService'
import { useSyllabusStatus } from '../../../hooks/useSyllabusStatus'
import { getAllTopics } from '../../../data/syllabusData'
import { TOPIC_STATUS } from '../../../constants/syllabusConstants'
import { useStudySessions } from '../../../hooks/useStudySessions'
import { getStudyWorkflow } from '../../../constants/studyWorkflow'
import { getV61RecordsForChapter } from '../../../data/v61Tracker'
import { generateSessionId, saveStudySession, resetChapterStudySessions, getChapterStudySessions } from '../../../utils/studySessionsStorage'
import ResourceLauncherService from '../../../services/ResourceLauncherService'

const TAB_PATHS = {
  books: 'books',
  videos: 'videos',
  pdfs: 'pdfs',
  solutionManuals: 'solution-manuals',
  referenceMaterial: 'reference-material',
  externalLinks: 'external-links',
}

export default function ChapterResourceLayout() {
  const { subjectId, chapterSlug } = useParams()
  const found = getChapter(subjectId, chapterSlug)
  const { getStatus, setStatus } = useSyllabusStatus()
  const sessions = useStudySessions()
  const [trackerForm, setTrackerForm] = useState({ start: '', end: '', minutes: '', notes: '' })

  // Sprint 28 — Desktop Readiness Layer: records "where the user is" so
  // ContinueStudyingCard (and future consumers) can restore it after a
  // refresh. Purely additive — nothing here changes what's rendered.
  useEffect(() => {
    if (found) {
      WorkspaceService.setCurrentSubject(found.subject.id)
      WorkspaceService.setCurrentChapter(found.chapter.slug)
    }
  }, [found])

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found
  const workflow = getStudyWorkflow(subject.id)
  const resources = getResources(subject.id, chapter.slug)
  const syllabusTopics = getAllTopics().filter((topic) =>
    topic.metadata.subjectId === subject.id && topic.metadata.chapterSlug === chapter.slug,
  )
  const chapterIsComplete = syllabusTopics.length > 0 && syllabusTopics.every((topic) => getStatus(topic) === TOPIC_STATUS.MASTERED)
  const chapterSessions = getChapterStudySessions(subject.name, chapter.name)
  const v61Rows = getV61RecordsForChapter(subject.name, chapter.name)
  const toggleChapterComplete = () => {
    const nextStatus = chapterIsComplete ? TOPIC_STATUS.NOT_STARTED : TOPIC_STATUS.MASTERED
    syllabusTopics.forEach((topic) => setStatus(topic.id, nextStatus))
  }

  const handleTrackerSave = (event) => {
    event.preventDefault()
    const startMs = trackerForm.start ? new Date(trackerForm.start).getTime() : Date.now()
    const endMs = trackerForm.end ? new Date(trackerForm.end).getTime() : startMs + (Number(trackerForm.minutes) || 0) * 60 * 1000
    const totalMinutes = Number(trackerForm.minutes) || Math.max(0, Math.round((endMs - startMs) / 60000))
    const safeStart = Number.isFinite(startMs) ? startMs : Date.now()
    const safeEnd = Number.isFinite(endMs) ? endMs : safeStart + totalMinutes * 60 * 1000

    saveStudySession({
      id: generateSessionId(),
      subject: subject.name,
      chapter: chapter.name,
      startTime: safeStart,
      endTime: safeEnd,
      duration: Math.max(0, safeEnd - safeStart),
      totalStudyTime: Math.max(0, safeEnd - safeStart),
      date: new Date(safeStart).toISOString().slice(0, 10),
      task: 'Tracker update',
      topics: [],
      notes: trackerForm.notes || `Tracked ${totalMinutes} minutes in ${chapter.name}`,
    })

    setTrackerForm({ start: '', end: '', minutes: '', notes: '' })
  }

  const resetTracker = () => {
    resetChapterStudySessions(subject.name, chapter.name)
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link
          to={`/subjects/${subject.id}/chapters`}
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          {subject.name}
        </Link>

        <h2 className="mt-3 text-lg font-semibold text-[#e8e8e8]">{chapter.name}</h2>
        <div className="mt-1 flex items-center gap-3"><p className="text-xs text-[#858585]">Resources are mapped from the v5 workbook to their exact chapter and topic.</p><label className="flex shrink-0 items-center gap-1.5 text-xs text-[#9d9d9d]"><input type="checkbox" checked={chapterIsComplete} onChange={toggleChapterComplete} className="accent-[#0e639c]" />Chapter complete</label></div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Difficulty: {chapter.difficulty}</span>
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Priority: {chapter.priority ?? subject.priority ?? 'Medium'}</span>
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">PYQs: {chapter.pyqFrequency}</span>
          {chapter.mathPrerequisites && <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Prerequisites: {chapter.mathPrerequisites}</span>}
        </div>
        {(chapter.questionStyle || chapter.commonMisconceptions) && <p className="mt-2 max-w-4xl text-xs leading-relaxed text-[#858585]">{chapter.questionStyle && <>Typical question: {chapter.questionStyle}.</>} {chapter.commonMisconceptions && <>Watch for: {chapter.commonMisconceptions}.</>}</p>}
        <section className="mt-3 max-w-4xl rounded-md border border-[#0e639c]/30 bg-[#0e639c]/10 px-3 py-2.5"><p className="text-[10px] font-medium uppercase tracking-wide text-[#4fc1ff]">V3 study method · {workflow.label}</p><p className="mt-1 text-xs text-[#cccccc]">{workflow.steps.join(' → ')}</p><p className="mt-1 text-[11px] text-[#9d9d9d]">{workflow.note}</p></section>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-[#3c3c3c] px-1 pb-px">
        {RESOURCE_TYPE_ORDER.map((typeKey) => (
          <NavLink
            key={typeKey}
            to={TAB_PATHS[typeKey]}
            className={({ isActive }) =>
              [
                'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors duration-150',
                isActive
                  ? 'border-[#0e639c] text-[#e8e8e8]'
                  : 'border-transparent text-[#9d9d9d] hover:text-[#cccccc]',
              ].join(' ')
            }
          >
            {RESOURCE_TYPE_META[typeKey].label}
            <span className="ml-1.5 text-[10px] text-[#6e6e6e]">{resources[typeKey].length}</span>
          </NavLink>
        ))}
        <NavLink
          to="pyqs"
          className={({ isActive }) => [
            'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors duration-150',
            isActive ? 'border-[#0e639c] text-[#e8e8e8]' : 'border-transparent text-[#9d9d9d] hover:text-[#cccccc]',
          ].join(' ')}
        >
          Question Bank
        </NavLink>
      </nav>

      {v61Rows.length > 0 && (
        <section className="rounded-lg border border-[#3c3c3c] bg-[#1f1f1f] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#7fc9ff]">v6.1 Lecture Sheet</p>
              <p className="mt-1 text-sm text-[#e8e8e8]">{chapter.name} · {v61Rows.length} linked lecture{v61Rows.length === 1 ? '' : 's'}</p>
            </div>
          </div>
          <div className="mt-3 grid gap-3">
            {v61Rows.map((row) => (
              <article key={row.resourceId} className="rounded-md border border-[#3c3c3c] bg-[#252526] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#e8e8e8]">Lecture {row.lectureNumber ?? '—'} · {row.subtopic || row.chapter}</p>
                    <p className="mt-1 text-[11px] text-[#9d9d9d]">{row.source || 'Direct video'} · {row.exam || 'JAM/JEST'} · {row.roadmap || 'Roadmap not set'}</p>
                  </div>
                  {row.videoUrl && (
                    <button
                      type="button"
                      onClick={() => ResourceLauncherService.open({
                        id: row.resourceId,
                        title: `Lecture ${row.lectureNumber ?? ''} · ${row.subtopic || row.chapter}`,
                        url: row.videoUrl,
                        type: 'video',
                        subjectName: subject.name,
                      })}
                      className="inline-flex items-center gap-1 rounded-md border border-[#0e639c] bg-[#0e639c]/10 px-2 py-1 text-[11px] font-medium text-[#bfe6ff] hover:bg-[#0e639c]/20"
                    >
                      Open link <ExternalLink size={12} />
                    </button>
                  )}
                </div>
                <div className="mt-2 grid gap-2 text-[11px] text-[#c7c7c7] md:grid-cols-2">
                  {row.whatToWatch && <p><span className="text-[#7e7e7e]">Focus:</span> {row.whatToWatch}</p>}
                  {row.bookReference && <p><span className="text-[#7e7e7e]">Book:</span> {row.bookReference}</p>}
                  {row.timing && <p><span className="text-[#7e7e7e]">Timing:</span> {row.timing}</p>}
                  {row.additionalNotes && <p className="md:col-span-2"><span className="text-[#7e7e7e]">Notes:</span> {row.additionalNotes}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#7fc9ff]">Chapter tracking</p>
            <p className="mt-1 text-sm text-[#e8e8e8]">Track your chapter study time and keep the session history in this screen.</p>
          </div>
          <button type="button" onClick={resetTracker} className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs text-[#d0d0d0] hover:border-[#4a4a4a] hover:text-white">Reset chapter tracker</button>
        </div>

        <div className="mt-3 space-y-3">
          {chapterSessions.length > 0 ? (
            <div className="space-y-2">
              {chapterSessions.map((session) => (
                <div key={session.id} className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-xs text-[#d0d0d0]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-[#f0f0f0]">{new Date(session.startTime ?? Date.now()).toLocaleString()}</span>
                    <span className="rounded-full border border-[#0e639c]/30 bg-[#0e639c]/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#bfe6ff]">{Math.max(1, Math.round((session.duration ?? (session.totalStudyTime ?? 0)) / 60000))} min</span>
                  </div>
                  <p className="mt-1 text-[#9d9d9d]">{session.notes || 'Study session tracked manually.'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#858585]">No study sessions saved for this chapter yet.</p>
          )}
        </div>

        <form onSubmit={handleTrackerSave} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-wide text-[#8a8a8a]">
            Start time
            <input type="datetime-local" value={trackerForm.start} onChange={(event) => setTrackerForm((current) => ({ ...current, start: event.target.value }))} className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-2 text-sm text-[#e8e8e8] outline-none ring-0 focus:border-[#0e639c]" />
          </label>
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-wide text-[#8a8a8a]">
            End time
            <input type="datetime-local" value={trackerForm.end} onChange={(event) => setTrackerForm((current) => ({ ...current, end: event.target.value }))} className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-2 text-sm text-[#e8e8e8] outline-none ring-0 focus:border-[#0e639c]" />
          </label>
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-wide text-[#8a8a8a]">
            Total minutes
            <input type="number" min="0" step="5" value={trackerForm.minutes} onChange={(event) => setTrackerForm((current) => ({ ...current, minutes: event.target.value }))} placeholder="45" className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-2 text-sm text-[#e8e8e8] outline-none ring-0 focus:border-[#0e639c]" />
          </label>
          <label className="flex flex-col gap-1 text-[11px] uppercase tracking-wide text-[#8a8a8a] md:col-span-2">
            Notes
            <textarea rows={3} value={trackerForm.notes} onChange={(event) => setTrackerForm((current) => ({ ...current, notes: event.target.value }))} placeholder="What did you study?" className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-2 text-sm text-[#e8e8e8] outline-none ring-0 focus:border-[#0e639c]" />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="rounded-md border border-[#0e639c] bg-[#0e639c] px-3 py-2 text-sm font-medium text-white hover:bg-[#1177bb]">Add study session</button>
          </div>
        </form>
      </section>

      <Outlet context={{ subject, chapter, resources }} />
    </div>
  )
}
