import { mapPriority } from './blueprintModel'
import { subjects } from '../constants/subjects'
import { getAllTopics } from '../data/syllabusData'
import { TOPIC_STATUS_WEIGHT, TOPIC_STATUS as SYLLABUS_TOPIC_STATUS } from '../constants/syllabusConstants'
import { TOPIC_STATUS as TOPIC_PROGRESS_STATUS } from '../constants/topicConstants'

const V2 = [
  ['Phase A — core syllabus (hard stop: 20 Jan 2027)', 'Aug–Sep 2026', 'high', 'Mathematical foundations and mechanics core. Complex analysis and Fourier are only at JAM depth here.', 'Topics 1–7 complete by early October.', [['mathematical-methods', ['Linear Algebra & Matrices', 'Complex Analysis (Contour Integration)', 'Fourier & Laplace Transforms']], ['classical-mechanics', ['Lagrangian & Hamiltonian Mechanics', 'Central Force & Kepler Problem']]]],
  ['Phase A — core syllabus (hard stop: 20 Jan 2027)', 'Oct–Nov 2026', 'high', 'Core fields, optics, special relativity and quantum mechanics. Keep advanced boundary-value and angular-momentum work for the bonus tier.', 'Complete every JAM+JEST foundation before moving to bonus topics.', [['classical-mechanics', ['Special Relativity (Mechanics)']], ['electromagnetism', ['Electrostatics & Boundary Value Problems', 'Magnetostatics & Induction', "Maxwell's Equations & EM Waves"]], ['optics', ['Interference & Diffraction', 'Polarization']], ['quantum-mechanics', ['Postulates, Operators & Hilbert Space', '1D Potentials (well, barrier, harmonic oscillator)']]]],
  ['Phase A — core syllabus (hard stop: 20 Jan 2027)', 'Dec 2026–20 Jan 2027', 'very high', 'Finish thermo, statistics basics, electronics, solid-state basics and atomic/nuclear core. This completes Topics 1–20.', 'Topics 1–14 by mid-December. Absolutely no new core material after 20 January.', [['thermodynamics', ['Laws of Thermodynamics & Maxwell Relations']], ['statistical-mechanics', ['Quantum Statistics (Fermi-Dirac, Bose-Einstein)']], ['electronics', ['Semiconductor Devices (diodes, transistors)', 'Op-Amp Circuits', 'Digital Logic (gates, flip-flops)']], ['solid-state-physics', ['Crystal Structure & Reciprocal Lattice', 'Band Theory']], ['atomic-molecular-nuclear-particle-physics', ['Nuclear Models & Radioactivity']]]],
  ['JAM lockdown — PYQs only', '20 Jan 2027–JAM exam', 'high', 'Timed PYQs, mistake logs, revision queues and formula sheets only. No new syllabus.', 'Use the Question Bank daily; do not start bonus or Phase B work.', []],
  ['Phase A bonus — only when ahead', 'Before 20 Jan 2027', 'moderate', 'Ranked extensions: angular momentum, matrix QM, EM boundary methods, residues, ensembles, full relativity, normal modes, special functions, transforms, perturbation and numerical fluency.', 'Stop immediately if any Phase A core topic is incomplete.', [['quantum-mechanics', ['Angular Momentum & Spin', 'Perturbation Theory']], ['mathematical-methods', ['Complex Analysis (Contour Integration)', 'Fourier & Laplace Transforms', 'Special Functions (Legendre, Bessel)', 'Probability & Statistics']], ['electromagnetism', ['Electrostatics & Boundary Value Problems']], ['statistical-mechanics', ['Ensembles (Micro/Canonical/Grand)']], ['classical-mechanics', ['Small Oscillations & Normal Modes', 'Special Relativity (Mechanics)']]]],
  ['Phase B — Tier 1', 'Post-JAM to JEST − 10 days', 'high', 'Advanced solid state, EM field energy and media, atomic spectra/fine structure, and identical-particle symmetry. These are non-negotiable if any Phase B time exists.', 'Finish Tier 1 before every other post-JAM item.', [['solid-state-physics', ['Band Theory', 'Lattice Vibrations (Phonons)']], ['electromagnetism', ["Maxwell's Equations & EM Waves"]], ['atomic-molecular-nuclear-particle-physics', ['Atomic Spectra & Fine Structure']], ['quantum-mechanics', ['Identical Particles & Symmetry']]]],
  ['Phase B — Tier 2', 'Post-JAM to JEST − 10 days', 'moderate', 'Tensors/coordinates, deeper electronics, discrete groups, rigid-body/radiation extensions and nuclear-model depth.', 'Only begin after Tier 1 is complete.', [['mathematical-methods', ['Special Functions (Legendre, Bessel)']], ['electronics', ['Op-Amp Circuits']], ['classical-mechanics', ['Rigid Body Dynamics']], ['electromagnetism', ['Radiation (Dipole, Larmor)']], ['atomic-molecular-nuclear-particle-physics', ['Nuclear Models & Radioactivity']]]],
  ['Phase B — Tier 3 (cut first)', 'Only if genuinely ahead', 'low', 'Scattering, phase transitions and particle physics are deliberately last.', 'Never steal time from Tier 1 or final lockdown.', [['quantum-mechanics', ['Scattering Theory']], ['thermodynamics', ['Phase Transitions']], ['atomic-molecular-nuclear-particle-physics', ['Particle Physics Basics']]]],
  ['Final JEST lockdown — PYQs only', 'JEST − 10 days to exam', 'very high', 'Timed PYQs and mocks, formula sheets and mistake logs only. No new topics.', 'Prioritise Part B accuracy; attempt every NAT with partial methods.', []],
]

