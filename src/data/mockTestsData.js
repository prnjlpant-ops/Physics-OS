import { subjects } from '../constants/subjects'
import { EXAMS, TEST_TYPES, DIFFICULTY_LEVELS, TEST_STATUS } from '../constants/mockTestConstants'
import { hashString, seededInt } from '../utils/seededRandom'

/**
 * Every test/attempt/analysis figure below is placeholder data generated
 * from the existing subjects/chapters constant. Nothing here is fetched,
 * persisted server-side, or evaluated — it exists purely so the Mock Test
 * System UI has something JSON-shaped to render. A future `mocks.json`
 * (or one file per test) can replace `RAW_TESTS` without touching any
 * page or component, since every consumer goes through the functions
 * below rather than the array itself.
 */

const DIFFICULTY_CYCLE = DIFFICULTY_LEVELS
const STATUS_CYCLE = [TEST_STATUS.COMPLETED, TEST_STATUS.IN_PROGRESS, TEST_STATUS.NOT_ATTEMPTED]

function buildDescription(title, exam) {
  return `A ${exam}-pattern mock assembled to mirror the difficulty and weightage of the actual exam. Attempt it under timed conditions for the most realistic practice.`
}

function buildInstructions() {
  return [
    'Each question carries equal marks unless stated otherwise.',
    'There is negative marking for incorrect responses.',
    'The test will auto-submit when the timer reaches zero.',
    'You can mark a question for review and return to it later.',
    'Ensure a stable environment before starting the timer.',
  ]
}

function makeTest({
  id,
  title,
  exam,
  type,
  subject,
  chapter,
  questions,
  marksPerQuestion = 4,
  duration,
  index,
}) {
  const seed = hashString(id)
  const difficulty = DIFFICULTY_CYCLE[index % DIFFICULTY_CYCLE.length]
  const status = STATUS_CYCLE[index % STATUS_CYCLE.length]
  const marks = questions * marksPerQuestion

  const lastAttempt =
    status === TEST_STATUS.NOT_ATTEMPTED
      ? null
      : {
          date: new Date(Date.now() - seededInt(seed, 1, 45, 1) * 86400000).toISOString(),
          score: seededInt(seed, Math.round(marks * 0.3), Math.round(marks * 0.9), 2),
          percentage: seededInt(seed, 35, 92, 3),
        }

  return {
    id,
    title,
    exam,
    type,
    subjectId: subject?.id ?? null,
    subjectName: subject?.name ?? null,
    chapterSlug: chapter?.slug ?? null,
    chapterName: chapter?.name ?? null,
    questions,
    marks,
    marksPerQuestion,
    duration,
    difficulty,
    status,
    description: buildDescription(title, exam),
    syllabus: chapter
      ? [chapter.name]
      : subject
        ? subject.chapters.slice(0, 6).map((c) => c.name)
        : subjects.slice(0, 4).flatMap((s) => s.chapters.slice(0, 2).map((c) => c.name)),
    instructions: buildInstructions(),
    lastAttempt,
  }
}

function buildFullLengthTests() {
  return EXAMS.map((exam, index) =>
    makeTest({
      id: `FLT-${index + 1}`,
      title: `${exam} Physics Full Mock ${index + 1}`,
      exam,
      type: TEST_TYPES.FULL_LENGTH,
      questions: exam === 'GATE' ? 65 : 60,
      marksPerQuestion: exam === 'GATE' ? 1 : 3,
      duration: exam === 'TIFR' ? 150 : 180,
      index,
    }),
  )
}

function buildSubjectTests() {
  return subjects.map((subject, index) => {
    const exam = EXAMS[index % EXAMS.length]
    return makeTest({
      id: `SUB-${subject.id}`,
      title: `${subject.name} — Subject Test`,
      exam,
      type: TEST_TYPES.SUBJECT,
      subject,
      questions: 25,
      marksPerQuestion: 3,
      duration: 60,
      index,
    })
  })
}

function buildChapterTests() {
  const tests = []
  subjects.forEach((subject, sIndex) => {
    subject.chapters.slice(0, 2).forEach((chapter, cIndex) => {
      const exam = EXAMS[(sIndex + cIndex) % EXAMS.length]
      tests.push(
        makeTest({
          id: `CHP-${subject.id}-${chapter.slug}`,
          title: `${chapter.name} — Chapter Test`,
          exam,
          type: TEST_TYPES.CHAPTER,
          subject,
          chapter,
          questions: 15,
          marksPerQuestion: 2,
          duration: 30,
          index: sIndex + cIndex,
        }),
      )
    })
  })
  return tests
}

