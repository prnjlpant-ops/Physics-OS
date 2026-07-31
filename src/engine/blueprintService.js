import blueprintMarkdown from '../data/blueprint/JEST_2027_Master_Blueprint.md?raw'
import blueprintJSON from '../data/blueprint/jestBlueprint.json'
import { BookOpen, Zap, Atom, Thermometer, BarChart3, Cpu, Layers, Eye } from 'lucide-react'
import { parseBlueprintMarkdown, parseBlueprintJSON, mergeResourceDetail } from './blueprintParser'

/**
 * BLUEPRINT SERVICE
 * =================
 * Sprint 17 — JEST Blueprint Import Engine.
 *
 * The single place the rest of the app talks to for blueprint data.
 * Everything else (constants/subjects.js, syllabusData.js, resourcesData.js,
 * the Roadmap page) calls a getter here — never the parser or the raw
 * files directly.
 *
 * Source of truth: the Markdown blueprint drives the syllabus structure
 * (subjects, chapters, weightage, priority, roadmap, high-yield checklist),
 * since that is the document that gets updated over the course of
 * preparation. Book/video/solution-manual detail is merged in from the
 * companion JSON file, since that is the more reliable representation
 * of resource "records" (title/author/tier) for tabular data.
 *
 * ARCHITECTURE NOTE (per PRD): to update the syllabus in a future sprint,
 * replace `JEST_2027_Master_Blueprint.md` and/or `jestBlueprint.json` in
 * `src/data/blueprint/` — nothing in `src/pages` or `src/components` needs
 * to change, because everything is read through the getters below.
 */

let cachedBlueprint = null

function loadBlueprint() {
  const fromMarkdown = parseBlueprintMarkdown(blueprintMarkdown)
  const fromJSON = parseBlueprintJSON(blueprintJSON)

  const resourcesBySubjectName = {}
  for (const subject of fromJSON.subjects) {
    resourcesBySubjectName[subject.name] = subject.resources
  }

  // Prefer the Markdown-derived syllabus structure (source of truth), but
  // backfill anything a subject is missing (weightage/deadline/etc.) from
  // the JSON companion, and always take resource detail from JSON.
  const jsonSubjectsByName = Object.fromEntries(fromJSON.subjects.map((s) => [s.name, s]))

  const mergedSubjects = fromMarkdown.subjects.length
    ? fromMarkdown.subjects.map((subject) => {
        const jsonMatch = jsonSubjectsByName[subject.name]
        return {
          ...subject,
          weightageRange: subject.weightageRange || jsonMatch?.weightageRange || '',
          deadline: subject.deadline || jsonMatch?.deadline || '',
          primaryBook: subject.primaryBook || jsonMatch?.primaryBook || '',
          primaryVideo: subject.primaryVideo || jsonMatch?.primaryVideo || '',
          coreOverlapTopics: subject.coreOverlapTopics || jsonMatch?.coreOverlapTopics || '',
          jestExclusiveTopics: subject.jestExclusiveTopics || jsonMatch?.jestExclusiveTopics || '',
        }
      })
    : fromJSON.subjects

  const withResources = mergeResourceDetail(
    { ...fromMarkdown, subjects: mergedSubjects },
    resourcesBySubjectName,
  )

  return {
    ...withResources,
    examPattern: fromMarkdown.examPattern ?? fromJSON.examPattern,
    roadmap: fromMarkdown.roadmap.length ? fromMarkdown.roadmap : fromJSON.roadmap,
    highYieldChecklist: fromMarkdown.highYieldChecklist.length
      ? fromMarkdown.highYieldChecklist
      : fromJSON.highYieldChecklist,
  }
}

/** Returns the fully parsed, merged, cached BlueprintData object. */
export function getBlueprintData() {
  if (!cachedBlueprint) {
    cachedBlueprint = loadBlueprint()
  }
  return cachedBlueprint
}

/** Forces a re-parse — useful if a future settings screen lets someone swap the source file at runtime. */
export function reloadBlueprintData() {
  cachedBlueprint = null
  return getBlueprintData()
}

export function getBlueprintSubjects() {
  return getBlueprintData().subjects
}

export function getBlueprintSubjectByName(name) {
  return getBlueprintData().subjects.find((subject) => subject.name === name) ?? null
}

export function getBlueprintExamPattern() {
  return getBlueprintData().examPattern
}

export function getBlueprintRoadmap() {
  return getBlueprintData().roadmap
}

const SUBJECT_METADATA = {
  'mathematical-methods': {
    icon: BookOpen,
    description: 'Mathematical tools and techniques for physics problem solving.',
  },
  'classical-mechanics': {
    icon: Zap,
    description: 'Motion, forces, and the laws governing physical systems.',
  },
  electromagnetism: {
    icon: Zap,
    description: 'Electricity, magnetism, and electromagnetic field theory.',
  },
  'quantum-mechanics': {
    icon: Atom,
    description: 'Foundations of quantum theory and its physical applications.',
  },
  thermodynamics: {
    icon: Thermometer,
    description: 'Heat, energy, and the laws of thermodynamic systems.',
  },
  'statistical-mechanics': {
    icon: BarChart3,
    description: 'Statistical principles that underlie thermodynamics and many-body physics.',
  },
  electronics: {
    icon: Cpu,
    description: 'Circuit analysis, devices, and signal processing fundamentals.',
  },
  'solid-state-physics': {
    icon: Layers,
    description: 'Crystal structures, semiconductors, and condensed matter phenomena.',
  },
  'atomic-molecular-nuclear-particle-physics': {
    icon: Atom,
    description: 'Atomic, molecular, nuclear and particle physics concepts.',
  },
  optics: {
    icon: Eye,
    description: 'Wave optics, ray optics, and the behavior of light.',
  },
}

