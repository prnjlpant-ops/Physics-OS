import { getBlueprintRoadmap } from './blueprintService'
import { mapPriority } from './blueprintModel'
import { subjects } from '../constants/subjects'
import { getAllTopics } from '../data/syllabusData'
import { TOPIC_STATUS_WEIGHT } from '../constants/syllabusConstants'

/**
 * ROADMAP ENGINE
 * ==============
 * Sprint 18B — Roadmap Engine.
 *
 * Reads the imported blueprint's month-by-month plan (Sprint 17,
 * `engine/blueprintService.js` -> `getBlueprintRoadmap`) and the syllabus
 * (Sprint 17, `constants/subjects.js` / `data/syllabusData.js`) and joins
 * them into one navigable hierarchy:
 *
 *   Phase -> Month -> Subject -> Chapter -> Topic
 *
 * The blueprint's roadmap table only describes each month in prose (a
 * `focus` sentence, not a structured subject/chapter list), so this engine
 * maps that prose to actual subjects and chapters with a keyword matcher
 * (`SUBJECT_KEYWORDS` below) — a documented heuristic, not a guess baked
 * into a component. Estimated hours and priority are likewise derived
 * placeholder values (from each chapter's blueprint difficulty/weightage),
 * not a scheduling algorithm.
 *
 * ARCHITECTURE NOTE — JSON-ready: everything below is a pure function of
 * `getBlueprintRoadmap()` + `subjects` + live topic status overrides. A
 * future sprint that gives the blueprint an explicit per-month
 * subject/chapter list (instead of prose) only needs to change
 * `resolveMonthSubjects` — every getter and every component that reads
 * this engine's output stays the same.
 */

const DIFFICULTY_HOURS = {
  low: 6,
  'low–medium': 8,
  'low-medium': 8,
  medium: 10,
  'medium–high': 13,
  'medium-high': 13,
  high: 16,
  'very high': 20,
}

/** Keyword aliases used to match a month's free-text focus/notes to a subject. One entry per app subject id. */
const SUBJECT_KEYWORDS = {
  'mathematical-methods': ['mathematical methods', 'vector calculus', 'complex analysis', 'contour integration', 'tensor'],
  'classical-mechanics': [
    'classical mechanics',
    'lagrangian',
    'hamiltonian',
    'central force',
    'oscillation',
    'rigid body',
    'special relativity',
    'newtonian',
  ],
  electromagnetism: [
    'electromagnetism',
    'electrostatics',
    'magnetostatics',
    "maxwell",
    'em wave',
    'electrodynamics',
    'radiation',
  ],
  'quantum-mechanics': ['quantum mechanics', 'quantum', 'scattering theory', 'perturbation', 'angular momentum'],
  thermodynamics: ['thermodynamics', 'phase transition'],
  'statistical-mechanics': ['statistical mechanics', 'stat mech', 'ensemble', 'quantum statistics'],
  electronics: ['electronics'],
  'solid-state-physics': ['solid state', 'phonon', 'band theory', 'crystal'],
  'atomic-molecular-nuclear-particle-physics': ['particle physics', 'nuclear', 'atomic spectra', 'atomic, molecular'],
  optics: ['optics', 'interference', 'diffraction', 'polarization'],
}

function estimatedHoursFor(chapter) {
  const key = (chapter.blueprint?.difficulty ?? 'medium').trim().toLowerCase()
  const base = DIFFICULTY_HOURS[key] ?? 10
  const starBonus = (chapter.blueprint?.highYieldStars ?? 3) - 3
  return Math.max(4, base + starBonus * 2)
}

function priorityFor(chapter) {
  if (chapter.blueprint?.pyqFrequency?.includes('Frequently')) return 'High'
  return mapPriority(chapter.blueprint?.weightage)
}

/** Matches a month's combined focus+notes text against SUBJECT_KEYWORDS. */
function resolveMonthSubjectIds(month) {
  const haystack = `${month.focus} ${month.notes ?? ''}`.toLowerCase()
  return Object.entries(SUBJECT_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => haystack.includes(keyword)))
    .map(([subjectId]) => subjectId)
}

/** Within a matched subject, prefers chapters explicitly named in the month's text; falls back to all its chapters. */
function resolveMonthChapters(subject, month) {
  const haystack = `${month.focus} ${month.notes ?? ''}`.toLowerCase()
  const named = subject.chapters.filter((chapter) => haystack.includes(chapter.name.toLowerCase()))
  return named.length ? named : subject.chapters
}

