import { ENVIRONMENT } from '../constants/desktopConstants'

/**
 * ENVIRONMENT SERVICE
 * ===================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Answers one question for the rest of the app: "what runtime is Physics
 * OS in right now?" — Browser, Electron, or Unknown.
 *
 * There is NO Electron integration in this sprint (see Claude_Rules /
 * Sprint 28's DO NOT IMPLEMENT list) — this only recognizes the bridge a
 * future Electron preload script would expose on `window`. Every check
 * degrades to `ENVIRONMENT.BROWSER` today, and Sprint 29 (Electron
 * Integration) only has to make that global exist — nothing here should
 * need to change.
 */

/**
 * Detects the current runtime. Never throws — falls back to UNKNOWN if
 * `window` itself isn't available (e.g. server-side rendering, tests).
 */
function detect() {
  if (typeof window === 'undefined') return ENVIRONMENT.UNKNOWN

  // Placeholder bridge name for a future Electron preload script. No such
  // bridge exists yet in this sprint — this line is what Sprint 29 needs
  // to satisfy, not touch.
  if (typeof window.physicsOSDesktop !== 'undefined') return ENVIRONMENT.ELECTRON

  if (typeof document !== 'undefined') return ENVIRONMENT.BROWSER

  return ENVIRONMENT.UNKNOWN
}

function isBrowser() {
  return detect() === ENVIRONMENT.BROWSER
}

function isElectron() {
  return detect() === ENVIRONMENT.ELECTRON
}

function isUnknown() {
  return detect() === ENVIRONMENT.UNKNOWN
}

/**
 * Sprint 29A — Electron Foundation.
 *
 * Best-effort, synchronous "is this a development build?" read from the
 * flag `electron/preload/preload.cjs` sets on the bridge at boot. Always
 * false outside Electron. `getInfo()` below returns the IPC-verified,
 * authoritative version of this same flag for callers that can await it.
 */
function isDevelopment() {
  return isElectron() && window.physicsOSDesktop?.isDev === true
}

function isProduction() {
  return isElectron() && !isDevelopment()
}

/**
 * Synchronous snapshot of whatever the preload bridge exposed at boot —
 * safe to call in Browser mode (returns nulls) or before the async,
 * IPC-verified `getInfo()` below resolves.
 */
function getBridgeInfo() {
  if (!isElectron()) return null
  const bridge = window.physicsOSDesktop
  return {
    isDev: bridge?.isDev ?? null,
    platform: bridge?.platform ?? null,
    versions: bridge?.versions ?? null,
  }
}

/**
 * Authoritative environment info, verified via IPC against the main
 * process rather than trusted from the preload snapshot alone. Rejects
 * (resolves to null) outside Electron.
 */
async function getInfo() {
  if (!isElectron()) return null
  try {
    return await window.physicsOSDesktop.environmentInfo()
  } catch {
    return null
  }
}

export const EnvironmentService = {
  ENVIRONMENT,
  detect,
  isBrowser,
  isElectron,
  isUnknown,
  isDevelopment,
  isProduction,
  getBridgeInfo,
  getInfo,
}

export default EnvironmentService
