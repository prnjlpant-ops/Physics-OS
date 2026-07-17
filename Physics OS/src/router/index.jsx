import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import HomePage from '../pages/HomePage'
import CalendarPage from '../pages/CalendarPage'
import TodaysMissionPage from '../pages/TodaysMissionPage'
import SubjectsPage from '../pages/SubjectsPage'
import ResourcesPage from '../pages/ResourcesPage'
import PyqsPage from '../pages/PyqsPage'
import NotesPage from '../pages/NotesPage'
import FormulaSheetsPage from '../pages/FormulaSheetsPage'
import MemorySheetsPage from '../pages/MemorySheetsPage'
import ActiveRecallPage from '../pages/ActiveRecallPage'
import MockTestsPage from '../pages/MockTestsPage'
import StudyTimerPage from '../pages/StudyTimerPage'
import AnalyticsPage from '../pages/AnalyticsPage'
import SettingsPage from '../pages/SettingsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'todays-mission', element: <TodaysMissionPage /> },
      { path: 'subjects', element: <SubjectsPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'pyqs', element: <PyqsPage /> },
      { path: 'notes', element: <NotesPage /> },
      { path: 'formula-sheets', element: <FormulaSheetsPage /> },
      { path: 'memory-sheets', element: <MemorySheetsPage /> },
      { path: 'active-recall', element: <ActiveRecallPage /> },
      { path: 'mock-tests', element: <MockTestsPage /> },
      { path: 'study-timer', element: <StudyTimerPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])

export default router