function chapterCompletion(subjectId, chapterSlug, jestTopics, statusOverrides) {
  const topics = jestTopics.filter(
    (topic) => topic.metadata.subjectId === subjectId && topic.metadata.chapterSlug === chapterSlug,
  )
  if (!topics.length) return 0
  const total = topics.reduce((sum, topic) => {
    const status = statusOverrides[topic.id] ?? topic.metadata.status
    return sum + (TOPIC_STATUS_WEIGHT[status] ?? 0)
  }, 0)
  return Math.round((total / topics.length) * 100)
}

/**
 * Builds the full Phase -> Month -> Subject -> Chapter -> Topic roadmap.
 * `statusOverrides` should be the map from `useSyllabusStatus()` so
 * completion reflects the person's actual, live study state.
 */
export function buildRoadmap(statusOverrides = {}) {
  const months = getBlueprintRoadmap()
  const jestTopics = getAllTopics().filter((topic) => topic.ancestors[0]?.slug === 'jest')

  // Group consecutive roadmap rows sharing the same `phase` label into one
  // Phase node — in the current blueprint this is 1:1, but a future
  // blueprint revision that spans one phase across several month rows
  // groups correctly without any code change here.
  const phases = []
  for (const month of months) {
    const lastPhase = phases[phases.length - 1]
    const monthSubjectIds = resolveMonthSubjectIds(month)

    const monthNode = {
      id: `month-${month.month}`,
      month: month.month,
      focus: month.focus,
      intensity: month.intensity,
      notes: month.notes,
      subjects: monthSubjectIds
        .map((subjectId) => subjects.find((subject) => subject.id === subjectId))
        .filter(Boolean)
        .map((subject) => {
          const chapters = resolveMonthChapters(subject, month).map((chapter) => ({
            slug: chapter.slug,
            name: chapter.name,
            subjectId: subject.id,
            subjectName: subject.name,
            estimatedHours: estimatedHoursFor(chapter),
            priority: priorityFor(chapter),
            completion: chapterCompletion(subject.id, chapter.slug, jestTopics, statusOverrides),
            blueprint: chapter.blueprint,
          }))
          return {
            id: subject.id,
            name: subject.name,
            priority: mapPriority(subject.blueprintPriority),
            chapters,
          }
        }),
    }

    if (lastPhase && lastPhase.phaseName === month.phase) {
      lastPhase.months.push(monthNode)
    } else {
      phases.push({ id: `phase-${phases.length}`, phaseName: month.phase, months: [monthNode] })
    }
  }

  return phases
}

/** Every (subject, chapter) pair referenced anywhere in the roadmap, deduplicated — for summary stats. */
function dedupedChapters(phases) {
  const seen = new Map()
  for (const phase of phases) {
    for (const month of phase.months) {
      for (const subject of month.subjects) {
        for (const chapter of subject.chapters) {
          const key = `${chapter.subjectId}__${chapter.slug}`
          if (!seen.has(key)) seen.set(key, chapter)
        }
      }
    }
  }
  return [...seen.values()]
}

/** Progress-card-ready summary: overall + one card per phase. */
export function getRoadmapProgressCards(phases) {
  const overallChapters = dedupedChapters(phases)
  const overallCompletion = overallChapters.length
    ? Math.round(overallChapters.reduce((sum, c) => sum + c.completion, 0) / overallChapters.length)
    : 0
  const overallHours = overallChapters.reduce((sum, c) => sum + c.estimatedHours, 0)

  const perPhase = phases.map((phase) => {
    const chapters = dedupedChapters([phase])
    const completion = chapters.length
      ? Math.round(chapters.reduce((sum, c) => sum + c.completion, 0) / chapters.length)
      : 0
    const hours = chapters.reduce((sum, c) => sum + c.estimatedHours, 0)
    return {
      id: phase.id,
      phaseName: phase.phaseName,
      months: phase.months.map((m) => m.month),
      chapterCount: chapters.length,
      completion,
      estimatedHours: hours,
    }
  })

  return {
    overall: {
      completion: overallCompletion,
      chapterCount: overallChapters.length,
      estimatedHours: overallHours,
      monthCount: phases.reduce((sum, phase) => sum + phase.months.length, 0),
    },
    perPhase,
  }
}

/** The next N not-yet-complete chapters, in roadmap (chronological) order — "Upcoming Tasks". */
export function getUpcomingTasks(phases, limit = 8) {
  const tasks = []
  for (const phase of phases) {
    for (const month of phase.months) {
      for (const subject of month.subjects) {
        for (const chapter of subject.chapters) {
          if (chapter.completion < 100) {
            tasks.push({
              ...chapter,
              phaseName: phase.phaseName,
              month: month.month,
            })
          }
        }
      }
    }
  }
  return tasks.slice(0, limit)
}
