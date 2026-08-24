import blueprintMarkdown from '../data/blueprint/JEST_2027_Master_Blueprint.md?raw'
import blueprintJSON from '../data/blueprint/jestBlueprint.json'
import { BookOpen, Zap, Atom, Thermometer, BarChart3, Cpu, Layers, Eye } from 'lucide-react'
import { parseBlueprintMarkdown, parseBlueprintJSON, mergeResourceDetail } from './blueprintParser'

/**
 * BLUEPRINT SERVICE
 * =================
 * Sprint 17 — JEST Blueprint Import Engine.
 * Updated for Curriculum Refinement: Excel workbook (JEST-JAM-video-links.xlsx)
 * is now the authoritative source of truth, imported as jestBlueprint.json.
 *
 * The single place the rest of the app talks to for blueprint data.
 * Everything else (constants/subjects.js, syllabusData.js, resourcesData.js,
 * the Roadmap page) calls a getter here — never the parser or the raw
 * files directly.
 *
 * Source of truth: the Excel workbook (JEST-JAM-video-links.xlsx) is now the
 * authoritative source. It is read and converted to jestBlueprint.json via
 * scripts/generateBlueprint.js. The blueprint JSON drives the complete syllabus
 * structure (subjects, chapters, resources, roadmap).
 *
 * ARCHITECTURE NOTE (per PRD): to update the syllabus in a future sprint,
 * update `JEST-JAM-video-links.xlsx`, then run `node scripts/generateBlueprint.js`
 * to regenerate `jestBlueprint.json` in `src/data/blueprint/`.
 * Nothing in `src/pages` or `src/components` needs to change, because
 * everything is read through the getters below.
 */

let cachedBlueprint = null

