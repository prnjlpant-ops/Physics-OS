import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import useDesktopMenu from '../hooks/useDesktopMenu'
import { StudyTimerProvider } from '../context/StudyTimerContext'
import { MasterIndexProvider } from '../context/MasterIndexProvider'
import EndSessionModal from '../components/timer/EndSessionModal'
import NotificationHost from '../components/notifications/NotificationHost'
import DialogHost from '../components/dialogs/DialogHost'

export default function AppLayout() {
  useDesktopMenu()

  return (
    <MasterIndexProvider>
      <StudyTimerProvider>
        <div className="flex h-dvh overflow-hidden bg-[#1e1e1e]">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <EndSessionModal />
        {/* Sprint 28 — Desktop Readiness Layer: single mount points for the
            NotificationService/DialogService pub-subs. */}
        <NotificationHost />
        <DialogHost />
      </StudyTimerProvider>
    </MasterIndexProvider>
  )
}
