/**
 * PLATFORM SERVICE (Electron / main process)
 * ============================================
 * Sprint 29A — Electron Foundation.
 *
 * Real OS detection via Node's `os.platform()`, mirroring the value shape
 * `src/services/PlatformService.js` already uses (`windows` / `mac` /
 * `linux` / `unknown`) so the renderer-side service can eventually prefer
 * this over its `navigator.userAgent` guess without changing its API.
 */

const os = require('os')

function detect() {
  const platform = os.platform()
  if (platform === 'win32') return 'windows'
  if (platform === 'darwin') return 'mac'
  if (platform === 'linux') return 'linux'
  return 'unknown'
}

module.exports = { detect }