const HOURS = { low: 6, medium: 10, high: 16, 'very high': 20 }
function statusWeight(status) {
  if (status == null) return 0
  if (TOPIC_STATUS_WEIGHT[status] != null) return TOPIC_STATUS_WEIGHT[status]
  if (status === TOPIC_PROGRESS_STATUS.NOT_STARTED || status === SYLLABUS_TOPIC_STATUS.NOT_STARTED) return 0
  if (status === TOPIC_PROGRESS_STATUS.IN_PROGRESS) return 0.5
  if (status === TOPIC_PROGRESS_STATUS.REVISION_NEEDED) return 0.75
  if (status === TOPIC_PROGRESS_STATUS.MASTERED || status === SYLLABUS_TOPIC_STATUS.MASTERED) return 1
  if (status === SYLLABUS_TOPIC_STATUS.READING) return 0.25
  if (status === SYLLABUS_TOPIC_STATUS.PROBLEM_SOLVING) return 0.5
  if (status === SYLLABUS_TOPIC_STATUS.REVISION) return 0.75
  return 0
}
function completion(subjectId, chapterSlug, topics, overrides) { const matching = topics.filter((t) => t.metadata.subjectId === subjectId && t.metadata.chapterSlug === chapterSlug); if (!matching.length) return 0; return Math.round(matching.reduce((sum, t) => sum + statusWeight(overrides[t.id] ?? t.metadata.status), 0) / matching.length) }
function chapterNode(subject, chapter, topics, overrides) { const difficulty = String(chapter.blueprint?.difficulty ?? 'medium').toLowerCase(); return { slug: chapter.slug, name: chapter.name, subjectId: subject.id, subjectName: subject.name, estimatedHours: HOURS[difficulty] ?? 10, priority: chapter.blueprint?.pyqFrequency?.includes('Frequently') ? 'High' : mapPriority(chapter.blueprint?.weightage), completion: completion(subject.id, chapter.slug, topics, overrides), blueprint: chapter.blueprint } }

export function buildRoadmap(overrides = {}) {
  const topics = getAllTopics().filter((topic) => topic.ancestors[0]?.slug === 'jest')
  const phases = []
  for (const [phaseName, month, intensity, focus, notes, entries] of V2) {
    const monthNode = { id: `month-${month}`, month, intensity, focus, notes, subjects: entries.map(([subjectId, names]) => { const subject = subjects.find((item) => item.id === subjectId); if (!subject) return null; const chapters = names.map((name) => subject.chapters.find((chapter) => chapter.name === name)).filter(Boolean).map((chapter) => chapterNode(subject, chapter, topics, overrides)); return { id: subject.id, name: subject.name, priority: mapPriority(subject.blueprintPriority), chapters } }).filter(Boolean) }
    const existing = phases.find((phase) => phase.phaseName === phaseName)
    if (existing) existing.months.push(monthNode); else phases.push({ id: `phase-${phases.length}`, phaseName, months: [monthNode] })
  }
  return phases
}

function dedupedChapters(phases) { const found = new Map(); phases.forEach((phase) => phase.months.forEach((month) => month.subjects.forEach((subject) => subject.chapters.forEach((chapter) => found.set(`${chapter.subjectId}-${chapter.slug}`, chapter))))); return [...found.values()] }
export function getRoadmapProgressCards(phases) { const overall = dedupedChapters(phases); const summarise = (chapters) => ({ completion: chapters.length ? Math.round(chapters.reduce((sum, chapter) => sum + chapter.completion, 0) / chapters.length) : 0, chapterCount: chapters.length, estimatedHours: chapters.reduce((sum, chapter) => sum + chapter.estimatedHours, 0) }); return { overall: { ...summarise(overall), monthCount: phases.reduce((sum, phase) => sum + phase.months.length, 0) }, perPhase: phases.map((phase) => ({ id: phase.id, phaseName: phase.phaseName, months: phase.months.map((month) => month.month), ...summarise(dedupedChapters([phase])) })) } }
export function getUpcomingTasks(phases, limit = 8) { return phases.flatMap((phase) => phase.months.flatMap((month) => month.subjects.flatMap((subject) => subject.chapters.filter((chapter) => chapter.completion < 100).map((chapter) => ({ ...chapter, phaseName: phase.phaseName, month: month.month }))))).slice(0, limit) }
