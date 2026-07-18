import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import HomePage from '../pages/HomePage'
import CalendarPage from '../pages/CalendarPage'
import TodaysMissionPage from '../pages/TodaysMissionPage'
import SubjectsPage from '../pages/SubjectsPage'
import SubjectLayout from '../pages/subject/SubjectLayout'
import SubjectOverviewPage from '../pages/subject/SubjectOverviewPage'
import SubjectChaptersPage from '../pages/subject/SubjectChaptersPage'
import SubjectResourcesPage from '../pages/subject/SubjectResourcesPage'
import ChapterResourceLayout from '../pages/subject/chapter/ChapterResourceLayout'
import ChapterResourceTypePage from '../pages/subject/chapter/ChapterResourceTypePage'
import SubjectBooksPage from '../pages/subject/SubjectBooksPage'
import SubjectVideosPage from '../pages/subject/SubjectVideosPage'
import SubjectPyqsPage from '../pages/subject/SubjectPyqsPage'
import SubjectFormulaSheetPage from '../pages/subject/SubjectFormulaSheetPage'
import ChapterFormulaSheetPage from '../pages/subject/chapter/ChapterFormulaSheetPage'
import SubjectMemorySheetPage from '../pages/subject/SubjectMemorySheetPage'
import ChapterMemorySheetPage from '../pages/subject/chapter/ChapterMemorySheetPage'
import ChapterMemoryRevisionPage from '../pages/subject/chapter/ChapterMemoryRevisionPage'
import SubjectNotesPage from '../pages/subject/SubjectNotesPage'
import ChapterNotesPage from '../pages/subject/chapter/ChapterNotesPage'
import NoteEditorPage from '../pages/subject/chapter/NoteEditorPage'
import SubjectProgressPage from '../pages/subject/SubjectProgressPage'
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
      {
        path: 'subjects',
        children: [
          { index: true, element: <SubjectsPage /> },
          {
            path: ':subjectId',
            element: <SubjectLayout />,
            children: [
              { index: true, element: <SubjectOverviewPage /> },
              { path: 'chapters', element: <SubjectChaptersPage /> },
              { path: 'resources', element: <SubjectResourcesPage /> },
              {
                path: 'chapters/:chapterSlug',
                element: <ChapterResourceLayout />,
                children: [
                  { index: true, element: <Navigate to="books" replace /> },
                  { path: 'books', element: <ChapterResourceTypePage type="books" /> },
                  { path: 'videos', element: <ChapterResourceTypePage type="videos" /> },
                  { path: 'pdfs', element: <ChapterResourceTypePage type="pdfs" /> },
                  {
                    path: 'solution-manuals',
                    element: <ChapterResourceTypePage type="solutionManuals" />,
                  },
                  {
                    path: 'reference-material',
                    element: <ChapterResourceTypePage type="referenceMaterial" />,
                  },
                  {
                    path: 'external-links',
                    element: <ChapterResourceTypePage type="externalLinks" />,
                  },
                ],
              },
              {
                path: 'chapters/:chapterSlug/formula-sheet',
                element: <ChapterFormulaSheetPage />,
              },
              {
                path: 'chapters/:chapterSlug/memory-sheet',
                element: <ChapterMemorySheetPage />,
              },
              {
                path: 'chapters/:chapterSlug/memory-sheet/revise',
                element: <ChapterMemoryRevisionPage />,
              },
              { path: 'books', element: <SubjectBooksPage /> },
              { path: 'videos', element: <SubjectVideosPage /> },
              { path: 'pyqs', element: <SubjectPyqsPage /> },
              { path: 'formula-sheet', element: <SubjectFormulaSheetPage /> },
              { path: 'memory-sheet', element: <SubjectMemorySheetPage /> },
              { path: 'notes', element: <SubjectNotesPage /> },
              {
                path: 'chapters/:chapterSlug/notes',
                element: <ChapterNotesPage />,
              },
              {
                path: 'chapters/:chapterSlug/notes/:noteId',
                element: <NoteEditorPage />,
              },
              { path: 'progress', element: <SubjectProgressPage /> },
            ],
          },
        ],
      },
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
