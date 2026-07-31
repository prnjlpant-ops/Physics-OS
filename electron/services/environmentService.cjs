/**
 * ENVIRONMENT SERVICE (Electron / main process)
 * ==============================================
 * Sprint 29A — Electron Foundation.
 *
 * The main-process counterpart to `src/services/EnvironmentService.js`.
 * The renderer-side service answers "what runtime am I in?" from a global
 * the preload script exposes; this module is where that answer actually
 * comes from — real `app`/`process` data instead of a browser guess.
 */

const { app } = require('electron')
const { isDev } = require('../utilities/isDev.cjs')

function getInfo() {
  return {
    environment: 'electron',
    isDev: isDev(),
    isPackaged: app.isPackaged,
    versions: {
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      app: app.getVersion(),
    },
  }
}

module.exports = { getInfo }
