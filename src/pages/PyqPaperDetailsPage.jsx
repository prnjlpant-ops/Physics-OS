import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Copy, Check, FolderOpen } from 'lucide-react'
import { usePyqLibrary } from '../hooks/usePyqLibrary'
import { EXAM_META, PAPER_STATUS_ORDER, PAPER_STATUS_STYLES } from '../constants/pyqLibraryConstants'
import PaperBookmarkButton from '../components/paperLibrary/PaperBookmarkButton'
import ClipboardService from '../services/ClipboardService'
import ResourceLauncherService from '../services/ResourceLauncherService'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{label}</p>
      <p className="mt-0.5 text-sm text-[#e8e8e8]">{value || '—'}</p>
    </div>
  )
}

/**
 * Sprint 25 — PYQ Engine.
 *
 * A reusable details page for any paper in the Master Index — not tied to
 * one exam, so JEST/IIT JAM/GATE (and TIFR GS / CSIR NET once pyqs.json
 * grows to include them) all route here.
 *
 * Sprint 28 — Desktop Readiness Layer: "Open Paper" now goes through
 * ResourceLauncherService instead of being permanently disabled. There is
 * still no real desktop file integration (out of scope — see Sprint 28's
 * DO NOT IMPLEMENT list), so in Browser mode this resolves to a
 * NotificationService message explaining that, rather than silently doing
 * nothing. Once Physics OS runs as a desktop app (Sprint 29), the exact
 * same button opens the file directly.
 */
export default function PyqPaperDetailsPage() {
  const { paperId } = useParams()
  const { getPaperById, bookmarkIds, toggleBookmark, setStatus, getTopicIndexForPaper } = usePyqLibrary()
  const [copied, setCopied] = useState(false)

  const paper = getPaperById(paperId)

  if (!paper) {
    return (
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/pyqs" className="inline-flex items-center gap-1.5 text-xs text-[#858585] hover:text-[#cccccc]">
          <ArrowLeft size={14} strokeWidth={1.75} />
          PYQs
        </Link>
        <p className="text-sm text-[#9d9d9d]">That paper couldn&apos;t be found in the Paper Library.</p>
      </div>
    )
  }

  const isBookmarked = bookmarkIds.includes(paper.id)
  const topicIndexEntry = getTopicIndexForPaper(paper.id)

  const handleCopyPath = async () => {
    if (!paper.fullPath) return
    const ok = await ClipboardService.copy(paper.fullPath)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleOpenPaper = () => {
    ResourceLauncherService.openPyqPaper(paper)
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <Link
        to="/pyqs"
        className="inline-flex w-fit items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
      >
        <ArrowLeft size={14} strokeWidth={1.75} />
        PYQs
      </Link>

      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-[#e8e8e8]">
            {EXAM_META[paper.exam]?.label ?? paper.exam} {paper.year ?? ''}
          </h2>
          <p className="mt-0.5 text-xs text-[#858585]">{paper.subject}</p>
        </div>
        <PaperBookmarkButton active={isBookmarked} onToggle={() => toggleBookmark(paper.id)} size={16} />
      </div>

      <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Exam" value={EXAM_META[paper.exam]?.label ?? paper.exam} />
          <Field label="Year" value={paper.year} />
          <Field label="Subject" value={paper.subject} />
          <Field label="Questions" value={paper.questionCount != null ? paper.questionCount : 'Not Indexed'} />
          <Field label="Status" value={paper.status} />
        </div>

        <div className="mt-4 border-t border-[#3c3c3c] pt-3">
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">File Path</p>
          <p className="mt-1 truncate font-mono text-[11px] text-[#9d9d9d]" title={paper.fullPath ?? undefined}>
            {paper.fullPath ?? 'Not Added'}
          </p>
        </div>

        {!topicIndexEntry && (
          <p className="mt-3 border-t border-[#3c3c3c] pt-3 text-[11px] leading-relaxed text-[#6e6e6e]">
            Topic-wise question breakdown isn&apos;t available yet — that arrives once pyq_index.json is
            populated in a future sprint.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Progress</p>
        <div className="flex flex-wrap gap-1.5">
          {PAPER_STATUS_ORDER.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatus(paper.id, status)}
              className={[
                'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-150',
                status === paper.status
                  ? PAPER_STATUS_STYLES[status]
                  : 'border-[#3c3c3c] bg-transparent text-[#6e6e6e] hover:border-[#4a4a4a] hover:text-[#9d9d9d]',
              ].join(' ')}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopyPath}
          disabled={!paper.fullPath}
          title={paper.fullPath ? 'Copy the full local path' : 'No path to copy yet'}
          className={[
            'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150',
            paper.fullPath
              ? 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a]'
              : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#6e6e6e]',
          ].join(' ')}
        >
          {copied ? <Check size={13} strokeWidth={1.75} /> : <Copy size={13} strokeWidth={1.75} />}
          {copied ? 'Copied' : 'Copy Path'}
        </button>

        <button
          type="button"
          onClick={handleOpenPaper}
          title={paper.fullPath ? 'Open this paper' : 'No path is set for this paper yet'}
          className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <FolderOpen size={13} strokeWidth={1.75} />
          Open Paper
        </button>
      </div>
    </div>
  )
}