const DEFAULT_SUBJECT_METADATA = {
  icon: BookOpen,
  description: 'A core subject from the JEST blueprint.',
}

function decorateSubject(subject) {
  const metadata = SUBJECT_METADATA[subject.id] ?? DEFAULT_SUBJECT_METADATA
  return {
    ...subject,
    icon: subject.icon ?? metadata.icon,
    description: subject.description ?? metadata.description,
  }
}

function decorateSubjects(subjects) {
  return subjects.map(decorateSubject)
}

export function getBlueprintHighYieldChecklist() {
  return getBlueprintData().highYieldChecklist
}

export function getSubjects() {
  return decorateSubjects(getBlueprintSubjects())
}

export function getSubjectById(id) {
  return getSubjects().find((subject) => subject.id === id) ?? null
}

export function getChapters(subjectId) {
  const subject = getSubjectById(subjectId)
  return subject?.chapters ?? []
}

export function getChapter(subjectIdOrSlug, chapterSlug) {
  if (chapterSlug) {
    const subject = getSubjectById(subjectIdOrSlug)
    const chapter = subject?.chapters.find((c) => c.slug === chapterSlug) ?? null
    return chapter ? { subject, chapter } : null
  }

  const slug = subjectIdOrSlug
  for (const subject of getSubjects()) {
    const chapter = subject.chapters.find((c) => c.slug === slug)
    if (chapter) return { subject, chapter }
  }
  return null
}

export function getChapterBySlug(subjectId, chapterSlug) {
  return getChapter(subjectId, chapterSlug)
}

export function getTimeline() {
  return getBlueprintRoadmap()
}

export function getBlueprintChapter(subjectName, chapterSlug) {
  return getBlueprintSubjects().find((subject) => subject.name === subjectName)?.chapters.find((chapter) => chapter.slug === chapterSlug) ?? null
}

export function getPriority(subjectIdOrSlug, chapterSlug) {
  const found = getChapter(subjectIdOrSlug, chapterSlug)
  if (!found) return ''
  return found.subject.priority || found.chapter.weightage || ''
}

export function getDifficulty(subjectIdOrSlug, chapterSlug) {
  const found = getChapter(subjectIdOrSlug, chapterSlug)
  if (!found) return ''
  return found.chapter.difficulty || found.subject.difficultyOverall || ''
}

export function getResources(subjectIdOrSlug, chapterSlug) {
  const found = chapterSlug ? getChapter(subjectIdOrSlug, chapterSlug) : getChapter(subjectIdOrSlug)
  if (!found) return { books: [], videos: [], pdfs: [], solutionManuals: [], referenceMaterial: [], externalLinks: [] }
  const subject = found.subject
  const chapter = found.chapter
  const blueprintResources = getBlueprintSubjects().find((s) => s.id === subject.id)?.resources ?? { books: [], videos: [], solutionManuals: [] }

  const books = blueprintResources.books.length
    ? blueprintResources.books.map((book, index) => ({
        id: `${subject.id}__${chapter.slug}__books__${index}`,
        type: 'books',
        subjectId: subject.id,
        subjectName: subject.name,
        chapterSlug: chapter.slug,
        chapterName: chapter.name,
        title: `${chapter.name} — ${book.title}`,
        author: book.author ?? 'Author to be added',
        edition: book.tier ?? '—',
        status: 'Recommended (JEST 2027 Blueprint)',
      }))
    : []

  const videos = blueprintResources.videos.length
    ? blueprintResources.videos.map((video, index) => ({
        id: `${subject.id}__${chapter.slug}__videos__${index}`,
        type: 'videos',
        subjectId: subject.id,
        subjectName: subject.name,
        chapterSlug: chapter.slug,
        chapterName: chapter.name,
        title: `${chapter.name} — ${video.title}`,
        duration: video.duration ?? '—',
        source: video.title,
      }))
    : []

  const solutionManuals = blueprintResources.books.length
    ? [
        {
          id: `${subject.id}__${chapter.slug}__solutionManuals__0`,
          type: 'solutionManuals',
          subjectId: subject.id,
          subjectName: subject.name,
          chapterSlug: chapter.slug,
          chapterName: chapter.name,
          title: `${chapter.name} — ${blueprintResources.books[0].title} (Practice & Exercises)`,
          author: blueprintResources.books[0].author ?? 'Author to be added',
          edition: blueprintResources.books[0].tier ?? '—',
          status: 'Recommended (JEST 2027 Blueprint)',
        },
      ]
    : []

  return {
    books,
    videos,
    pdfs: [],
    solutionManuals,
    referenceMaterial: [],
    externalLinks: [],
  }
}
