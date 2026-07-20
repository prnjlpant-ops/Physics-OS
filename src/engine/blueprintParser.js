import { normalizeBlueprintData } from './blueprintModel'

/**
 * BLUEPRINT PARSER
 * ================
 * Sprint 17 — JEST Blueprint Import Engine.
 *
 * Two entry points, both returning the same canonical `BlueprintData` shape
 * (see blueprintModel.js):
 *   - parseBlueprintMarkdown(markdownText)
 *   - parseBlueprintJSON(jsonObjectOrText)
 *
 * The Markdown parser is a small, generic pipe-table + heading extractor —
 * it has no per-subject hardcoding. It locates known section headings by
 * text match, then parses whatever pipe-table rows follow. A future
 * blueprint revision that keeps the same heading titles and table columns
 * will parse correctly without any code changes; only the column *mapping*
 * below is blueprint-shape-specific, and lives entirely in this one file.
 */

/** Splits a Markdown document into { heading, level, body } sections by ATX headings (#, ##, ###...). */
function splitIntoSections(markdown) {
  const lines = markdown.split(/\r?\n/)
  const sections = []
  let current = { heading: '', level: 0, body: [] }

  for (const line of lines) {
    const match = /^(#{1,6})\s+(.*)$/.exec(line)
    if (match) {
      if (current.heading || current.body.length) sections.push(current)
      current = { heading: match[2].trim(), level: match[1].length, body: [] }
    } else {
      current.body.push(line)
    }
  }
  if (current.heading || current.body.length) sections.push(current)
  return sections
}

/** Finds the first section whose heading includes the given text (case-insensitive). */
function findSection(sections, headingIncludes) {
  const needle = headingIncludes.toLowerCase()
  return sections.find((section) => section.heading.toLowerCase().includes(needle))
}

/** Parses ALL pipe-tables found within a block of text into arrays of row-objects keyed by header. */
function parseAllTables(bodyLines) {
  const text = bodyLines.join('\n')
  const tableBlocks = text
    .split(/\n(?=\|)/)
    .join('\n')
    .split(/\n\n+/)
    .map((block) => block.split('\n').filter((l) => l.trim().startsWith('|')))
    .filter((rows) => rows.length >= 2)

  const tables = []
  for (const rows of tableBlocks) {
    const headerCells = splitRow(rows[0])
    // rows[1] is the --- separator row
    const dataRows = rows.slice(2)
    const parsed = dataRows.map((row) => {
      const cells = splitRow(row)
      const obj = {}
      headerCells.forEach((header, index) => {
        obj[header] = cells[index] ?? ''
      })
      return obj
    })
    if (parsed.length) tables.push(parsed)
  }
  return tables
}

function splitRow(row) {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cleanCell(cell))
}

function cleanCell(cell) {
  return cell
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .trim()
}

function countStars(value) {
  return (value.match(/★/g) || []).length || 3
}

/**
 * ---------------------------------------------------------------------
 * Section 2.2.x — chapter-wise breakdown tables, one per subject.
 * ---------------------------------------------------------------------
 * Each subsection heading looks like "2.2.1 Classical Mechanics" and is
 * immediately followed by a single pipe-table with columns:
 * Chapter | Approx Weightage | PYQ Frequency | Math Prerequisites |
 * Difficulty | High-Yield Rating | Common Misconceptions | Typical Question Style
 */
function parseChapterTables(sections) {
  const bySubjectHeading = {}
  for (const section of sections) {
    if (/^2\.2\.\d+/.test(section.heading)) {
      const subjectName = section.heading.replace(/^2\.2\.\d+\s*/, '').trim()
      const [table] = parseAllTables(section.body)
      if (!table) continue
      bySubjectHeading[subjectName] = table.map((row) => ({
        name: row['Chapter'],
        weightage: row['Approx Weightage'],
        pyqFrequency: row['PYQ Frequency'],
        mathPrerequisites: row['Math Prerequisites'],
        difficulty: row['Difficulty'],
        highYieldStars: countStars(row['High-Yield Rating']),
        commonMisconceptions: row['Common Misconceptions'],
        questionStyle: row['Typical Question Style'],
      }))
    }
  }
  return bySubjectHeading
}