function loadBlueprint() {
  // Excel-derived JSON is now the authoritative source
  const fromJSON = parseBlueprintJSON(blueprintJSON)
  
  // Markdown is kept for backward compatibility and can provide enrichment
  let fromMarkdown = null
  try {
    fromMarkdown = parseBlueprintMarkdown(blueprintMarkdown)
  } catch (e) {
    // If Markdown doesn't parse, that's OK — we have JSON from Excel
    fromMarkdown = { subjects: [], roadmap: [], highYieldChecklist: [] }
  }

  const resourcesBySubjectName = {}
  for (const subject of fromJSON.subjects) {
    resourcesBySubjectName[subject.name] = subject.resources
  }

  // JSON from Excel is the primary source for syllabus structure
  // Markdown is only used for enrichment if it's well-formed
  const primarySubjects = fromJSON.subjects.length > 0 ? fromJSON.subjects : fromMarkdown.subjects

  // Backfill enrichment from Markdown if available (weightage, priority, etc.)
  const enrichedSubjects = primarySubjects.map((subject) => {
    const markdownMatch = fromMarkdown.subjects?.find((s) => s.name === subject.name)
    return {
      ...subject,
      weightageRange: subject.weightageRange || markdownMatch?.weightageRange || '',
      priority: subject.priority || markdownMatch?.priority || 'Medium',
      jamOverlap: subject.jamOverlap || markdownMatch?.jamOverlap || 'Medium',
      deadline: subject.deadline || markdownMatch?.deadline || '',
      primaryBook: subject.primaryBook || markdownMatch?.primaryBook || '',
      primaryVideo: subject.primaryVideo || markdownMatch?.primaryVideo || '',
      coreOverlapTopics: subject.coreOverlapTopics || markdownMatch?.coreOverlapTopics || '',
      jestExclusiveTopics: subject.jestExclusiveTopics || markdownMatch?.jestExclusiveTopics || '',
    }
  })

  const withResources = mergeResourceDetail(
    { ...fromJSON, subjects: enrichedSubjects },
    resourcesBySubjectName,
  )

  return {
    ...withResources,
    examPattern: fromJSON.examPattern ?? fromMarkdown.examPattern,
    roadmap: fromMarkdown.roadmap?.length > 0 ? fromMarkdown.roadmap : fromJSON.roadmap ?? [],
    highYieldChecklist: fromMarkdown.highYieldChecklist?.length > 0 ? fromMarkdown.highYieldChecklist : fromJSON.highYieldChecklist ?? [],
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
  'math-methods': {
    icon: BookOpen,
    description: 'Mathematical tools and techniques for physics problem solving.',
  },
  'mechanics': {
    icon: Zap,
    description: 'Motion, forces, and the laws governing physical systems.',
  },
  'special-relativity': {
    icon: Zap,
    description: 'Relativistic mechanics and the foundations of special relativity.',
  },
  'em-theory': {
    icon: Zap,
    description: 'Electricity, magnetism, and electromagnetic field theory.',
  },
  'waves-optics': {
    icon: Eye,
    description: 'Wave phenomena, diffraction, interference, and optics.',
  },
  'quantum-mechanics': {
    icon: Atom,
    description: 'Foundations of quantum theory and its physical applications.',
  },
  'thermo-statmech': {
    icon: Thermometer,
    description: 'Heat, energy, thermodynamics, and statistical mechanics.',
  },
  'electronics': {
    icon: Cpu,
    description: 'Circuit analysis, devices, and signal processing fundamentals.',
  },
  'atomic-molecular': {
    icon: Atom,
    description: 'Atomic, molecular, and physics of small systems.',
  },
  'condensed-matter': {
    icon: Layers,
    description: 'Crystal structures, semiconductors, and condensed matter phenomena.',
  },
  'nuclear-particle': {
    icon: Atom,
    description: 'Nuclear and particle physics concepts.',
  },
}

// Legacy mappings for backward compatibility
const LEGACY_SUBJECT_MAPPINGS = {
  'mathematical-methods': 'math-methods',
  'classical-mechanics': 'mechanics',
  'electromagnetism': 'em-theory',
  'solid-state-physics': 'condensed-matter',
  'atomic-molecular-nuclear-particle-physics': 'nuclear-particle',
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

/**
 * ENHANCED BLUEPRINT GETTERS
 * =========================
 * Access complete topic metadata from Excel including:
 * - Study notes with book chapters, timing, and practice structure
 * - Video links (Pravegaa, NPTEL) with source and link type
 * - Roadmap phases and exam relevance (JAM, JEST, JAM+JEST)
 * - All subsections and related resources per topic
 */

export function getEnhancedBlueprint() {
  return blueprintEnhanced
}

export function getEnhancedSubject(subjectId) {
  return blueprintEnhanced.subjects.find((s) => s.id === subjectId) ?? null
}

export function getEnhancedChapter(subjectId, chapterSlug) {
  const subject = getEnhancedSubject(subjectId)
  return subject?.chapters.find((c) => c.slug === chapterSlug) ?? null
}

export function getTopicMetadata(subjectId, chapterSlug, topicSlug) {
  const chapter = getEnhancedChapter(subjectId, chapterSlug)
  if (!chapter) return null
  
  const topic = chapter.topics.find((t) => t.slug === topicSlug)
  if (!topic) return null

  return {
    name: topic.name,
    chapter: topic.chapter,
    exams: topic.exams, // ['JAM', 'JEST'] or ['JAM+JEST']
    roadmapPhase: topic.roadmapPhase,
    source: topic.source,
    videoLink: topic.videoLink,
    linkType: topic.linkType,
    studyNotes: topic.studyNotes // Complete study plan with book chapters, timing, PYQ practice
  }
}

export function getAllTopicsInSubject(subjectId) {
  const subject = getEnhancedSubject(subjectId)
  if (!subject) return []
  
  const topics = []
  subject.chapters.forEach((chapter) => {
    chapter.topics.forEach((topic) => {
      topics.push({
        ...topic,
        subjectId,
        chapterSlug: chapter.slug
      })
    })
  })
  return topics
}

export function getTopicsForExam(exam) {
  // exam: 'JAM', 'JEST', or 'JAM+JEST'
  const topics = []
  blueprintEnhanced.subjects.forEach((subject) => {
    subject.chapters.forEach((chapter) => {
      chapter.topics.forEach((topic) => {
        if (topic.exams.includes(exam) || topic.exams.includes('JAM+JEST')) {
          topics.push({
            ...topic,
            subjectId: subject.id,
            subjectName: subject.name,
            chapterSlug: chapter.slug
          })
        }
      })
    })
  })
  return topics
}

export function getStudyNotesByTopic(subjectId, chapterSlug, topicSlug) {
  const topic = getTopicMetadata(subjectId, chapterSlug, topicSlug)
  return topic?.studyNotes ?? ''
}

export function getResourceLinksByTopic(subjectId, chapterSlug, topicSlug) {
  const topic = getTopicMetadata(subjectId, chapterSlug, topicSlug)
  if (!topic) return { videoLink: '', videoSource: '', linkType: '' }
  
  return {
    videoLink: topic.videoLink,
    videoSource: topic.source,
    linkType: topic.linkType
  }
}
