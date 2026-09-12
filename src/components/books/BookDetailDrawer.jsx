import { useMemo, useState } from 'react'
import { X, FileText, BookOpenText, ExternalLink, FolderOpen } from 'lucide-react'
import ResourceLauncherService from '../../services/ResourceLauncherService'

const BOOK_ZOTERO_KEYS = {
  'boas-ch-6': 'boas-ch-6',
  'boas-ch-3': 'boas-ch-3',
  'zettili': 'zettili',
  'griffiths': 'griffiths',
  'kleppner': 'kleppner',
  'kittel': 'kittel',
}

export default function BookDetailDrawer({ book, onClose }) {
  const [manualZoteroUrl, setManualZoteroUrl] = useState('')
  const [showManualZotero, setShowManualZotero] = useState(false)

  if (!book) return null

  const assignedChapters = Array.isArray(book.usedIn) && book.usedIn.length
    ? book.usedIn.map((item) => item.name ?? item.chapter ?? 'Assigned topic').join(' · ')
    : book.chapterName
      ? book.chapterName
      : 'Assigned in this subject'

  const bookKey = useMemo(() => {
    const raw = String(book?.id ?? book?.title ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return raw || 'book'
  }, [book])

  const configuredZoteroUri = useMemo(() => {
    const runtimeKeys = typeof window !== 'undefined' ? window.physicsOS?.zoteroKeys ?? {} : {}
    const fromRuntime = runtimeKeys[bookKey]
    if (typeof fromRuntime === 'string' && fromRuntime.trim()) return fromRuntime.trim()
    const fromStatic = BOOK_ZOTERO_KEYS[bookKey]
    if (typeof fromStatic === 'string' && fromStatic.trim()) return `zotero://select/library/collections/${encodeURIComponent(fromStatic)}`
    return null
  }, [bookKey])

  const openAcrobat = () => {
    if (book.url || book.path) {
      ResourceLauncherService.open({ ...book, type: 'books' })
      return
    }
    window.open('https://acrobat.adobe.com', '_blank', 'noopener,noreferrer')
  }

  const openZoteroUri = async (uri) => {
    try {
      if (window.physicsOSDesktop?.window?.openExternal) {
        await window.physicsOSDesktop.window.openExternal(uri)
        return
      }
    } catch {
      // fall through to browser fallback below
    }

    try {
      window.open(uri, '_blank', 'noopener,noreferrer')
    } catch {
      // no-op: custom Zotero scheme can be ignored safely when unavailable.
    }
  }

  const openZotero = async () => {
    const candidate = configuredZoteroUri ?? 'zotero://select/items'
    if (!configuredZoteroUri) {
      setShowManualZotero(true)
      return
    }
    await openZoteroUri(candidate)
  }

  const saveManualZotero = async () => {
    const trimmed = manualZoteroUrl.trim()
    if (trimmed) {
      if (typeof window !== 'undefined') {
        const runtime = window.physicsOS ?? {}
        runtime.zoteroKeys = runtime.zoteroKeys ?? {}
        runtime.zoteroKeys[bookKey] = trimmed
        window.physicsOS = runtime
      }
      await openZoteroUri(trimmed)
      setShowManualZotero(false)
      setManualZoteroUrl('')
      return
    }

    await openZoteroUri('zotero://select/items')
    setShowManualZotero(false)
    setManualZoteroUrl('')
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-end bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-[#e5e7eb]">
            <BookOpenText size={16} className="text-[#a5b4fc]" />
            <span className="text-sm font-medium">Book detail</span>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-400 hover:text-white" aria-label="Close book detail">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md border border-[#f5d76d]/40 bg-gradient-to-b from-[#5c1a1a] via-[#2b0f17] to-[#1b1118] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f5d76d] shadow-inner">
              {book.title?.slice(0, 2) ?? 'BK'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-white">{book.title}</p>
              <p className="mt-1 text-xs text-[#cbd5e1]">{book.author || 'Author not set'}</p>
              <p className="mt-1 text-[11px] text-[#94a3b8]">{book.edition || book.pages ? `${book.edition ?? 'Edition not set'} · ${book.pages ? `${book.pages} pages` : 'pages not set'}` : 'Edition and page count not set'}</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#171f2e] p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#7dd3fc]">Assigned chapters in this subject</p>
            <p className="mt-2 text-sm text-slate-200">{assignedChapters}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={openAcrobat} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#f5d76d]/40 bg-[#f5d76d]/10 px-3 py-2 text-xs font-medium text-[#f5d76d] hover:bg-[#f5d76d]/15">
              <FileText size={14} />
              Open in Adobe Acrobat ↗
            </button>
            <button type="button" onClick={openZotero} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-3 py-2 text-xs font-medium text-[#c4b5fd] hover:bg-[#8b5cf6]/15">
              <FolderOpen size={14} />
              Open in Zotero ↗
            </button>
          </div>

          {showManualZotero && (
            <div className="rounded-lg border border-[#8b5cf6]/30 bg-[#1d1630] p-3">
              <p className="text-[11px] text-[#e9d5ff]">Book reference: {book.title}. Enter Zotero link or select from Zotero.</p>
              <input
                type="text"
                value={manualZoteroUrl}
                onChange={(event) => setManualZoteroUrl(event.target.value)}
                placeholder="zotero://select/items"
                className="mt-2 w-full rounded-md border border-[#3c3c3c] bg-[#111827] px-2.5 py-2 text-sm text-[#e8e8e8] outline-none focus:border-[#8b5cf6]"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowManualZotero(false)} className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs text-[#d0d0d0]">Cancel</button>
                <button type="button" onClick={saveManualZotero} className="rounded-md border border-[#8b5cf6]/30 bg-[#8b5cf6]/20 px-3 py-1.5 text-xs font-medium text-[#e9d5ff]">Save</button>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-white/10 bg-[#111827] p-3 text-sm text-slate-300">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#a5b4fc]">Chapter notes / formulas preview</p>
            <p className="mt-2 leading-relaxed text-slate-200">
              {book.description || 'Use this text as the primary reading anchor for the topic plan, then convert key equations into your own formula sheet before attempting the chapter problem set.'}
            </p>
            {book.syllabus && <p className="mt-2 text-[11px] text-[#94a3b8]">Coverage: {book.syllabus}</p>}
          </div>

          {book.url && (
            <a href={book.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-sky-300 hover:text-sky-200">
              Open direct resource <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
