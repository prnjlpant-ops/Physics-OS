import React, { useEffect } from 'react'

export default function FocusVideoModal({
  isOpen,
  onClose,
  videoUrl,
  lectureTitle,
  open,
  video,
  subject,
  chapter,
}) {
  const resolvedOpen = isOpen ?? open ?? false
  const resolvedUrl = videoUrl ?? video?.url ?? video?.videoUrl ?? ''
  const resolvedTitle = lectureTitle ?? video?.title ?? 'Video Lecture'

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!resolvedOpen || !resolvedUrl) return null

  const match = resolvedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  const videoId = match ? match[1] : null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[#0f111a] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#141724] px-4 py-3">
          <h3 className="truncate pr-4 text-sm font-medium text-slate-200">
            {resolvedTitle || 'Video Lecture'}
          </h3>
          <div className="flex items-center gap-3">
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 transition hover:text-indigo-300"
            >
              Open in Browser ↗
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-sm font-bold leading-none text-slate-400 hover:text-white"
              aria-label="Close video"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative aspect-video w-full bg-black">
          {videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&autoplay=1`}
              title={resolvedTitle || 'Lecture'}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
              <p>Could not parse video embed.</p>
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded bg-indigo-600 px-4 py-2 text-xs text-white hover:bg-indigo-500"
              >
                Open directly in browser ↗
              </a>
            </div>
          )}
        </div>

        {(subject || chapter) && (
          <div className="border-t border-white/10 bg-[#141724] px-4 py-2 text-[11px] text-slate-300">
            {subject && chapter ? `${subject} · ${chapter}` : subject || chapter}
          </div>
        )}
      </div>
    </div>
  )
}
