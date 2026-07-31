/**
 * Every exported function in this module currently returns empty state
 * values pending real mock test data. The public API shape is preserved
 * so the UI and analytics consumers continue to work without fake progress
 * or fabricated scores.
 */

export function getAllMockTests() {
  return []
}

export function getMockTestById() {
  return null
}

export function getMockCounts() {
  return {
    total: 0,
    fullLength: 0,
    subjectTests: 0,
    chapterTests: 0,
    pyqPapers: 0,
  }
}

export function getQuickStatistics() {
  return { averageScore: 0, bestScore: 0, accuracy: 0, totalTests: 0, hoursPracticed: 0 }
}

export function getRecentAttempts() {
  return []
}

export function getUpcomingMock() {
  return null
}

export function generateQuestionsForTest() {
  return []
}

export function generateMockResult(test) {
  return {
    score: 0,
    totalMarks: test?.marks ?? 0,
    percentage: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    accuracy: 0,
    timeTakenMinutes: 0,
    totalDurationMinutes: test?.duration ?? 0,
    rank: 0,
    totalCandidates: 0,
  }
}

export function generateAnalysisData() {
  return {
    subjectWise: [],
    chapterWise: [],
    difficultyWise: [],
    timeAnalysis: [],
    weakAreas: [],
    strongAreas: [],
    mistakeDistribution: [],
  }
}

export function generateRevisionQueueSeed() {
  return []
}

export { EXAMS } from '../constants/mockTestConstants'
