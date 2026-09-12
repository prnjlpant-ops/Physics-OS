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
import { generateSessionId, saveStudySession, resetChapterStudySessions, getChapterStudySessions } from '../../../utils/studySessionsStorage'
import { buildLectureScopeGroups, normalizeLectureScope, LECTURE_SCOPE_META } from '../../../utils/lectureScope'
import FocusVideoModal from '../../../components/ui/FocusVideoModal'
import { V6_CURRICULUM_BY_CHAPTER } from '../../../data/v6CurriculumData.js'

const VERIFIED_V61_VIDEO_URLS = {
  'vector calculus & linear algebra': {
    'scalar field and its gradient': 'https://www.youtube.com/watch?v=NED2Cl8u9Q0',
    'line and surface integrals of vector fields': 'https://www.youtube.com/watch?v=W25SVn2bA8I',
    'divergence and curl of vector fields': 'https://www.youtube.com/watch?v=SZCsFS9izfQ',
    'conservative fields & stokes theorem': 'https://www.youtube.com/watch?v=MZILJp2iKUs',
    'laplacian operator & curvilinear coordinates': 'https://www.youtube.com/watch?v=l35iUUA7Nrk',
  },
  'complex analysis & residue theorem': {
    'complex algebra, cauchy-riemann conditions (basic)': 'https://www.youtube.com/watch?v=DmbN5tZaXoE',
    'residue theorem, contour integration, laurent series (full)': 'https://www.youtube.com/watch?v=qWmFE_vnKJQ',
    'residue theorem, contour integration, laurent series': 'https://www.youtube.com/watch?v=qWmFE_vnKJQ',
    'complex analysis — alternate source': 'https://www.youtube.com/watch?v=DmbN5tZaXoE',
  },
}

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
  const [activeVideo, setActiveVideo] = useState(null)

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

  const cleanStr = (value = '') => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')

  let chapterBoxes = V6_CURRICULUM_BY_CHAPTER[chapterSlug] || V6_CURRICULUM_BY_CHAPTER[chapter.slug] || []
  if (!chapterBoxes.length) {
    const activeClean = cleanStr(chapterSlug || chapter.slug || chapter.name)
    const matchedKey = Object.keys(V6_CURRICULUM_BY_CHAPTER).find((key) => {
      const keyClean = cleanStr(key)
      return keyClean === activeClean || keyClean.includes(activeClean) || activeClean.includes(keyClean)
    })
    chapterBoxes = matchedKey ? V6_CURRICULUM_BY_CHAPTER[matchedKey] : []
  }

  const toggleChapterComplete = () => {
    const nextStatus = chapterIsComplete ? TOPIC_STATUS.NOT_STARTED : TOPIC_STATUS.MASTERED
    syllabusTopics.forEach((topic) => setStatus(topic.id, nextStatus))
  }

  const lectureVideos = (chapterBoxes.length ? chapterBoxes.flatMap((box) => (box.lectures ?? []).map((lecture, index) => ({
    ...lecture,
    title: lecture.title || lecture.subTopic || box.boxTitle || 'Lecture topic',
    lectureNumber: index + 1,
    sourceLabel: lecture.source || 'V6.1 Curriculum',
    focus: lecture.focus || lecture.notes || 'Core topic coverage and worked examples.',
    timing: lecture.timing || 'Phase A — by early Oct',
    notes: lecture.notes || 'Study the linked chapter and worked examples.',
    book: lecture.book || 'Kleppner & Kolenkow',
    bookReference: lecture.book || lecture.bookReference || 'Kleppner & Kolenkow',
    examScope: normalizeLectureScope(lecture.scope ?? box.scope ?? 'JAM_JEST'),
    videoUrl: lecture.videoUrl || lecture.url || '',
    scopeColor: box.color || 'blue',
  }))) : [])

  const scopeGroups = buildLectureScopeGroups(lectureVideos)

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
          to={`/subjects/${subject.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          {subject.name}
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#e8e8e8]">{chapter.name}</h2>
            <div className="mt-2 flex items-center gap-3">
              <label className="flex shrink-0 items-center gap-1.5 text-xs text-[#9d9d9d]">
                <input type="checkbox" checked={chapterIsComplete} onChange={toggleChapterComplete} className="accent-[#0e639c]" />
                Chapter complete
              </label>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Difficulty: {chapter.difficulty}</span>
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Priority: {chapter.priority ?? subject.priority ?? 'Medium'}</span>
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">PYQs: {chapter.pyqFrequency}</span>
          {chapter.mathPrerequisites && <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Prerequisites: {chapter.mathPrerequisites}</span>}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Books {resources.books.length}</span>
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Videos {resources.videos.length}</span>
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">Question Bank</span>
        </div>

        {(chapter.questionStyle || chapter.commonMisconceptions) && <p className="mt-2 max-w-4xl text-xs leading-relaxed text-[#858585]">{chapter.questionStyle && <>Typical question: {chapter.questionStyle}.</>} {chapter.commonMisconceptions && <>Watch for: {chapter.commonMisconceptions}.</>}</p>}
        <section className="mt-3 max-w-4xl rounded-md border border-[#0e639c]/30 bg-[#0e639c]/10 px-3 py-2.5"><p className="text-[10px] font-medium uppercase tracking-wide text-[#4fc1ff]">V3 study method · {workflow.label}</p><p className="mt-1 text-xs text-[#cccccc]">{workflow.steps.join(' → ')}</p><p className="mt-1 text-[11px] text-[#9d9d9d]">{workflow.note}</p></section>
      </div>

      <section className="rounded-xl border border-[#3a3a3a] bg-[#111827] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#7dd3fc]">V6.1 LECTURE SHEET</p>
            <p className="mt-1 text-xs text-[#9d9d9d]">{chapter.name} · {lectureVideos.length} linked lectures</p>
          </div>
          <span className="rounded-full border border-[#2b2f3b] bg-[#1d2433] px-2 py-1 text-[10px] uppercase tracking-wide text-[#dbeafe]">{lectureVideos.length} lectures</span>
        </div>

        <div className="space-y-4">
          {lectureVideos.length === 0 ? (
            <div className="rounded-lg border border-[#3c3c3c] bg-[#1b1f2b] px-3 py-4 text-sm text-[#9d9d9d]">No lecture videos mapped to this chapter yet.</div>
          ) : chapterBoxes.length > 0 ? (
            chapterBoxes.map((box) => {
              const scopeColor = box.color === 'green' ? 'border-emerald-500/30 bg-emerald-950/10' : box.color === 'yellow' ? 'border-amber-500/30 bg-amber-950/10' : 'border-indigo-500/30 bg-indigo-950/10'
              const badgeColor = box.color === 'green' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : box.color === 'yellow' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              const badgeText = box.badgeText || box.scope || 'JAM + JEST'
              return (
                <div key={`${box.boxTitle}-${box.scope || badgeText}`} className={`rounded-xl border p-4 ${scopeColor}`}>
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${badgeColor}`}>
                        {badgeText}
                      </span>
                      <span className="text-[11px] text-slate-400">{box.boxTitle}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{box.examScopeHeader || 'Phase A — Foundation / High Yield'}</span>
                  </div>

                  <div className="space-y-3">
                    {(box.lectures ?? []).map((lecture, idx) => (
                      <article key={lecture.id || `${lecture.title}-${idx}`} className="rounded-lg border border-white/5 bg-[#121422] p-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#f3f4f6]">{lecture.title || `Lecture ${idx + 1}`}</p>
                            <p className="mt-1 text-[11px] text-[#7dd3fc]">{lecture.source || 'V6.1 Curriculum'} · {badgeText} · {lecture.chapter || chapter.name}</p>

                            <div className="mt-3 grid gap-2 text-[11px] text-[#dfe7f5] md:grid-cols-2">
                              <div>
                                <span className="font-semibold text-[#8bbcff]">Focus:</span> {lecture.focus || lecture.notes || 'Core topic coverage and worked examples.'}
                              </div>
                              <div>
                                <span className="font-semibold text-[#8bbcff]">Timing:</span> {lecture.timing || 'Phase A — by early Oct'}
                              </div>
                              <div>
                                <span className="font-semibold text-[#8bbcff]">Notes:</span> {lecture.notes || 'Used throughout the chapter problem set.'}
                              </div>
                              <div>
                                <span className="font-semibold text-[#8bbcff]">Book:</span>{' '}
                                <a
                                  href={lecture.videoUrl || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full border border-[#f5d76d]/30 bg-[#f5d76d]/10 px-2 py-0.5 text-[10px] font-medium text-[#f5d76d] hover:bg-[#f5d76d]/15"
                                >
                                  📖 {lecture.book || lecture.bookReference || 'Kleppner & Kolenkow'}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveVideo(lecture)}
                                className="rounded border border-indigo-500/30 bg-indigo-600/20 px-3 py-1.5 text-xs text-indigo-200 transition hover:bg-indigo-600/40"
                              >
                                📺 Watch in App
                              </button>

                              <a
                                href={lecture.videoUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(event) => {
                                  const href = lecture.videoUrl
                                  if (!href) return
                                  if (window.physicsOSDesktop?.window?.openExternal) {
                                    event.preventDefault()
                                    window.physicsOSDesktop.window.openExternal(href).catch(() => {
                                      window.open(href, '_blank', 'noopener,noreferrer')
                                    })
                                  }
                                }}
                                className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                              >
                                🌐 Open link ↗
                              </a>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            scopeGroups.map((group) => (
              <div key={group.scopeKey} className={`rounded-xl border p-4 ${group.containerStyles}`}>
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${group.badgeStyles}`}>
                      {group.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {group.lectures.length} {group.lectures.length === 1 ? 'lecture' : 'lectures'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{group.phaseNote}</span>
                </div>

                <div className="space-y-3">
                  {group.lectures.map((lecture, idx) => (
                    <article key={lecture.id || `${lecture.title}-${lecture.lectureNumber || idx}`} className="rounded-lg border border-white/5 bg-[#121422] p-3">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#f3f4f6]">Lecture {lecture.lectureNumber || idx + 1} - {lecture.title}</p>
                          <p className="mt-1 text-[11px] text-[#7dd3fc]">{lecture.sourceLabel} — {lecture.sourceLabel === 'NPTEL' ? 'Prof. D.K. Ghosh' : lecture.sourceLabel} · {group.label} · Topic {lecture.lectureNumber || idx + 1}</p>

                          <div className="mt-3 grid gap-2 text-[11px] text-[#dfe7f5] md:grid-cols-2">
                            <div>
                              <span className="font-semibold text-[#8bbcff]">Focus:</span> {lecture.focus}
                            </div>
                            <div>
                              <span className="font-semibold text-[#8bbcff]">Timing:</span> {lecture.timing}
                            </div>
                            <div>
                              <span className="font-semibold text-[#8bbcff]">Notes:</span> {lecture.notes}
                            </div>
                            <div>
                              <span className="font-semibold text-[#8bbcff]">Book:</span>{' '}
                              <a
                                href={lecture.videoUrl || lecture.url || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-[#f5d76d]/30 bg-[#f5d76d]/10 px-2 py-0.5 text-[10px] font-medium text-[#f5d76d] hover:bg-[#f5d76d]/15"
                              >
                                📖 {lecture.bookReference}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveVideo(lecture)}
                              className="rounded border border-indigo-500/30 bg-indigo-600/20 px-3 py-1.5 text-xs text-indigo-200 transition hover:bg-indigo-600/40"
                            >
                              📺 Watch in App
                            </button>

                            <a
                              href={lecture.videoUrl || lecture.url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => {
                                const href = lecture.videoUrl || lecture.url
                                if (!href) return
                                if (window.physicsOSDesktop?.window?.openExternal) {
                                  event.preventDefault()
                                  window.physicsOSDesktop.window.openExternal(href).catch(() => {
                                    window.open(href, '_blank', 'noopener,noreferrer')
                                  })
                                }
                              }}
                              className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                            >
                              Open link ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

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

      {activeVideo && (
        <FocusVideoModal
          open={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
          video={activeVideo}
          subject={subject.name}
          chapter={chapter.name}
        />
      )}

      <Outlet context={{ subject, chapter, resources }} />
    </div>
  )
}
