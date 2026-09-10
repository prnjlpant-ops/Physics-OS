/**
 * Subject-specific study methods from Master Blueprint v3 §7.  This adds
 * guidance to the v5 chapter/resource plan; it never changes v5 order,
 * dates, resources, or priority.
 */
const WORKFLOWS = {
  'math-methods': {
    label: 'Technique drilling',
    steps: ['Textbook', 'Work every problem', 'PYQ', 'Memory sheet'],
    note: 'Prioritise fluency and repeated techniques over extra lectures.',
  },
  mechanics: {
    label: 'First-principles derivation',
    steps: ['Video', 'Textbook', 'Derive from scratch', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Re-derive the equations of motion before moving to exercises.',
  },
  'special-relativity': {
    label: 'First-principles derivation',
    steps: ['Video', 'Textbook', 'Derive from scratch', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Build the basic kinematics first; reserve 4-vector depth for its roadmap phase.',
  },
  'em-theory': {
    label: 'Boundary-condition practice',
    steps: ['Video', 'Textbook', 'Derive boundary conditions', 'Solved problems', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Make boundary-condition derivations explicit, not implicit.',
  },
  'waves-optics': {
    label: 'Concept and application',
    steps: ['Textbook', 'Worked examples', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Use diagrams and limiting cases to check wave and optics answers.',
  },
  'quantum-mechanics': {
    label: 'Operator and eigenvalue fluency',
    steps: ['Video', 'Textbook', 'Derive eigenvalues', 'Solved examples', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Keep commutators and operator identities in the memory sheet.',
  },
  'thermo-statmech': {
    label: 'Partition-function derivation',
    steps: ['Textbook', 'Derive standard systems', 'Solved examples', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Build from basic distributions before the full ensemble derivations.',
  },
  electronics: {
    label: 'Circuit-diagram practice',
    steps: ['Textbook', 'Draw circuits', 'Solved examples', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Practise diagrams and device equations rather than passive reading.',
  },
  'atomic-molecular': {
    label: 'Concept mapping',
    steps: ['Textbook', 'Concept map', 'Solved examples', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Use diagrams and compact formula cards for facts and energy-level structure.',
  },
  'condensed-matter': {
    label: 'Concept mapping',
    steps: ['Textbook', 'Concept map', 'Solved examples', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Use diagrams and compact formula cards for lattice and band concepts.',
  },
  'nuclear-particle': {
    label: 'Concept mapping',
    steps: ['Textbook', 'Concept map', 'Solved examples', 'Exercises', 'PYQ', 'Memory sheet'],
    note: 'Use diagrams and compact formula cards for models, decays, and selection rules.',
  },
}

export function getStudyWorkflow(subjectId) {
  return WORKFLOWS[subjectId] ?? {
    label: 'Core study loop',
    steps: ['Video or textbook', 'Exercises', 'PYQ', 'Revision'],
    note: 'Use the chapter resources, then test the concept with PYQs.',
  }
}
