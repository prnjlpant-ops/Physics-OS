import { createHashRouter, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import HomePage from '../pages/HomePage'
import CalendarPage from '../pages/CalendarPage'
import TodaysMissionPage from '../pages/TodaysMissionPage'
import SubjectsPage from '../pages/SubjectsPage'
import SyllabusLayout from '../pages/syllabus/SyllabusLayout'
import SyllabusExplorerPage from '../pages/syllabus/SyllabusExplorerPage'
import SyllabusProgressPage from '../pages/syllabus/SyllabusProgressPage'
import SyllabusRoadmapPage from '../pages/syllabus/SyllabusRoadmapPage'
import SubjectLayout from '../pages/subject/SubjectLayout'
import SubjectOverviewPage from '../pages/subject/SubjectOverviewPage'
import SubjectChaptersPage from '../pages/subject/SubjectChaptersPage'
import SubjectBooksPage from '../pages/subject/SubjectBooksPage'
import SubjectVideosPage from '../pages/subject/SubjectVideosPage'
import SubjectProgressPage from '../pages/subject/SubjectProgressPage'
import SubjectResourcesPage from '../pages/subject/SubjectResourcesPage'
import SubjectKnowledgeBasePage from '../pages/subject/SubjectKnowledgeBasePage'
import SubjectActiveRecallPage from '../pages/subject/SubjectActiveRecallPage'
import ChapterResourceLayout from '../pages/subject/chapter/ChapterResourceLayout'
import ChapterResourceTypePage from '../pages/subject/chapter/ChapterResourceTypePage'
import ChapterNotesPage from '../pages/subject/chapter/ChapterNotesPage'
import NoteEditorPage from '../pages/subject/chapter/NoteEditorPage'
import ChapterPyqsPage from '../pages/subject/chapter/ChapterPyqsPage'
import PyqDetailPage from '../pages/subject/chapter/PyqDetailPage'
import ChapterMemorySheetPage from '../pages/subject/chapter/ChapterMemorySheetPage'
import ChapterMemoryRevisionPage from '../pages/subject/chapter/ChapterMemoryRevisionPage'
import ChapterFormulaSheetPage from '../pages/subject/chapter/ChapterFormulaSheetPage'
import ChapterActiveRecallPage from '../pages/subject/chapter/ChapterActiveRecallPage'
import ChapterActiveRecallStudyPage from '../pages/subject/chapter/ChapterActiveRecallStudyPage'
import ResourcesPage from '../pages/ResourcesPage'
import TopicIndexPage from '../pages/topics/TopicIndexPage'
import TopicDetailsPage from '../pages/topics/TopicDetailsPage'
import PyqsPage from '../pages/PyqsPage'
import PyqPracticePage from '../pages/PyqPracticePage'
import PyqQuestionPage from '../pages/PyqQuestionPage'
import PyqPaperDetailsPage from '../pages/PyqPaperDetailsPage'
import NotesPage from '../pages/NotesPage'
import FormulaSheetsPage from '../pages/FormulaSheetsPage'
import MemorySheetsPage from '../pages/MemorySheetsPage'
import ActiveRecallPage from '../pages/ActiveRecallPage'
import MockTestsLayout from '../pages/mockTests/MockTestsLayout'
import MockDashboardPage from '../pages/mockTests/MockDashboardPage'
import TestLibraryPage from '../pages/mockTests/TestLibraryPage'
import MockDetailsPage from '../pages/mockTests/MockDetailsPage'
import AttemptPage from '../pages/mockTests/AttemptPage'
import ResultPage from '../pages/mockTests/ResultPage'
import AnalysisPage from '../pages/mockTests/AnalysisPage'
import RevisionQueuePage from '../pages/mockTests/RevisionQueuePage'
import MockSettingsPage from '../pages/mockTests/MockSettingsPage'
import ErrorLearningLayout from '../pages/errorLearning/ErrorLearningLayout'
import ErrorDashboardPage from '../pages/errorLearning/ErrorDashboardPage'
import ErrorLibraryPage from '../pages/errorLearning/ErrorLibraryPage'
import WeakTopicsPage from '../pages/errorLearning/WeakTopicsPage'
import StatisticsPage from '../pages/errorLearning/StatisticsPage'
import ErrorRevisionQueuePage from '../pages/errorLearning/ErrorRevisionQueuePage'
import ErrorDetailsPage from '../pages/errorLearning/ErrorDetailsPage'
import StudyTimerPage from '../pages/StudyTimerPage'
import AnalyticsLayout from '../pages/analytics/AnalyticsLayout'
import AnalyticsDashboardPage from '../pages/analytics/AnalyticsDashboardPage'
import StudyAnalyticsPage from '../pages/analytics/StudyAnalyticsPage'
import SubjectAnalyticsPage from '../pages/analytics/SubjectAnalyticsPage'
import RevisionAnalyticsPage from '../pages/analytics/RevisionAnalyticsPage'
import MockAnalyticsPage from '../pages/analytics/MockAnalyticsPage'
import ErrorAnalyticsPage from '../pages/analytics/ErrorAnalyticsPage'
import ConsistencyPage from '../pages/analytics/ConsistencyPage'
import GoalsPage from '../pages/analytics/GoalsPage'
import SettingsPage from '../pages/SettingsPage'
import MasterIndexPage from '../pages/MasterIndexPage'
import LibraryPage from '../pages/library/LibraryPage'
import LibrarySettingsPage from '../pages/library/LibrarySettingsPage'
import ResourceDetailsPage from '../pages/library/ResourceDetailsPage'

const router = createHashRouter([
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
          { path: 'roadmap', element: <Navigate to="/subjects" replace /> },
          {
            path: ':subjectId',
            element: <SubjectLayout />,
            children: [
              { index: true, element: <SubjectOverviewPage /> },
              { path: 'chapters', element: <SubjectChaptersPage /> },
              { path: 'books', element: <SubjectBooksPage /> },
              { path: 'videos', element: <SubjectVideosPage /> },
              { path: 'progress', element: <SubjectProgressPage /> },
              { path: 'resources', element: <SubjectResourcesPage /> },
              { path: 'knowledge-base', element: <SubjectKnowledgeBasePage /> },
              { path: 'active-recall', element: <SubjectActiveRecallPage /> },
              {
                path: 'chapters/:chapterSlug',
                element: <ChapterResourceLayout />,
                children: [
                  { index: true, element: <ChapterResourceTypePage type="books" /> },
                  { path: 'books', element: <ChapterResourceTypePage type="books" /> },
                  { path: 'videos', element: <ChapterResourceTypePage type="videos" /> },
                  { path: 'pdfs', element: <ChapterResourceTypePage type="pdfs" /> },
                  { path: 'solution-manuals', element: <ChapterResourceTypePage type="solutionManuals" /> },
                  { path: 'reference-material', element: <ChapterResourceTypePage type="referenceMaterial" /> },
                  { path: 'external-links', element: <ChapterResourceTypePage type="externalLinks" /> },
                  { path: 'notes', element: <ChapterNotesPage /> },
                  { path: 'notes/:noteId', element: <NoteEditorPage /> },
                  { path: 'pyqs', element: <ChapterPyqsPage /> },
                  { path: 'pyqs/:pyqId', element: <PyqDetailPage /> },
                  { path: 'memory-sheet', element: <ChapterMemorySheetPage /> },
                  { path: 'memory-sheet/revise', element: <ChapterMemoryRevisionPage /> },
                  { path: 'formula-sheet', element: <ChapterFormulaSheetPage /> },
                  { path: 'active-recall', element: <ChapterActiveRecallPage /> },
                  { path: 'active-recall/study', element: <ChapterActiveRecallStudyPage /> },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'syllabus',
        element: <SyllabusLayout />,
        children: [
          { index: true, element: <SyllabusExplorerPage /> },
          { path: 'progress', element: <SyllabusProgressPage /> },
          { path: 'roadmap', element: <SyllabusRoadmapPage /> },
        ],
      },
      { path: 'resources', element: <ResourcesPage /> },
      {
        path: 'pyqs',
        children: [
          { index: true, element: <PyqsPage /> },
          { path: 'practice', element: <PyqPracticePage /> },
          { path: 'practice/:questionId', element: <PyqQuestionPage /> },
          { path: ':paperId', element: <PyqPaperDetailsPage /> },
        ],
      },
      { path: 'notes', element: <NotesPage /> },
      { path: 'formula-sheets', element: <FormulaSheetsPage /> },
      { path: 'memory-sheets', element: <MemorySheetsPage /> },
      { path: 'active-recall', element: <ActiveRecallPage /> },
      {
        path: 'mock-tests',
        element: <MockTestsLayout />,
        children: [
          { index: true, element: <MockDashboardPage /> },
          { path: 'library', element: <TestLibraryPage /> },
          { path: 'analysis', element: <AnalysisPage /> },
          { path: 'revision-queue', element: <RevisionQueuePage /> },
          { path: 'settings', element: <MockSettingsPage /> },
        ],
      },
      { path: 'mock-tests/:testId', element: <MockDetailsPage /> },
      { path: 'mock-tests/:testId/attempt', element: <AttemptPage /> },
      { path: 'mock-tests/:testId/result', element: <ResultPage /> },
      {
        path: 'error-learning',
        element: <ErrorLearningLayout />,
        children: [
          { index: true, element: <ErrorDashboardPage /> },
          { path: 'library', element: <ErrorLibraryPage /> },
          { path: 'weak-topics', element: <WeakTopicsPage /> },
          { path: 'statistics', element: <StatisticsPage /> },
          { path: 'revision-queue', element: <ErrorRevisionQueuePage /> },
        ],
      },
      { path: 'error-learning/:errorId', element: <ErrorDetailsPage /> },
      { path: 'study-timer', element: <StudyTimerPage /> },
      {
        path: 'analytics',
        element: <AnalyticsLayout />,
        children: [
          { index: true, element: <AnalyticsDashboardPage /> },
          { path: 'study', element: <StudyAnalyticsPage /> },
          { path: 'subjects', element: <SubjectAnalyticsPage /> },
          { path: 'revision', element: <RevisionAnalyticsPage /> },
          { path: 'mocks', element: <MockAnalyticsPage /> },
          { path: 'errors', element: <ErrorAnalyticsPage /> },
          { path: 'consistency', element: <ConsistencyPage /> },
          { path: 'goals', element: <GoalsPage /> },
        ],
      },
      { path: 'library', element: <LibraryPage /> },
      { path: 'library/settings', element: <LibrarySettingsPage /> },
      { path: 'library/resource/:resourceId', element: <ResourceDetailsPage /> },
      {
        path: 'topics',
        children: [
          { index: true, element: <TopicIndexPage /> },
          { path: ':topicId', element: <TopicDetailsPage /> },
        ],
      },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/master-index', element: <MasterIndexPage /> },
    ],
  },
])

export default router
