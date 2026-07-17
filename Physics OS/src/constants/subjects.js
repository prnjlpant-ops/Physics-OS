import {
  Sigma,
  Cog,
  Zap,
  Atom,
  Thermometer,
  Waves,
  CircuitBoard,
  FlaskConical,
} from 'lucide-react'
import { slugify } from '../utils/slugify'

const CHAPTER_PATTERN = [
  {
    status: 'Completed',
    progress: 100,
    reading: 'Done',
    problems: 'Done',
    revision: 'Done',
  },
  {
    status: 'In Progress',
    progress: 55,
    reading: 'Done',
    problems: 'In Progress',
    revision: 'Pending',
  },
  {
    status: 'Not Started',
    progress: 0,
    reading: 'Pending',
    problems: 'Pending',
    revision: 'Pending',
  },
]

function buildChapters(names) {
  return names.map((name, index) => ({
    name,
    slug: slugify(name),
    ...CHAPTER_PATTERN[index % CHAPTER_PATTERN.length],
  }))
}

export const subjects = [
  {
    id: 'mathematical-methods',
    name: 'Mathematical Methods',
    icon: Sigma,
    description:
      'Core mathematical tools used across every branch of physics, from vector calculus to tensor analysis.',
    chapters: buildChapters([
      'Vector Calculus',
      'Linear Algebra',
      'Complex Analysis',
      'Differential Equations',
      'Fourier Series',
      'Special Functions',
      'Tensors',
    ]),
  },
  {
    id: 'classical-mechanics',
    name: 'Classical Mechanics',
    icon: Cog,
    description:
      'Newtonian, Lagrangian and Hamiltonian formulations of motion, along with rigid bodies and oscillations.',
    chapters: buildChapters([
      'Newtonian Mechanics',
      'Lagrangian Formulation',
      'Hamiltonian Formulation',
      'Central Force Motion',
      'Rigid Body Dynamics',
      'Small Oscillations',
      'Special Relativity',
    ]),
  },
  {
    id: 'electrodynamics',
    name: 'Electrodynamics',
    icon: Zap,
    description:
      'Electric and magnetic fields, Maxwell\u2019s equations, electromagnetic waves and radiation.',
    chapters: buildChapters([
      'Electrostatics',
      'Magnetostatics',
      'Electromagnetic Induction',
      "Maxwell's Equations",
      'Electromagnetic Waves',
      'Radiation',
      'Boundary Value Problems',
    ]),
  },
  {
    id: 'quantum-mechanics',
    name: 'Quantum Mechanics',
    icon: Atom,
    description:
      'The postulates, operators and mathematical machinery governing quantum systems.',
    chapters: buildChapters([
      'Postulates',
      'Operators',
      'Wave Function',
      'Schr\u00f6dinger Equation',
      'Angular Momentum',
      'Spin',
      'Approximation Methods',
    ]),
  },
  {
    id: 'thermodynamics',
    name: 'Thermodynamics',
    icon: Thermometer,
    description:
      'Laws of thermodynamics, potentials, heat engines and phase transitions.',
    chapters: buildChapters([
      'Laws of Thermodynamics',
      'Thermodynamic Potentials',
      'Kinetic Theory',
      'Heat Engines',
      'Phase Transitions',
      'Maxwell Relations',
      'Entropy and Reversibility',
    ]),
  },
  {
    id: 'statistical-mechanics',
    name: 'Statistical Mechanics',
    icon: Waves,
    description:
      'Ensembles, partition functions and quantum statistics governing many-particle systems.',
    chapters: buildChapters([
      'Microcanonical Ensemble',
      'Canonical Ensemble',
      'Grand Canonical Ensemble',
      'Classical Statistics',
      'Quantum Statistics',
      'Partition Functions',
      'Bose\u2013Einstein Condensation',
    ]),
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: CircuitBoard,
    description:
      'Semiconductor devices, amplifiers, digital logic and communication systems.',
    chapters: buildChapters([
      'Semiconductor Devices',
      'Diodes and Rectifiers',
      'Transistors',
      'Operational Amplifiers',
      'Digital Logic',
      'Oscillators',
      'Communication Systems',
    ]),
  },
  {
    id: 'experimental-physics',
    name: 'Experimental Physics',
    icon: FlaskConical,
    description:
      'Measurement techniques, error analysis and laboratory methods used in experimental work.',
    chapters: buildChapters([
      'Error Analysis',
      'Measurement Techniques',
      'Optics Experiments',
      'Electrical Circuits Lab',
      'Modern Physics Experiments',
      'Data Analysis',
      'Instrumentation',
    ]),
  },
]

export function getSubjectById(id) {
  return subjects.find((subject) => subject.id === id)
}

export function getChapterBySlug(subjectId, chapterSlug) {
  const subject = getSubjectById(subjectId)
  if (!subject) return null

  const chapter = subject.chapters.find((item) => item.slug === chapterSlug)
  if (!chapter) return null

  return { subject, chapter }
}