function buildPyqPapers() {
  const years = [2024, 2023, 2022, 2021]
  const tests = []
  EXAMS.forEach((exam, eIndex) => {
    years.slice(0, 2).forEach((year, yIndex) => {
      tests.push(
        makeTest({
          id: `PYQ-${exam.replace(/\s+/g, '')}-${year}`,
          title: `${exam} ${year} — Previous Year Paper`,
          exam,
          type: TEST_TYPES.PYQ,
          questions: exam === 'GATE' ? 65 : 50,
          marksPerQuestion: exam === 'GATE' ? 1 : 3,
          duration: exam === 'TIFR' ? 150 : 180,
          index: eIndex + yIndex,
        }),
      )
    })
  })
  return tests
}

const ALL_TESTS = [
  ...buildFullLengthTests(),
  ...buildSubjectTests(),
  ...buildChapterTests(),
  ...buildPyqPapers(),
]

export function getAllMockTests() {
  return ALL_TESTS
}

export function getMockTestById(id) {
  return ALL_TESTS.find((test) => test.id === id) ?? null
}

export function getMockCounts() {
  return {
    total: ALL_TESTS.length,
    fullLength: ALL_TESTS.filter((t) => t.type === TEST_TYPES.FULL_LENGTH).length,
    subjectTests: ALL_TESTS.filter((t) => t.type === TEST_TYPES.SUBJECT).length,
    chapterTests: ALL_TESTS.filter((t) => t.type === TEST_TYPES.CHAPTER).length,
    pyqPapers: ALL_TESTS.filter((t) => t.type === TEST_TYPES.PYQ).length,
  }
}

function attemptedTests() {
  return ALL_TESTS.filter((t) => t.status !== TEST_STATUS.NOT_ATTEMPTED && t.lastAttempt)
}

export function getQuickStatistics() {
  const attempted = attemptedTests()
  if (attempted.length === 0) {
    return { averageScore: 0, bestScore: 0, accuracy: 0, totalTests: 0, hoursPracticed: 0 }
  }
  const percentages = attempted.map((t) => t.lastAttempt.percentage)
  const averageScore = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)
  const bestScore = Math.max(...percentages)
  const accuracy = Math.round(
    attempted.reduce((sum, t) => sum + seededInt(hashString(t.id), 55, 95, 9), 0) / attempted.length,
  )
  const hoursPracticed = Math.round(
    attempted.reduce((sum, t) => sum + t.duration / 60, 0) * 10,
  ) / 10

  return {
    averageScore,
    bestScore,
    accuracy,
    totalTests: attempted.length,
    hoursPracticed,
  }
}

export function getRecentAttempts(limit = 5) {
  return [...attemptedTests()]
    .sort((a, b) => new Date(b.lastAttempt.date) - new Date(a.lastAttempt.date))
    .slice(0, limit)
}

