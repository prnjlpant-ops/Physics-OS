import { navigationItems } from '../constants/navigation'

/**
 * NAVIGATION SERVICE
 * ==================
 * Sprint 0 — Foundation.
 *
 * Centralizes route path construction that today is scattered across
 * components as inline template strings (e.g. `/subjects/${subjectId}`).
 * This sprint does not migrate every existing `<Link>`/`navigate()` call —
 * that touches a very large number of files for a foundation sprint and
 * risks breaking working navigation. Instead this gives future modules one
 * place to build a path correctly, and existing call sites can be migrated
 * incrementally.
 *
 * Route shapes here must stay in sync with `src/router/index.jsx`.
 */

const routes = {
  home: () => '/',
  calendar: () => '/calendar',
  todaysMission: () => '/todays-mission',

  subjects: () => '/subjects',
  subject: (subjectId) => `/subjects/${subjectId}`,
  subjectChapters: (subjectId) => `/subjects/${subjectId}/chapters`,
  subjectResources: (subjectId) => `/subjects/${subjectId}/resources`,
  subjectKnowledgeBase: (subjectId) => `/subjects/${subjectId}/knowledge-base`,
  subjectProgress: (subjectId) => `/subjects/${subjectId}/progress`,

  chapterResourceType: (subjectId, chapterSlug, type) =>
    `/subjects/${subjectId}/chapters/${chapterSlug}/${type}`,
  chapterActiveRecall: (subjectId, chapterSlug) =>
    `/subjects/${subjectId}/chapters/${chapterSlug}/active-recall`,
  chapterActiveRecallStudy: (subjectId, chapterSlug) =>
    `/subjects/${subjectId}/chapters/${chapterSlug}/active-recall/study`,

  syllabus: () => '/syllabus',
  syllabusProgress: () => '/syllabus/progress',
  syllabusRoadmap: () => '/syllabus/roadmap',

  mockTest: (testId) => `/mock-tests/${testId}`,
  mockTestAttempt: (testId) => `/mock-tests/${testId}/attempt`,
  mockTestResult: (testId) => `/mock-tests/${testId}/result`,

  errorDetails: (errorId) => `/error-learning/${errorId}`,

  settingsMasterIndex: () => '/settings/master-index',
}

/** The sidebar's flat navigation list — passthrough so consumers only need one import. */
function getPrimaryNavigation() {
  return navigationItems
}

export const NavigationService = {
  routes,
  getPrimaryNavigation,
}

export default NavigationService
