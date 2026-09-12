import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import useDesktopMenu from '../hooks/useDesktopMenu'
import { StudyTimerProvider, useStudyTimer } from '../context/StudyTimerContext'
import { MasterIndexProvider } from '../context/MasterIndexProvider'
import EndSessionModal from '../components/timer/EndSessionModal'
import NotificationHost from '../components/notifications/NotificationHost'
import DialogHost from '../components/dialogs/DialogHost'
import { getSubjectById, getChapterBySlug } from '../engine/blueprintService'
import { navigationItems } from '../constants/navigation'

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function AppShell() {
  useDesktopMenu()
  const location = useLocation()
  const navigate = useNavigate()
  const { elapsedMs } = useStudyTimer()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [deepWorkMode, setDeepWorkMode] = useState(false)

  const normalizedPath = location.pathname || '/'

  const crumbs = useMemo(() => {
    const segments = normalizedPath.split('/').filter(Boolean)
    const items = [{ label: 'Physics OS', href: '/' }]

    if (segments[0] === 'subjects' && segments[1]) {
      const subject = getSubjectById(segments[1])
      if (subject) {
        items.push({ label: subject.name, href: `/subjects/${subject.id}` })
      }

      if (segments[3] && segments[2] === 'chapters') {
        const chapter = getChapterBySlug(segments[1], segments[3])
        if (chapter?.chapter) {
          items.push({ label: chapter.chapter.name, href: `/subjects/${subject.id}/chapters/${chapter.chapter.slug}` })
        }
      }
    }

    const tabMatch = navigationItems.find((item) => item.path === '/' ? normalizedPath === '/' : normalizedPath.startsWith(item.path))
    if (tabMatch) {
      items.push({ label: tabMatch.label, href: tabMatch.path })
    } else if (segments.length > 0) {
      const last = segments[segments.length - 1].replace(/-/g, ' ')
      items.push({ label: last, href: normalizedPath })
    }

    return items
  }, [normalizedPath])

  useEffect(() => {
    const onKeyDown = (event) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName ?? '')
      const isEditor = document.activeElement?.isContentEditable

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault()
        setSidebarCollapsed((value) => !value)
      }

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        setDeepWorkMode((value) => !value)
      }

      if (event.key === 'Escape' && deepWorkMode && !isInput && !isEditor) {
        event.preventDefault()
        setDeepWorkMode(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [deepWorkMode])

  const handleBreadcrumbClick = (href) => {
    if (href === normalizedPath) return
    navigate(href)
  }

  return (
    <>
      {!deepWorkMode && (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 backdrop-blur-xl">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)] px-2 py-1 text-xs text-[var(--text-secondary)] transition hover:border-[var(--border-focus)] hover:text-[var(--text-primary)]"
            >
              {sidebarCollapsed ? 'Expand' : 'Collapse'}
            </button>
            <nav className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-[var(--text-secondary)]">
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1
                return (
                  <div key={`${crumb.href}-${index}`} className="flex min-w-0 items-center gap-2">
                    {index > 0 && <span className="text-[var(--text-muted)]">›</span>}
                    <button
                      type="button"
                      onClick={() => handleBreadcrumbClick(crumb.href)}
                      className={
                        'truncate rounded-md px-1.5 py-1 transition ' +
                        (isLast
                          ? 'cursor-default text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]')
                      }
                      disabled={isLast}
                    >
                      {crumb.label}
                    </button>
                  </div>
                )
              })}
            </nav>
          </div>
          <div className="ml-4 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <div className="rounded-full border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)] px-2 py-1">
              {formatElapsed(elapsedMs)}
            </div>
          </div>
        </header>
      )}

      <div className="flex h-[calc(100dvh-var(--topbar-height,0px))] overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        {!deepWorkMode && <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />}

        <div className="relative flex min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-y-auto bg-[var(--bg-canvas)]">
            <Outlet />
          </main>
        </div>
      </div>

      {deepWorkMode && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-[rgba(4,7,13,0.74)] backdrop-blur-[3px]" aria-hidden="true">
          <div className="pointer-events-auto absolute right-5 top-5 flex items-center gap-2 rounded-full border border-[var(--border-focus)] bg-[rgba(15,17,26,0.8)] px-3 py-1.5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
            <span className="text-xs font-medium text-[var(--text-primary)]">{formatElapsed(elapsedMs)}</span>
            <button
              type="button"
              onClick={() => setDeepWorkMode(false)}
              className="rounded-full border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.04)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default function AppLayout() {
  return (
    <MasterIndexProvider>
      <StudyTimerProvider>
        <AppShell />
        <EndSessionModal />
        <NotificationHost />
        <DialogHost />
      </StudyTimerProvider>
    </MasterIndexProvider>
  )
}
