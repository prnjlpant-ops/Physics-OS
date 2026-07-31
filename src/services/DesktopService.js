import EnvironmentService from './EnvironmentService'
import PlatformService from './PlatformService'

/**
 * DESKTOP SERVICE
 * ===============
 * Sprint 28 — Desktop Readiness Layer.
 *
 * The single top-level facade describing "what can Physics OS do on this
 * device right now?" — composed from EnvironmentService (runtime) and
 * PlatformService (OS). Pages/components should ask this service (or the
 * more specific one below it) rather than checking `window`/`navigator`
 * themselves.
 *
 * `capabilities()` is the contract Sprint 29 (Electron Integration) fills
 * in for real — every flag here is `false` today because no native
 * integration exists yet (see Sprint 28's DO NOT IMPLEMENT list). Nothing
 * that reads this object should need to change when that happens, only
 * this function's return values.
 */

function getEnvironment() {
  return EnvironmentService.detect()
}

function getPlatform() {
  return PlatformService.detect()
}

/**
 * True once a real Electron bridge exists and is ready. Sprint 29A makes
 * this possible via `preload.cjs`'s `ready: true` flag; it was always
 * false before this sprint because no bridge existed at all.
 */
function isElectronReady() {
  return EnvironmentService.isElectron() && Boolean(window.physicsOSDesktop?.ready)
}

/**
 * What Physics OS can currently do on this device. Every feature service
 * (ResourceLauncherService, FileSystemService, DialogService, ...) checks
 * these instead of re-deriving environment logic itself.
 *
 * Sprint 29B implements native file access, dialogs, and notifications for
 * real (see electron/services/*.cjs) — all report `true` once the Electron
 * bridge is ready. Auto-updates and cloud sync remain out of scope (see
 * Sprint 29B's DO NOT IMPLEMENT list — those belong to a future sprint).
 */
function capabilities() {
  const electronReady = isElectronReady()
  return {
    nativeFileAccess: electronReady,
    nativeDialogs: electronReady,
    nativeNotifications: electronReady,
    nativeClipboard: electronReady
      ? Boolean(window.physicsOSDesktop?.clipboard)
      : typeof navigator !== 'undefined' && Boolean(navigator.clipboard),
    autoUpdates: false,
    cloudSync: false,
  }
}

export const DesktopService = {
  getEnvironment,
  getPlatform,
  isElectronReady,
  capabilities,
}

export default DesktopService
