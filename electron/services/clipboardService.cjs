/**
 * CLIPBOARD SERVICE (Electron / main process)
 * ==============================================
 * Sprint 29A — Electron Foundation.
 *
 * Unlike Dialog/Notification, native clipboard access needs no design
 * work or new UI — Electron's `clipboard` module already does exactly
 * what the renderer's `ClipboardService.copy()` needs. Implemented for
 * real rather than stubbed.
 */

const { clipboard } = require('electron')

function readText() {
  return clipboard.readText()
}

function writeText(text) {
  clipboard.writeText(typeof text === 'string' ? text : '')
  return true
}

module.exports = { readText, writeText }