/**
 * Section 2.1 — Subject-wise Weightage Overview table:
 * Subject | Approx Weightage | Priority | Difficulty | JAM Overlap
 */
function parseSubjectOverview(sections) {
  const section = findSection(sections, '2.1 subject-wise weightage')
  if (!section) return {}
  const [table] = parseAllTables(section.body)
  if (!table) return {}
  const bySubjectName = {}
  for (const row of table) {
    bySubjectName[row['Subject']] = {
      weightageRange: row['Approx Weightage'],
      priority: row['Priority'],
      difficultyOverall: row['Difficulty'],
      jamOverlap: row['JAM Overlap'],
    }
  }
  return bySubjectName
}

/**
 * Section 3.3 — Consolidated Syllabus Table:
 * Subject Domain | Core JAM+JEST Overlap | JEST-Exclusive/Advanced Emphasis | Overall Priority
 */
function parseConsolidatedSyllabus(sections) {
  const section = findSection(sections, '3.3 consolidated syllabus')
  if (!section) return {}
  const [table] = parseAllTables(section.body)
  if (!table) return {}
  const bySubjectName = {}
  for (const row of table) {
    bySubjectName[row['Subject Domain']] = {
      coreOverlapTopics: row['Core JAM+JEST Overlap'],
      jestExclusiveTopics: row['JEST-Exclusive/Advanced Emphasis'],
    }
  }
  return bySubjectName
}

/**
 * Section 9.1 — Subject Summary table (used for deadlines):
 * Subject | Weightage (Approx.) | Priority | Deadline (Core Completion) | JAM Relevance | JEST Relevance
 */
function parseSubjectDeadlines(sections) {
  const section = findSection(sections, '9.1 subject summary')
  if (!section) return {}
  const [table] = parseAllTables(section.body)
  if (!table) return {}
  const bySubjectName = {}
  for (const row of table) {
    bySubjectName[row['Subject']] = row['Deadline (Core Completion)']
  }
  return bySubjectName
}

/**
 * Section 9.3 — Resource Summary table:
 * Subject | Primary Book | Primary Video Resource | Difficulty
 */
function parsePrimaryResources(sections) {
  const section = findSection(sections, '9.3 resource summary')
  if (!section) return {}
  const [table] = parseAllTables(section.body)
  if (!table) return {}
  const bySubjectName = {}
  for (const row of table) {
    bySubjectName[row['Subject']] = {
      primaryBook: row['Primary Book'],
      primaryVideo: row['Primary Video Resource'],
    }
  }
  return bySubjectName
}

/**
 * Section 5.3 — Month-by-Month Roadmap:
 * Month | Phase | Primary Focus | Intensity | Notes
 */
function parseRoadmap(sections) {
  const section = findSection(sections, '5.3 month-by-month roadmap')
  if (!section) return []
  const [table] = parseAllTables(section.body)
  if (!table) return []
  return table.map((row) => ({
    month: row['Month'],
    phase: row['Phase'],
    focus: row['Primary Focus'],
    intensity: row['Intensity'],
    notes: row['Notes'],
  }))
}

/**
 * Section 9.4 — High-Yield Checklist:
 * Rank | Topic | Subject | Rationale for Rank
 */
function parseHighYieldChecklist(sections) {
  const section = findSection(sections, '9.4 high-yield checklist')
  if (!section) return []
  const [table] = parseAllTables(section.body)
  if (!table) return []
  return table.map((row) => ({
    rank: Number(row['Rank']) || 0,
    topic: row['Topic'],
    subject: row['Subject'],
    rationale: row['Rationale for Rank'],
  }))
}

/**
 * Section 1.1 — Latest Exam Pattern table:
 * Section | No. of Questions | Question Type | Marks/Q (Correct) | Marks/Q (Incorrect) | Total Marks
 */
