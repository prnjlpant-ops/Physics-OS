import WindowService from './WindowService'
import PathResolverService from './PathResolverService'
import NotificationService from './NotificationService'
import EnvironmentService from './EnvironmentService'
import RecentFilesService from './RecentFilesService'
import { LAUNCHABLE_RESOURCE_TYPES } from '../constants/desktopConstants'

/**
 * RESOURCE LAUNCHER SERVICE
 * =========================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Centralizes opening every resource kind the PRD calls out — Books,
 * Notes, Formula Sheets, Memory Sheets, Videos, Research Papers, PYQs —
 * so no page reaches for `window.open` or renders its own "no desktop
 * integration yet" message. Path/URL never comes from a hardcoded
 * location; it's always resolved through `PathResolverService` from the
 * resource's own metadata.
 *
 * Browser-safe behavior: a resource with a `url` opens in a new tab right
 * now. A resource with only a local `path` cannot be opened from the
 * browser (no native file access — see Sprint 28's DO NOT IMPLEMENT
 * list), so this degrades gracefully with a `NotificationService.info`
 * explaining that, instead of the "Open" button being disabled forever.
 * Sprint 29 (Electron Integration) only has to fill in the `isElectron()`
 * branch below with a real IPC file-open call.
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
      // Sprint 29 replaces this branch with a real native file-open call.
      NotificationService.info(`Opening "${displayTitle}" isn't implemented yet.`)
      return { opened: false, mode: 'electron-pending' }
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
