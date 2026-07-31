/**
 * IPC TYPES
 * =========
 * Sprint 29A — Electron Foundation.
 *
 * Every IPC handler responds with the same envelope shape so the preload
 * bridge has exactly one place to unwrap a response and turn a failure into
 * a normal rejected Promise — callers on the renderer side never have to
 * think about IPC at all, they just `await window.physicsOSDesktop.x()`.
 *
 * @typedef {Object} IpcSuccess
 * @property {true} success
 * @property {*} data
 *
 * @typedef {Object} IpcFailure
 * @property {false} success
 * @property {string} error
 *
 * @typedef {IpcSuccess | IpcFailure} IpcResponse
 */

/** @param {*} data @returns {IpcSuccess} */
function ok(data) {
  return { success: true, data }
}

/** @param {unknown} error @returns {IpcFailure} */
function fail(error) {
  return {
    success: false,
    error: error instanceof Error ? error.message : String(error ?? 'Unknown IPC error.'),
  }
}

module.exports = { ok, fail }