function parseExamPattern(sections) {
  const section = findSection(sections, '1.1 latest exam pattern')
  if (!section) return null
  const [table] = parseAllTables(section.body)
  if (!table) return null
  const sectionRows = table.filter((row) => !/^\*\*Total/i.test(row['Section'] ?? ''))
  return {
    sections: sectionRows.map((row) => ({
      name: row['Section'],
      questions: Number(row['No. of Questions']) || 0,
      type: row['Question Type'],
      marksCorrect: row['Marks/Q (Correct)'],
      marksIncorrect: row['Marks/Q (Incorrect)'],
      totalMarks: row['Total Marks'],
    })),
  }
}

/** Maps a section-2 subject-domain heading name to the canonical subject name used across the blueprint. */
const HEADING_NAME_OVERRIDES = {
  'Atomic, Molecular, Nuclear & Particle Physics': 'Atomic, Molecular, Nuclear & Particle Physics',
  'Thermodynamics & Statistical Mechanics': 'Thermodynamics & Statistical Mechanics',
}

function canonicalSubjectName(name) {
  return HEADING_NAME_OVERRIDES[name] ?? name
}

/**
 * Given the blueprint's chapter tables are organized per *domain*, but this
 * app models "Thermodynamics" and "Statistical Mechanics" as two distinct
 * subjects (an existing, pre-Sprint-17 navigation decision this sprint must
 * not redesign), the four Thermo+StatMech chapters are split here:
 * the two thermodynamic-law chapters -> Thermodynamics, the two
 * ensemble/statistics chapters -> Statistical Mechanics.
 */
function splitThermoAndStatMech(chapters) {
  const thermoNames = new Set(['Laws of Thermodynamics & Maxwell Relations', 'Phase Transitions'])
  const thermo = chapters.filter((c) => thermoNames.has(c.name))
  const statMech = chapters.filter((c) => !thermoNames.has(c.name))
  return { thermo, statMech }
}

/**
 * Assembles the full subject list by joining every section's per-subject
 * fragments (overview, chapter tables, consolidated syllabus, deadlines,
 * primary resources) on subject name.
 */
function assembleSubjects(sections) {
  const overview = parseSubjectOverview(sections)
  const chapterTables = parseChapterTables(sections)
  const consolidated = parseConsolidatedSyllabus(sections)
  const deadlines = parseSubjectDeadlines(sections)
  const primaryResources = parsePrimaryResources(sections)

  const subjects = []

  const { thermo, statMech } = splitThermoAndStatMech(
    chapterTables['Thermodynamics & Statistical Mechanics'] ?? [],
  )

  const domainToChapters = {
    'Mathematical Methods': chapterTables['Mathematical Methods'] ?? [],
    'Classical Mechanics': chapterTables['Classical Mechanics'] ?? [],
    Electromagnetism: chapterTables['Electromagnetism'] ?? [],
    'Quantum Mechanics': chapterTables['Quantum Mechanics'] ?? [],
    Thermodynamics: thermo,
    'Statistical Mechanics': statMech,
    Electronics: chapterTables['Electronics'] ?? [],
    'Solid State Physics': chapterTables['Solid State Physics'] ?? [],
    'Atomic, Molecular, Nuclear & Particle Physics':
      chapterTables['Atomic, Molecular, Nuclear & Particle Physics'] ?? [],
    Optics: chapterTables['Optics'] ?? [],
  }

  // Section 2.1's own table header text — this section uses slightly
  // different subject-domain phrasing than sections 3.3 / 9.1 / 9.3 do.
  const overviewKeyFor = {
    'Mathematical Methods': 'Mathematical Methods',
    'Classical Mechanics': 'Classical Mechanics',
    Electromagnetism: 'Electromagnetism',
    'Quantum Mechanics': 'Quantum Mechanics',
    Thermodynamics: 'Thermodynamics & Statistical Mechanics',
    'Statistical Mechanics': 'Thermodynamics & Statistical Mechanics',
    Electronics: 'Electronics (Analog/Digital)',
    'Solid State Physics': 'Solid State Physics',
    'Atomic, Molecular, Nuclear & Particle Physics': 'Atomic, Molecular & Nuclear/Particle Physics',
    Optics: 'Optics',
  }

  const consolidatedKeyFor = {
    'Mathematical Methods': 'Mathematical Methods',
    'Classical Mechanics': 'Classical Mechanics',
    Electromagnetism: 'Electromagnetism',
    'Quantum Mechanics': 'Quantum Mechanics',
    Thermodynamics: 'Thermodynamics & Stat Mech',
    'Statistical Mechanics': 'Thermodynamics & Stat Mech',
    Electronics: 'Electronics',
    'Solid State Physics': 'Solid State Physics',
    'Atomic, Molecular, Nuclear & Particle Physics': 'Atomic/Nuclear/Particle Physics',
    Optics: 'Optics',
  }

  for (const [name, chapters] of Object.entries(domainToChapters)) {
    if (!chapters.length) continue
    const overviewInfo = overview[overviewKeyFor[name]] ?? {}
    const consolidatedInfo = consolidated[consolidatedKeyFor[name]] ?? {}
    const deadline =
      deadlines[consolidatedKeyFor[name]] ?? deadlines[overviewKeyFor[name]] ?? deadlines[name] ?? ''
    const primary =
      primaryResources[consolidatedKeyFor[name]] ?? primaryResources[overviewKeyFor[name]] ?? primaryResources[name] ?? {}

    subjects.push({
      name: canonicalSubjectName(name),
      weightageRange: overviewInfo.weightageRange ?? '',
      priority: overviewInfo.priority ?? 'Medium',
      difficultyOverall: overviewInfo.difficultyOverall ?? 'Medium',
      jamOverlap: overviewInfo.jamOverlap ?? 'Medium',
      deadline,
      primaryBook: primary.primaryBook ?? '',
      primaryVideo: primary.primaryVideo ?? '',
      coreOverlapTopics: consolidatedInfo.coreOverlapTopics ?? '',
      jestExclusiveTopics: consolidatedInfo.jestExclusiveTopics ?? '',
      chapters,
      resources: { books: [], videos: [], solutionManuals: [] },
    })
  }

  return subjects
}

