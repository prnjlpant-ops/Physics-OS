import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../../hooks/useWorkspace'
import { getSubjectById, getChapterBySlug } from '../../engine/blueprintService'

/**
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Was a static placeholder ("Not Selected" / "None" / a dead button) —
 * now reflects WorkspaceService's persisted Current Subject/Chapter, set
 * as the user browses Subject and Chapter pages (see SubjectLayout,
 * ChapterResourceLayout), and survives a refresh.
 */
export default function ContinueStudyingCard() {
  const workspace = useWorkspace()
  const subject = workspace.currentSubjectId ? getSubjectById(workspace.currentSubjectId) : null
  const chapterLookup =
    subject && workspace.currentChapterSlug ? getChapterBySlug(subject.id, workspace.currentChapterSlug) : null
  const chapter = chapterLookup?.chapter ?? null

  const continueHref = subject
    ? chapter
      ? `/subjects/${subject.id}/chapters/${chapter.slug}`
      : `/subjects/${subject.id}/chapters`
    : '/subjects'

  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#2d2d2d] px-6 py-5 transition-colors duration-150 hover:border-[#4a4a4a]">
      <div className="flex items-center gap-2 text-[#e8e8e8]">
        <Play size={18} fill="currentColor" className="text-[#cccccc]" />
        <h2 className="text-lg font-semibold">Continue Studying</h2>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#858585]">
            Current Subject
          </dt>
          <dd className="mt-1 text-sm text-[#cccccc]">{subject?.name ?? 'Not Selected'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#858585]">
            Current Chapter
          </dt>
          <dd className="mt-1 text-sm text-[#cccccc]">{chapter?.name ?? 'None'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[#858585]">
            Estimated Remaining Time
          </dt>
          <dd className="mt-1 text-sm text-[#cccccc]">--</dd>
        </div>
      </dl>

      <Link
        to={continueHref}
        className="mt-6 inline-block rounded-md bg-[#0e639c] px-4 py-2 text-sm font-medium text-[#ffffff] transition-colors duration-150 hover:bg-[#1177bb]"
      >
        Continue →
      </Link>
    </section>
  )
}
