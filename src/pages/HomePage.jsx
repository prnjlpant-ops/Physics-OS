import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GreetingCard from './home/GreetingCard'
import ContinueStudyingCard from './home/ContinueStudyingCard'
import TodaysMissionSection from './home/TodaysMissionSection'
import StudyTimerPreview from './home/StudyTimerPreview'
import QuickAccess from './home/QuickAccess'
import ProgressSnapshot from './home/ProgressSnapshot'
import WorkspaceService from '../services/WorkspaceService.js'
import { getSubjectById, getChapterBySlug } from '../engine/blueprintService'

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()

  let session = null
  try {
    session = typeof WorkspaceService?.getState === 'function' ? WorkspaceService.getState() : null
  } catch (err) {
    console.warn('HomePage: could not read workspace state, using safe defaults.', err)
  }

  const workspace = session && typeof session === 'object' ? session : {}
  const subjectId = typeof workspace.currentSubjectId === 'string' ? workspace.currentSubjectId : ''
  const chapterSlug = typeof workspace.currentChapterSlug === 'string' ? workspace.currentChapterSlug : ''
  const subject = subjectId ? getSubjectById(subjectId) : null
  const chapterLookup = subject && chapterSlug ? getChapterBySlug(subject.id, chapterSlug) : null
  const chapter = chapterLookup?.chapter ?? null
  const hasResumeTarget = Boolean(subject && chapter && chapterSlug)

  const handleResume = useCallback(() => {
    if (!hasResumeTarget || !subject || !chapter) return
    navigate(`/subjects/${subject.id}/chapters/${chapter.slug}`, { replace: true })
  }, [chapter, hasResumeTarget, navigate, subject])

  useEffect(() => {
    if (!hasResumeTarget || !subject || !chapter) return
    if (location.pathname !== '/') return

    const handleKeyDown = (event) => {
      const tagName = document.activeElement?.tagName ?? ''
      const isTypingField = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT'
      const isResumeKey = event.code === 'Space' || event.key === 'Enter' || event.code === 'NumpadEnter'

      if (isTypingField || !isResumeKey || event.repeat) return
      event.preventDefault()
      handleResume()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleResume, hasResumeTarget, location.pathname, subject, chapter])

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      {hasResumeTarget && subject && chapter ? (
        <section className="rounded-xl border border-[#f59e0b]/60 bg-gradient-to-r from-[#1c1a17] via-[#1b2a3f] to-[#143a52] p-5 shadow-[0_0_0_1px_rgba(245,158,11,0.18)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#fbbf24]">Auto-resume</p>
              <h2 className="mt-2 text-2xl font-bold text-[#f8fafc]">
                ⚡ Resume {subject.name} → {chapter.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleResume}
              className="inline-flex items-center justify-center rounded-md bg-[#f59e0b] px-4 py-2 text-sm font-semibold text-[#111827] shadow-lg shadow-[#f59e0b]/20 transition hover:bg-[#fbbf24]"
            >
              Continue
            </button>
          </div>
          <p className="mt-3 text-sm text-[#dbeafe]">(Press Space or Enter to continue)</p>
        </section>
      ) : null}

      <GreetingCard />
      <ContinueStudyingCard />

      <div className="grid gap-5 lg:grid-cols-2">
        <TodaysMissionSection />
        <StudyTimerPreview />
      </div>

      <QuickAccess />
      <ProgressSnapshot />
    </div>
  )
}
