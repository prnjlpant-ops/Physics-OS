import WindowService from './WindowService'
import PathResolverService from './PathResolverService'
import NotificationService from './NotificationService'
import EnvironmentService from './EnvironmentService'
import RecentFilesService from './RecentFilesService'
import { LAUNCHABLE_RESOURCE_TYPES } from '../constants/desktopConstants'

// Re-exported so consumers (e.g. ResourceCard.jsx) can import it directly
// from this service instead of reaching into constants/desktopConstants —
// same single source of truth, just also available as a named export here.
export { LAUNCHABLE_RESOURCE_TYPES }

/**
 * RESOURCE LAUNCHER SERVICE
 * =========================
 * Sprint 28 — Desktop Readiness Layer: browser-only. A resource with a
 * local `path` could not be opened at all — Electron's branch only
 * reported "isn't implemented yet".
 * Sprint 29B — Native Desktop Integration: local paths now open with the
 * OS's default application via `window.physicsOSDesktop.resource.open`
 * (see electron/services/resourceService.cjs), covering every kind the
 * PRD calls out (Books, Notes, Formula Sheets, Memory Sheets, Videos,
 * Research Papers, PYQs) and every format (PDF, images, video, markdown,
 * text, common documents) uniformly — `shell.openPath` dispatches by file
 * association, not resource type.
 *
 * Path/URL never comes from a hardcoded location; it's always resolved
 * through `PathResolverService` from the resource's own metadata.
 */

/**
 * Attempts to open a resource-shaped object. `descriptor` should carry at
 * least `{ id, title, type }` plus whatever path/url fields the calling
 * module already uses (`path`, `localPath`, `fullPath`, `url`).
 */
function open(descriptor = {}) {
  const { type, id, title, subjectName } = descriptor
  const { path, url } = PathResolverService.resolveResourceLocation(descriptor)
  const displayTitle = title ?? 'this resource'

  if (url) {
    WindowService.openExternal(url)
    recordRecent(type, { id, title, subjectName, path, url })
    return { opened: true, mode: 'url' }
  }

  if (path) {
    if (EnvironmentService.isElectron()) {
      openNative(path, displayTitle)
      recordRecent(type, { id, title, subjectName, path, url })
      return { opened: true, mode: 'native' }
    }

    NotificationService.info(
      `Opening local files isn't supported in Browser mode yet. Once Physics OS runs as a desktop app, "${displayTitle}" will open directly.`,
    )
    recordRecent(type, { id, title, subjectName, path, url })
    return { opened: false, mode: 'unsupported-browser' }
  }

  NotificationService.warning(`No path or link is set yet for "${displayTitle}".`)
  return { opened: false, mode: 'missing-metadata' }
}

/**
 * Fires the native open asynchronously — callers of `open()` need a
 * synchronous return value (matching the browser-mode behavior above), so
 * failures surface as a notification rather than a rejected Promise the
 * caller would have to await.
 */
function openNative(path, displayTitle) {
  window.physicsOSDesktop.resource
    .open(path)
    .catch((error) => {
      NotificationService.error(
        `Could not open "${displayTitle}": ${error?.message ?? 'the file may have moved.'}`,
      )
    })
}

/** Reveals a resource's local path in the OS file manager — used when opening fails (e.g. the file moved). */
function revealInFileManager(descriptor = {}) {
  const { path } = PathResolverService.resolveResourceLocation(descriptor)
  if (!path) return { revealed: false, reason: 'missing-path' }
  if (!EnvironmentService.isElectron()) {
    NotificationService.info('Revealing files in your file manager requires the desktop build of Physics OS.')
    return { revealed: false, reason: 'unsupported-browser' }
  }
  window.physicsOSDesktop.resource.reveal(path).catch(() => {
    NotificationService.error('Could not reveal that file — it may have been moved or deleted.')
  })
  return { revealed: true, reason: null }
}

function recordRecent(type, item) {
  if (!item?.id) return
  try {
    RecentFilesService.pushResource(type, item)
  } catch {
    // Recording recent items is a nice-to-have — never let it block opening.
  }
}

function openBook(book) {
  return open({ ...book, type: LAUNCHABLE_RESOURCE_TYPES.BOOK })
}

function openNote(note) {
  return open({ ...note, type: LAUNCHABLE_RESOURCE_TYPES.NOTE })
}

function openFormulaSheet(sheet) {
  return open({ ...sheet, type: LAUNCHABLE_RESOURCE_TYPES.FORMULA_SHEET })
}

function openMemorySheet(sheet) {
  return open({ ...sheet, type: LAUNCHABLE_RESOURCE_TYPES.MEMORY_SHEET })
}

function openVideo(video) {
  return open({ ...video, type: LAUNCHABLE_RESOURCE_TYPES.VIDEO })
}

function openResearchPaper(paper) {
  return open({ ...paper, type: LAUNCHABLE_RESOURCE_TYPES.RESEARCH_PAPER })
}

/** PYQ papers carry their local path as `fullPath` (see engine/pyq). */
function openPyqPaper(paper) {
  return open({ ...paper, path: paper?.fullPath, type: LAUNCHABLE_RESOURCE_TYPES.PYQ })
}

/** Library/Master Index resources already carry a `categoryKey` that doubles as the launch type. */
function openLibraryResource(resource) {
  return open({ ...resource, type: resource?.categoryKey ?? LAUNCHABLE_RESOURCE_TYPES.NOTE })
}

export const ResourceLauncherService = {
  LAUNCHABLE_RESOURCE_TYPES,
  open,
  revealInFileManager,
  openBook,
  openNote,
  openFormulaSheet,
  openMemorySheet,
  openVideo,
  openResearchPaper,
  openPyqPaper,
  openLibraryResource,
}

export default ResourceLauncherService
