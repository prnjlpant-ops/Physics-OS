/**
 * PATHS
 * =====
 * Sprint 29A — Electron Foundation.
 *
 * Centralizes the two filesystem/URL locations the main process needs to
 * load the renderer from. Uses `path.join` throughout (never manual
 * string concatenation) so this works unmodified on Windows, macOS, and
 * Linux.
 */

const path = require('path')

/** Vite's dev server — matches the fixed port set in vite.config.js. */
const DEV_SERVER_URL = process.env.ELECTRON_DEV_SERVER_URL || 'http://localhost:5173'

/** Preload script, always loaded from disk regardless of dev/production. */
function getPreloadPath() {
  return path.join(__dirname, '..', 'preload', 'preload.cjs')
}

/** Built renderer entry point (`vite build` output), used in production only. */
function getProdIndexPath() {
  return path.join(__dirname, '..', '..', 'dist', 'index.html')
}

module.exports = { DEV_SERVER_URL, getPreloadPath, getProdIndexPath }