export function getUpcomingMock() {
  const candidate = ALL_TESTS.find(
    (t) => t.status === TEST_STATUS.NOT_ATTEMPTED && t.type === TEST_TYPES.FULL_LENGTH,
  )
  return candidate ?? ALL_TESTS.find((t) => t.status === TEST_STATUS.NOT_ATTEMPTED) ?? null
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export function generateQuestionsForTest(test) {
  const seed = hashString(test.id)
  return Array.from({ length: test.questions }, (_, i) => {
    const qSeed = seed + i * 31
    const chapterPool = test.subjectId
      ? subjects.find((s) => s.id === test.subjectId)?.chapters ?? []
      : subjects.flatMap((s) => s.chapters)
    const chapter = test.chapterName
      ? { name: test.chapterName }
      : chapterPool[seededInt(qSeed, 0, Math.max(chapterPool.length - 1, 0), 5)] ?? { name: test.exam }

    return {
      id: `${test.id}-Q${i + 1}`,
      number: i + 1,
      subjectName: test.subjectName ?? subjects[seededInt(qSeed, 0, subjects.length - 1, 2)].name,
      chapterName: chapter.name,
      difficulty: DIFFICULTY_CYCLE[seededInt(qSeed, 0, 2, 3)],
      marks: test.marksPerQuestion,
      prompt: `Placeholder question ${i + 1} of ${test.questions} for ${test.title}. Actual question content will be loaded from a JSON question bank.`,
      options: OPTION_LABELS.map((label) => `Option ${label} — placeholder choice`),
    }
  })
}

export function generateMockResult(test) {
  const seed = hashString(test.id)
  const totalQuestions = test.questions
  const correct = seededInt(seed, Math.round(totalQuestions * 0.35), Math.round(totalQuestions * 0.8), 11)
  const skipped = seededInt(seed, 0, Math.round((totalQuestions - correct) * 0.6), 13)
  const incorrect = Math.max(totalQuestions - correct - skipped, 0)
  const score = correct * test.marksPerQuestion - Math.round(incorrect * test.marksPerQuestion * 0.25)
  const percentage = Math.max(0, Math.round((score / test.marks) * 100))
  const attempted = correct + incorrect
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
  const timeTakenMinutes = seededInt(seed, Math.round(test.duration * 0.55), test.duration, 17)
  const totalCandidates = seededInt(seed, 4200, 18500, 19)
  const rank = seededInt(seed, 1, Math.round(totalCandidates * 0.4), 23)

  return {
    score: Math.max(score, 0),
    totalMarks: test.marks,
    percentage,
    correct,
    incorrect,
    skipped,
    accuracy,
    timeTakenMinutes,
    totalDurationMinutes: test.duration,
    rank,
    totalCandidates,
  }
}

export function generateAnalysisData() {
  const subjectWise = subjects.map((subject) => {
    const seed = hashString(`analysis-${subject.id}`)
    return {
      id: subject.id,
      name: subject.name,
      accuracy: seededInt(seed, 45, 92, 1),
      attempted: seededInt(seed, 20, 140, 2),
      avgTimePerQuestion: seededInt(seed, 45, 140, 3),
    }
  })

  const chapterWise = subjects
    .flatMap((subject) =>
      subject.chapters.slice(0, 2).map((chapter) => {
        const seed = hashString(`analysis-${subject.id}-${chapter.slug}`)
        return {
          id: `${subject.id}-${chapter.slug}`,
          subjectName: subject.name,
          name: chapter.name,
          accuracy: seededInt(seed, 30, 95, 1),
          attempted: seededInt(seed, 5, 40, 2),
        }
      }),
    )
    .sort((a, b) => a.accuracy - b.accuracy)

  const difficultyWise = DIFFICULTY_LEVELS.map((level) => {
    const seed = hashString(`analysis-difficulty-${level}`)
    return {
      level,
      accuracy: seededInt(seed, level === 'Easy' ? 70 : level === 'Moderate' ? 50 : 30, level === 'Easy' ? 96 : level === 'Moderate' ? 80 : 60, 1),
      attempted: seededInt(seed, 40, 220, 2),
    }
  })

  const timeAnalysis = subjects.map((subject) => {
    const seed = hashString(`time-${subject.id}`)
    return {
      id: subject.id,
      name: subject.name,
      avgTimePerQuestion: seededInt(seed, 40, 150, 1),
      timeShare: seededInt(seed, 8, 22, 2),
    }
  })

  const sortedBySubjectAccuracy = [...subjectWise].sort((a, b) => a.accuracy - b.accuracy)
  const weakAreas = sortedBySubjectAccuracy.slice(0, 3)
  const strongAreas = [...sortedBySubjectAccuracy].reverse().slice(0, 3)

  const mistakeTypes = ['Conceptual Gap', 'Calculation Error', 'Silly Mistake', 'Time Pressure', 'Misread Question']
  const mistakeDistribution = mistakeTypes.map((label, i) => {
    const seed = hashString(`mistake-${label}`)
    return { label, share: seededInt(seed, 8, 30, i) }
  })
  const shareTotal = mistakeDistribution.reduce((sum, m) => sum + m.share, 0)
  mistakeDistribution.forEach((m) => {
    m.share = Math.round((m.share / shareTotal) * 100)
  })

  return { subjectWise, chapterWise, difficultyWise, timeAnalysis, weakAreas, strongAreas, mistakeDistribution }
}

export function generateRevisionQueueSeed() {
  const source = getRecentAttempts(8)
  return source.map((test, index) => {
    const seed = hashString(`revision-${test.id}`)
    return {
      id: `REV-${test.id}`,
      testId: test.id,
      testTitle: test.title,
      subjectName: test.subjectName ?? subjects[seededInt(seed, 0, subjects.length - 1, 1)].name,
      chapterName: test.chapterName ?? 'Mixed Topics',
      questionNumber: seededInt(seed, 1, test.questions, 2),
      difficulty: DIFFICULTY_CYCLE[index % DIFFICULTY_CYCLE.length],
      snippet: `Question flagged from ${test.title} for revision. Full question content will load from the question bank.`,
    }
  })
}

export { EXAMS }
