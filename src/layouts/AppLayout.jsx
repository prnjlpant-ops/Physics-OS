import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { StudyTimerProvider } from '../context/StudyTimerContext'
import EndSessionModal from '../components/timer/EndSessionModal'

export default function AppLayout() {
  return (
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
    </StudyTimerProvider>
  )
}
