import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import DialogService from '../../services/DialogService'

/**
 * DIALOG HOST
 * ===========
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Renders whatever DialogService.confirm(...)/confirmDelete(...)/etc.
 * requests, using the existing `ui/Modal` primitive. Mounted once in
 * AppLayout. Only one dialog can be open at a time (matches how the app
 * is used — no nested confirmation flows today).
 */
export default function DialogHost() {
  const [request, setRequest] = useState(null)

  useEffect(() => DialogService.subscribe(setRequest), [])

  if (!request) return null

  const respond = (result) => {
    DialogService.resolve(request.id, result)
    setRequest(null)
  }

  return (
    <Modal open onClose={() => respond(false)} title={request.title} description={request.message}>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => respond(false)}
          className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          {request.cancelLabel ?? 'Cancel'}
        </button>
        <button
          type="button"
          onClick={() => respond(true)}
          className={
            request.danger
              ? 'rounded-md bg-[#a13a3a] px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#b84545]'
              : 'rounded-md bg-[#0e639c] px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#1177bb]'
          }
        >
          {request.confirmLabel ?? 'Confirm'}
        </button>
      </div>
    </Modal>
  )
}
