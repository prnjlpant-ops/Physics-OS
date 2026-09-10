import test from 'node:test'
import assert from 'node:assert/strict'

const store = new Map()
const fakeStorage = {
  getItem(key) {
    return store.has(key) ? store.get(key) : null
  },
  setItem(key, value) {
    store.set(key, String(value))
  },
  removeItem(key) {
    store.delete(key)
  },
}

globalThis.localStorage = fakeStorage

test('chapter tracker saves and resets chapter-only sessions', async () => {
  const { saveStudySession, getAllStudySessions, getChapterStudySessions, resetChapterStudySessions } = await import('./studySessionsStorage.js')

  const now = Date.now()

  saveStudySession({
    id: 'session_1',
    subject: 'Mathematical Methods',
    chapter: 'Vector Calculus & Linear Algebra',
    startTime: now,
    endTime: now + 3600000,
    duration: 3600000,
    totalStudyTime: 3600000,
    notes: 'Worked through gradient and divergence problems',
  })

  saveStudySession({
    id: 'session_2',
    subject: 'Electromagnetism',
    chapter: 'Maxwell Equations',
    startTime: now + 7200000,
    endTime: now + 10800000,
    duration: 3600000,
    totalStudyTime: 3600000,
    notes: 'Reviewed wave propagation',
  })

  const chapterSessions = getChapterStudySessions('Mathematical Methods', 'Vector Calculus & Linear Algebra')
  assert.equal(chapterSessions.length, 1)
  assert.equal(chapterSessions[0].id, 'session_1')
  assert.equal(getAllStudySessions().length, 2)

  resetChapterStudySessions('Mathematical Methods', 'Vector Calculus & Linear Algebra')
  assert.equal(getChapterStudySessions('Mathematical Methods', 'Vector Calculus & Linear Algebra').length, 0)
  assert.equal(getAllStudySessions().length, 1)
})

test('v61 chapter filter excludes broader sibling chapters like partial differential equations', async () => {
  const { getV61RecordsForChapter } = await import('../data/v61Tracker.js')

  const rows = getV61RecordsForChapter('Mathematical Methods', 'Differential Equations & Special Functions')
  const chapterNames = [...new Set(rows.map((row) => row.chapter))]

  assert.ok(rows.length > 0)
  assert.ok(chapterNames.includes('Differential Equations'))
  assert.ok(!chapterNames.includes('Partial Differential Equations'))
})

test('v61 chapter aliases cover the mismatched mathematical methods chapters', async () => {
  const { getV61RecordsForChapter } = await import('../data/v61Tracker.js')

  const complexRows = getV61RecordsForChapter('Mathematical Methods', 'Complex Analysis & Residue Theorem')
  const fourierRows = getV61RecordsForChapter('Mathematical Methods', 'Fourier & Laplace Transforms')
  const tensorRows = getV61RecordsForChapter('Mathematical Methods', 'Tensor & Curvilinear Coordinates')
  const probabilityRows = getV61RecordsForChapter('Mathematical Methods', 'Probability & Error Analysis')
  const specialRelativityRows = getV61RecordsForChapter('Classical Mechanics', 'Special Relativity')
  const emRows = getV61RecordsForChapter('Electromagnetism', 'Electromagnetic Theory')

  assert.ok(complexRows.length > 0)
  assert.ok(fourierRows.length > 0)
  assert.ok(tensorRows.length > 0)
  assert.ok(probabilityRows.length > 0)
  assert.ok(specialRelativityRows.length > 0)
  assert.ok(emRows.length > 0)
})
