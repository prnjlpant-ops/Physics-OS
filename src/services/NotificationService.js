import { NOTIFICATION_TYPES } from '../constants/desktopConstants'

/**
 * NOTIFICATION SERVICE
 * ====================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * A tiny pub-sub so any service or component can raise a Success/Warning/
 * Error/Info notification without importing a UI component — the actual
 * rendering lives in `components/notifications/NotificationHost.jsx`,
 * mounted once in `AppLayout`. This is the Browser implementation; a
 * future Electron build can replace it with native OS notifications
 * without touching any of the ~dozen call sites that will use this
 * service (ResourceLauncherService, ImportService, ExportService, ...).
 */

let listeners = new Set()

function subscribe(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function emit(notification) {
  listeners.forEach((callback) => callback(notification))
}

function notify(type, message, options = {}) {
  const notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    message,
    duration: options.duration ?? 4000,
  }
  emit(notification)
  return notification.id
}

function success(message, options) {
  return notify(NOTIFICATION_TYPES.SUCCESS, message, options)
}

function warning(message, options) {
  return notify(NOTIFICATION_TYPES.WARNING, message, options)
}

function error(message, options) {
  return notify(NOTIFICATION_TYPES.ERROR, message, options)
}

function info(message, options) {
  return notify(NOTIFICATION_TYPES.INFO, message, options)
}

export const NotificationService = {
  NOTIFICATION_TYPES,
  subscribe,
  notify,
  success,
  warning,
  error,
  info,
}

export default NotificationService
