/**
 * RESOURCE SERVICE (Electron / main process)
 * =============================================
 * Sprint 29B — Native Desktop Integration.
 *
 * Opens a resource's local path with the OS's default application — the
 * native counterpart to `ResourceLauncherService.open()`'s "electron-pending"
 * branch from Sprint 28. Covers every kind the PRD lists (Books, Notes,
 * Formula Sheets, Memory Sheets, Videos, Research Papers, PYQs) uniformly,
 * since `shell.openPath` dispatches by file extension/OS association
 * rather than needing a per-type branch (PDF, images, video, markdown,
 * text, and any other common document format all "just work").
 */

const { shell } = require('electron')

/** Opens a path with the OS default handler. `shell.openPath` resolves to an error string on failure (never rejects), not an exception. */
async function open(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') {
    throw new Error('No path was given for this resource.')
  }
  const errorMessage = await shell.openPath(targetPath)
  if (errorMessage) {
    throw new Error(`Could not open "${targetPath}": ${errorMessage}`)
  }
  return true
}

/** Reveals a file in the OS file manager (Explorer/Finder/etc.) — used when a path is missing so the user can fix it. */
function reveal(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') {
    throw new Error('No path was given to reveal.')
  }
  shell.showItemInFolder(targetPath)
  return true
}

module.exports = { open, reveal }