/**
 * Entry point 1: parse the raw Markdown blueprint into BlueprintData.
 * Resource (book/video) detail is intentionally left for the JSON source
 * or a richer future Markdown convention — this generic table extractor
 * focuses on the structured tables (weightage, chapters, roadmap,
 * high-yield checklist) that follow a strict tabular convention. Callers
 * that need book/video detail should merge with `mergeResourceDetail`.
 */
export function parseBlueprintMarkdown(markdownText) {
  const sections = splitIntoSections(markdownText)

  const titleMatch = /^#\s+(.*)$/m.exec(markdownText)
  const trackMatch = /^###\s+(.*)$/m.exec(markdownText)

  const raw = {
    meta: {
      title: titleMatch?.[1]?.trim() ?? 'JEST Blueprint',
      track: trackMatch?.[1]?.trim() ?? '',
    },
    examPattern: parseExamPattern(sections),
    subjects: assembleSubjects(sections),
    roadmap: parseRoadmap(sections),
    highYieldChecklist: parseHighYieldChecklist(sections),
  }

  return normalizeBlueprintData(raw)
}

/**
 * Entry point 2: parse/normalize a JSON blueprint (object or raw JSON text)
 * into the exact same BlueprintData shape as the Markdown parser. This is
 * the extension point a future "replace the file" JSON update relies on —
 * no other code changes.
 */
export function parseBlueprintJSON(jsonInput) {
  const raw = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput
  return normalizeBlueprintData(raw)
}

/**
 * Merges richer resource detail (books/videos/solutionManuals per subject,
 * normally sourced from the JSON blueprint which encodes it far more
 * reliably than free-form Markdown prose) into an already-parsed
 * BlueprintData object, matched by subject name.
 */
export function mergeResourceDetail(blueprintData, resourcesBySubjectName) {
  return {
    ...blueprintData,
    subjects: blueprintData.subjects.map((subject) => {
      const detail = resourcesBySubjectName[subject.name]
      if (!detail) return subject
      return {
        ...subject,
        resources: {
          books: detail.books ?? subject.resources.books,
          videos: detail.videos ?? subject.resources.videos,
          solutionManuals: detail.solutionManuals ?? subject.resources.solutionManuals,
        },
      }
    }),
  }
}
