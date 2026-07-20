import {
  Sigma,
  Cog,
  Zap,
  Atom,
  Thermometer,
  Waves,
  CircuitBoard,
  Boxes,
  Radiation,
  Aperture,
} from 'lucide-react'
import { slugify } from '../utils/slugify'
import { getBlueprintSubjects } from './blueprintService'

/**
 * BLUEPRINT MAPPING LAYER
 * =======================
 * Sprint 17 — JEST Blueprint Import Engine.
 *
 * Connects the imported blueprint to the app's existing architecture:
 *
 *   Subjects -> Resources -> Notes -> Formula Sheets -> Memory Sheets
 *            -> PYQs -> Mock Tests -> Active Recall
 *
 * `constants/subjects.js` is the app's existing single source of truth for
 * the Subject -> Chapter shape that every other data module (resources,
 * formula sheets, memory sheets, PYQs, mock tests, active recall, error
 * learning, analytics) already builds itself from generically. This layer
 * produces that exact shape from blueprint data, so none of those modules
 * need to change — they simply see real subjects/chapters instead of
 * placeholder ones.
 *
 * Subject-id mapping note: the blueprint's "Thermodynamics & Statistical
 * Mechanics" is one domain, but this app (an existing, pre-Sprint-17
 * decision) models Thermodynamics and Statistical Mechanics as two distinct
 * subjects/nav destinations. blueprintService already splits that domain's
 * chapters accordingly, so each keeps its own id here.
 */

const SUBJECT_ICONS = {
  'Mathematical Methods': Sigma,
  'Classical Mechanics': Cog,
  Electromagnetism: Zap,
  'Quantum Mechanics': Atom,
  Thermodynamics: Thermometer,
  'Statistical Mechanics': Waves,
  Electronics: CircuitBoard,
  'Solid State Physics': Boxes,
  'Atomic, Molecular, Nuclear & Particle Physics': Radiation,
  Optics: Aperture,
}

const SUBJECT_DESCRIPTIONS = {
  'Mathematical Methods':
    'Core mathematical tools used across every branch of physics — vector calculus, complex analysis, transforms and special functions.',
  'Classical Mechanics':
    'Newtonian, Lagrangian and Hamiltonian formulations of motion, central forces, oscillations and special relativity.',
  Electromagnetism:
    "Electric and magnetic fields, boundary value problems, Maxwell's equations, electromagnetic waves and radiation.",
  'Quantum Mechanics':
    'Postulates, operators, 1D potentials, angular momentum, perturbation theory and scattering — the mathematical machinery of quantum systems.',
  Thermodynamics:
    'Laws of thermodynamics, Maxwell relations and phase transitions.',
  'Statistical Mechanics':
    'Ensembles, partition functions and quantum statistics governing many-particle systems.',
  Electronics:
    'Semiconductor devices, op-amp circuits and digital logic.',
  'Solid State Physics':
    'Crystal structure, reciprocal lattice, band theory and lattice vibrations.',
  'Atomic, Molecular, Nuclear & Particle Physics':
    'Atomic spectra, nuclear models, radioactivity and particle physics fundamentals.',
  Optics: 'Interference, diffraction and polarization.',
}

/** Deterministic chapter-status demo cycle — mirrors the Sprint 16 placeholder pattern. */
const CHAPTER_STATUS_PATTERN = [
  { status: 'Completed', progress: 100, reading: 'Done', problems: 'Done', revision: 'Done' },
  { status: 'In Progress', progress: 55, reading: 'Done', problems: 'In Progress', revision: 'Pending' },
  { status: 'Not Started', progress: 0, reading: 'Pending', problems: 'Pending', revision: 'Pending' },
]

function subjectIdFor(subjectName) {
  return slugify(subjectName)
}

/**
 * Builds the app-shaped `subjects` array (id, name, icon, description,
 * chapters: [{ name, slug, status, progress, reading, problems, revision }])
 * directly from the imported blueprint. This is the exact shape
 * `constants/subjects.js` used to hardcode — every other data module in
 * `src/data/*.js` already consumes it generically, so nothing else needs
 * to change for real syllabus content to flow through the whole app.
 */
export function buildSubjectsFromBlueprint() {
  const blueprintSubjects = getBlueprintSubjects()

  return blueprintSubjects.map((subject) => {
    const id = subjectIdFor(subject.name)
    return {
      id,
      name: subject.name,
      icon: SUBJECT_ICONS[subject.name] ?? Sigma,
      description: SUBJECT_DESCRIPTIONS[subject.name] ?? `${subject.name} syllabus, imported from the JEST 2027 blueprint.`,
      blueprintWeightageRange: subject.weightageRange,
      blueprintPriority: subject.priority,
      blueprintDeadline: subject.deadline,
      chapters: subject.chapters.map((chapter, index) => ({
        name: chapter.name,
        slug: chapter.slug,
        ...CHAPTER_STATUS_PATTERN[index % CHAPTER_STATUS_PATTERN.length],
        blueprint: chapter,
      })),
    }
  })
}

/** Finds the blueprint chapter record behind an app chapter (by subject name + chapter slug). */
export function getBlueprintChapter(subjectName, chapterSlug) {
  const subject = getBlueprintSubjects().find((s) => s.name === subjectName)
  return subject?.chapters.find((c) => c.slug === chapterSlug) ?? null
}

/**
 * Resource bundle (books / videos / solution manuals) for a given app
 * subject id, sourced from the blueprint's per-subject resource mapping.
 * Solution manuals are derived from books tagged with problem-set-heavy
 * "Recommended Exercises" info where the blueprint doesn't list a
 * dedicated solutions volume, since JEST prep resources are frequently
 * "the same book's exercises," not a separate manual.
 */
export function getBlueprintResourcesForSubject(subjectId) {
  const subject = getBlueprintSubjects().find((s) => subjectIdFor(s.name) === subjectId)
  if (!subject) return { books: [], videos: [], solutionManuals: [] }
  return subject.resources
}

/** The same Exam -> Subject -> ... -> Linked Modules route convention already established in syllabusData.js. */
export function buildLinkedModuleRoutes(subjectId, chapterSlug) {
  return {
    resources: `/subjects/${subjectId}/chapters/${chapterSlug}`,
    notes: `/subjects/${subjectId}/chapters/${chapterSlug}/notes`,
    formulaSheet: `/subjects/${subjectId}/chapters/${chapterSlug}/formula-sheet`,
    memorySheet: `/subjects/${subjectId}/chapters/${chapterSlug}/memory-sheet`,
    pyqs: `/subjects/${subjectId}/pyqs`,
    mockTests: '/mock-tests',
    activeRecall: `/subjects/${subjectId}/chapters/${chapterSlug}/active-recall`,
    errorLearning: '/error-learning',
  }
}
