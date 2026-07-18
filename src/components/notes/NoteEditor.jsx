import { useCallback, useEffect, useRef, useState } from 'react'
import { Columns2, Eye, Maximize2, Minimize2, Pencil } from 'lucide-react'
import MarkdownToolbar from './MarkdownToolbar'
import MarkdownPreview from './MarkdownPreview'
import WordCountBar from './WordCountBar'
import ExportButtons from './ExportButtons'
import NotePinButton from './NotePinButton'
import NoteBookmarkButton from './NoteBookmarkButton'
import { AUTOSAVE_DELAY_MS, EDITOR_VIEW_MODES } from '../../constants/notesConstants'

const VIEW_TOGGLES = [
  { mode: EDITOR_VIEW_MODES.EDITOR, label: 'Editor Only', icon: Pencil },
  { mode: EDITOR_VIEW_MODES.SPLIT, label: 'Split View', icon: Columns2 },
  { mode: EDITOR_VIEW_MODES.PREVIEW, label: 'Preview Only', icon: Eye },
]

export default function NoteEditor({ note, onChange, onTogglePin, onToggleBookmark }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [viewMode, setViewMode] = useState(EDITOR_VIEW_MODES.SPLIT)
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setSaveStatus('Saved')
  }, [note.id])

  useEffect(() => {
    if (title === note.title && content === note.content) return undefined

    setSaveStatus('Saving...')
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      onChange({ title, content })
      setSaveStatus('Saved')
    }, AUTOSAVE_DELAY_MS)

    return () => clearTimeout(saveTimeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content])

  const applyToolbarAction = useCallback((action) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea
    const selected = value.slice(selectionStart, selectionEnd)
    const insertion = `${action.before}${selected}${action.after ?? ''}`
    const nextValue = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd)

    setContent(nextValue)

    requestAnimationFrame(() => {
      textarea.focus()
      const cursor = selectionStart + action.before.length + selected.length
      textarea.setSelectionRange(cursor, cursor)
    })
  }, [])

  const showEditor = viewMode !== EDITOR_VIEW_MODES.PREVIEW
  const showPreview = viewMode !== EDITOR_VIEW_MODES.EDITOR

  return (
    <div
      className={[
        'flex flex-col rounded-lg border border-[#3c3c3c] bg-[#1e1e1e]',
        isFullscreen ? 'fixed inset-2 z-50 sm:inset-4' : 'h-[calc(100dvh-11rem)]',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3c3c3c] px-3 py-2 print:hidden">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#e8e8e8] placeholder:text-[#6e6e6e] focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6e6e6e]">{saveStatus}</span>
          <NotePinButton active={note.pinned} onToggle={() => onTogglePin(note.id)} />
          <NoteBookmarkButton active={note.bookmarked} onToggle={() => onToggleBookmark(note.id)} />
          <button
            type="button"
            title={isFullscreen ? 'Exit full screen' : 'Distraction-free mode'}
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#3c3c3c] text-[#858585] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
          >
            {isFullscreen ? <Minimize2 size={14} strokeWidth={1.75} /> : <Maximize2 size={14} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3c3c3c] px-2 py-1.5 print:hidden">
        <div className="flex items-center gap-1 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-0.5">
          {VIEW_TOGGLES.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              type="button"
              title={label}
              aria-pressed={viewMode === mode}
              onClick={() => setViewMode(mode)}
              className={[
                'flex h-6.5 items-center gap-1 rounded px-2 text-[11px] transition-colors duration-150',
                viewMode === mode ? 'bg-[#0e639c]/20 text-[#4fc1ff]' : 'text-[#858585] hover:text-[#cccccc]',
              ].join(' ')}
            >
              <Icon size={12} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
        <ExportButtons />
      </div>

      <MarkdownToolbar onAction={applyToolbarAction} disabled={!showEditor} />

      <div className="flex min-h-0 flex-1">
        {showEditor && (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Start writing in Markdown..."
            spellCheck={false}
            className={[
              'h-full min-h-0 resize-none bg-transparent px-4 py-3 font-mono text-sm text-[#cccccc] placeholder:text-[#6e6e6e] focus:outline-none',
              showPreview ? 'w-1/2 border-r border-[#3c3c3c]' : 'w-full',
            ].join(' ')}
          />
        )}
        {showPreview && (
          <div className={showEditor ? 'w-1/2' : 'w-full'}>
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#3c3c3c] px-3 py-1.5 print:hidden">
        <WordCountBar content={content} />
      </div>
    </div>
  )
}
