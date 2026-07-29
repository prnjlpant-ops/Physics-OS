import { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import NotificationService from '../../services/NotificationService'

/**
 * NOTIFICATION HOST
 * =================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Renders whatever NotificationService.notify(...) emits, as a small
 * bottom-right toast stack. Mounted once in AppLayout — no other
 * component should render this. Purely a subscriber; all notification
 * logic lives in the service.
 */

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

const STYLES = {
  success: 'border-[#3c7a3c] bg-[#1e2e1e] text-[#b8e6b8]',
  warning: 'border-[#8a6d1f] bg-[#2e2917] text-[#e6cf8a]',
  error: 'border-[#8a2f2f] bg-[#2e1a1a] text-[#e6a3a3]',
  info: 'border-[#3c3c3c] bg-[#252526] text-[#cccccc]',
}

export default function NotificationHost() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    return NotificationService.subscribe((notification) => {
      setToasts((prev) => [...prev, notification])
      if (notification.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== notification.id))
        }, notification.duration)
      }
    })
  }, [])

  const dismiss = (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id))

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] ?? Info
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2 rounded-md border px-3 py-2.5 text-xs shadow-lg ${STYLES[toast.type] ?? STYLES.info}`}
          >
            <Icon size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            <p className="flex-1 leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="shrink-0 opacity-60 transition-opacity duration-150 hover:opacity-100"
            >
              <X size={13} strokeWidth={1.75} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
