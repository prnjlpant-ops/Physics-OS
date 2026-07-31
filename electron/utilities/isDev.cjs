/**
 * IS DEV
 * ======
 * Sprint 29A — Electron Foundation.
 *
 * An explicit `NODE_ENV` wins when set (`electron:wait` sets
 * "development", `electron:start` sets "production") — this is what lets
 * `npm run electron:start` preview production behavior (loading
 * `dist/index.html`) against an unpackaged `electron .` launch, since
 * Sprint 29A doesn't implement packaging yet (no `app.isPackaged: true`
 * build exists to test against otherwise). Without an explicit `NODE_ENV`,
 * `app.isPackaged` is the fallback signal — the correct one once a real
 * packaged build exists.
 */

const { app } = require('electron')

function isDev() {
  if (process.env.NODE_ENV === 'production') return false
  if (process.env.NODE_ENV === 'development') return true
  return !app.isPackaged
}

module.exports = { isDev }
