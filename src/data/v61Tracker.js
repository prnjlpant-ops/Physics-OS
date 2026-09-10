import trackerData from './v61Tracker.json' with { type: 'json' }

const normalise = (value = '') => String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ')

const SUBJECT_ALIASES = {
  'mathematical methods': ['mathematical methods', 'math methods', 'mathematical physics'],
  'classical mechanics': ['classical mechanics', 'mechanics', 'newtonian mechanics', 'mechanical physics', 'special relativity', 'relativity'],
  'electromagnetism': ['electromagnetism', 'em theory', 'electromagnetic theory', 'electrodynamics', 'em waves', 'maxwell equations'],
  'optics': ['optics', 'waves optics', 'wave optics'],
  'quantum mechanics': ['quantum mechanics', 'qm'],
  'thermodynamics and statistical mechanics': ['thermodynamics and statistical mechanics', 'thermo statmech', 'thermodynamics', 'statistical mechanics'],
  'electronics': ['electronics'],
  'atomic molecular nuclear and particle physics': ['atomic molecular nuclear and particle physics', 'atomic molecular', 'nuclear particle', 'atomic and molecular physics'],
  'solid state physics': ['solid state physics', 'condensed matter'],
  'special relativity': ['special relativity', 'str basics', 'str dynamics', 'str 4 vectors', 'relativistic dynamics', 'relativity'],
}

const CHAPTER_ALIASES = {
  'newtonian mechanics': ['newtonian mechanics', 'newtonian', 'mechanics'],
  'lagrangian and hamiltonian mechanics': ['lagrangian and hamiltonian mechanics', 'lagrangian formulation', 'lagrangian formalism', 'lagrangian hamiltonian mechanics', 'hamiltonian mechanics'],
  'central force and kepler problem': ['central force and kepler problem', 'central force', 'kepler problem'],
  'small oscillations and normal modes': ['small oscillations and normal modes', 'normal modes', 'oscillations'],
  'rigid body dynamics': ['rigid body dynamics', 'rigid body'],
  'special relativity': ['special relativity', 'special relativity mechanics', 'special relativity basics', 'special relativity full treatment', 'str basics', 'str dynamics', 'str 4 vectors', 'relativistic dynamics', 'relativity', 'four vectors'],
  'electrostatics and magnetostatics': ['electrostatics and magnetostatics', 'electrostatics', 'magnetostatics', 'electrostatic and magnetostatic fields'],
  'electromagnetic theory': ['electromagnetic theory', 'maxwell equations', 'maxwell\'s equations', 'em waves', 'em waves in matter', 'em waves in media', 'electromagnetic waves', 'electrodynamics', 'maxwell s equations'],
  'waves and optics': ['waves and optics', 'interference diffraction', 'optics', 'wave optics'],
  'quantum mechanics': ['quantum mechanics', 'qm'],
  'differential equations & special functions': ['differential equations & special functions', 'differential equations', 'odes', 'ordinary differential equations', 'special functions', 'differential equations and special functions'],
  'complex analysis & residue theorem': ['complex analysis & residue theorem', 'complex analysis', 'complex analysis (basic)', 'complex residues & contours', 'complex residues and contours', 'complex analysis basic', 'residue theorem', 'complex residues'],
  'fourier & laplace transforms': ['fourier & laplace transforms', 'fourier series', 'fourier transforms', 'laplace transforms', 'fourier laplace transforms', 'fourier series and transforms'],
  'tensor & curvilinear coordinates': ['tensor & curvilinear coordinates', 'tensors & curvilinear coordinates', 'tensor and curvilinear coordinates', 'tensors', 'curvilinear coordinates', 'curvilinear coordinate systems'],
  'probability & error analysis': ['probability & error analysis', 'probability & statistics', 'probability statistics', 'probability', 'statistics', 'error analysis'],
  'partial differential equations': ['partial differential equations', 'pde', 'pdes'],
}

function canonicalAliases(value, aliasMap) {
  const normalizedValue = normalise(value)
  const aliases = new Set(normalizedValue ? [normalizedValue] : [])

  Object.entries(aliasMap).forEach(([canonicalName, choices]) => {
    const normalizedCanonical = normalise(canonicalName)
    const normalizedChoices = choices.map(normalise)

    if (!normalizedCanonical && !normalizedValue) return

    const targetMatchesCanonical = normalizedValue && (
      normalizedValue === normalizedCanonical ||
      normalizedValue.startsWith(`${normalizedCanonical} `) ||
      normalizedCanonical.startsWith(`${normalizedValue} `)
    )

    const targetMatchesChoice = normalizedValue && normalizedChoices.some((choice) =>
      normalizedValue === choice || normalizedValue.startsWith(`${choice} `) || choice.startsWith(`${normalizedValue} `),
    )

    if (targetMatchesCanonical || targetMatchesChoice) {
      normalizedChoices.forEach((choice) => aliases.add(choice))
      aliases.add(normalizedCanonical)
    }
  })

  return [...aliases].filter(Boolean)
}

export function getV61RecordsForChapter(subjectName, chapterName) {
  if (!subjectName || !chapterName) return []

  const targetSubject = normalise(subjectName)
  const targetChapter = normalise(chapterName)
  const subjectAliases = canonicalAliases(subjectName, SUBJECT_ALIASES)
  const chapterAliases = canonicalAliases(chapterName, CHAPTER_ALIASES)

  return trackerData.filter((entry) => {
    const entrySubject = normalise(entry.unit || entry.subject || '')
    const entryChapter = normalise(entry.chapter || '')

    const subjectMatch =
      !targetSubject ||
      subjectAliases.some((alias) => entrySubject === alias || entrySubject.startsWith(`${alias} `)) ||
      subjectAliases.some((alias) => alias.startsWith(`${entrySubject} `))

    const chapterMatch =
      !targetChapter ||
      chapterAliases.some((alias) => entryChapter === alias || entryChapter.startsWith(`${alias} `)) ||
      chapterAliases.some((alias) => alias.startsWith(`${entryChapter} `))

    return chapterMatch && subjectMatch
  })
}

export function getV61RecordsForSubject(subjectName) {
  const targetSubject = normalise(subjectName)
  const subjectCandidates = resolveAliasList(subjectName, SUBJECT_ALIASES)
  return trackerData.filter((entry) => {
    const entrySubject = normalise(entry.unit || entry.subject || '')
    return (
      !targetSubject ||
      matchesAlias(targetSubject, subjectCandidates) ||
      subjectCandidates.some((candidate) => entrySubject.includes(candidate) || candidate.includes(entrySubject)) ||
      (entrySubject && (targetSubject.includes(entrySubject) || entrySubject.includes(targetSubject)))
    )
  })
}

export function getV61RecordCount() {
  return trackerData.length
}
