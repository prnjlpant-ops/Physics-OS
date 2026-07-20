import { SYLLABUS_LEVELS, TOPIC_STATUS } from '../constants/syllabusConstants'
import {
  mapDifficulty,
  mapImportance,
  mapPriority,
  mapRevisionStatus,
  estimateStudyTime,
  estimateProblemSolvingTime,
} from './blueprintModel'

/**
 * SYLLABUS ENGINE
 * ================
 * A source-agnostic tree engine for the Exam → Subject → Unit → Chapter →
 * Topic → Subtopic hierarchy. This file has no knowledge of JEST, IIT JAM,
 * or any specific subject — it only knows how to build, traverse, and
 * search a generic tree of nodes.
 *
 * Sprint 16 goal: the UI (Explorer, Topic Dashboard, filters, progress)
 * is built entirely against this engine's shape. Sprint 17 will add real
 * data by producing the SAME node shape from a JSON or Markdown blueprint
 * — no component in src/pages/syllabus or src/components/syllabus should
 * need to change when that happens.
 *
 * Node shape:
 * {
 *   id: string            // stable, unique, derived from the ancestor path
 *   level: 'exam' | 'subject' | 'unit' | 'chapter' | 'topic' | 'subtopic'
 *   name: string
 *   slug: string
 *   metadata: object       // free-form, level-specific (see syllabusData.js)
 *   children: Node[]
 * }
 */

/** Deterministically derives a globally-unique id from a parent id + slug. */
export function buildNodeId(parentId, slug) {
  return parentId ? `${parentId}__${slug}` : slug
}

/**
 * Builds a node. `parentId` must be the id of the node this one will be
 * attached under (or null for a root) — callers building a tree top-down
 * should compute this node's id via `buildNodeId` first if its children
 * need to reference it, then pass already-built children here.
 */
export function createNode({ level, name, slug, metadata = {}, children = [], parentId = null }) {
  if (!SYLLABUS_LEVELS.includes(level)) {
    throw new Error(`Unknown syllabus level: "${level}"`)
  }

  return {
    id: buildNodeId(parentId, slug),
    level,
    name,
    slug,
    metadata,
    parentId,
    children,
  }
}

/** Depth-first walk over every node in the tree, calling visit(node, ancestors). */
export function walkTree(roots, visit, ancestors = []) {
  roots.forEach((node) => {
    visit(node, ancestors)
    if (node.children?.length) {
      walkTree(node.children, visit, [...ancestors, node])
    }
  })
}

/** Returns a flat array of every node at the given level, each annotated with `ancestors`. */
export function getNodesAtLevel(roots, level) {
  const results = []
  walkTree(roots, (node, ancestors) => {
    if (node.level === level) {
      results.push({ ...node, ancestors })
    }
  })
  return results
}

/** Returns every node in the tree, flattened, each annotated with `ancestors`. */
export function flattenTree(roots) {
  const results = []
  walkTree(roots, (node, ancestors) => {
    results.push({ ...node, ancestors })
  })
  return results
}

/** Finds a single node (with ancestors) by its id, across the whole tree. */
export function findNodeById(roots, id) {
  let found = null
  walkTree(roots, (node, ancestors) => {
    if (!found && node.id === id) {
      found = { ...node, ancestors }
    }
  })
  return found
}

/** Builds the breadcrumb ["Exam", "Subject", ... "Topic"] for a node with ancestors. */
export function getBreadcrumb(nodeWithAncestors) {
  return [...(nodeWithAncestors.ancestors ?? []), nodeWithAncestors].map((node) => node.name)
}

/**
 * Returns a pruned copy of the tree containing only branches that lead to
 * a node accepted by `predicate`. Used by the Explorer's search + filters
 * so parent containers stay visible while non-matching leaves are hidden.
 */
export function pruneTree(roots, predicate) {
  return roots
    .map((node) => {
      const prunedChildren = node.children?.length ? pruneTree(node.children, predicate) : []
      const keepSelf = predicate(node)
      if (!keepSelf && prunedChildren.length === 0) return null
      return { ...node, children: prunedChildren }
    })
    .filter(Boolean)
}

/**
 * ---------------------------------------------------------------------
 * Data loaders (Sprint 17 — JEST Blueprint Import Engine)
 * ---------------------------------------------------------------------
 * Implemented for real in Sprint 17. Both loaders take a normalized
 * `BlueprintData` object (see engine/blueprintModel.js — the same shape
 * regardless of whether it came from Markdown or JSON) and build the
 * Exam -> Subject -> Unit -> Chapter -> Topic -> Subtopic tree using the
 * exact `createNode` shape the placeholder tree already used, so no
 * component in src/pages/syllabus or src/components/syllabus needed to
 * change when real data arrived.
 *
 * "Unit" here maps to the blueprint's own Core JAM+JEST Overlap vs
 * JEST-Exclusive/Advanced grouping (blueprint section 3) — the one
 * structural subdivision above Chapter the blueprint actually defines.
 * "Topic" and "Subtopic" are generated per chapter from its own
 * weightage/difficulty/PYQ-frequency/math-prerequisite fields, since the
 * blueprint does not subdivide further than Chapter.
 */
const EXAM_DEFINITIONS = [
  { id: 'iit-jam', name: 'IIT JAM Physics' },
  { id: 'jest', name: 'JEST Physics' },
]

function buildLinkedModules(subjectId, chapterSlug) {
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

function buildSubtopics(parentId, chapter) {
  const entries = [
    { label: 'Math Prerequisites', summary: chapter.mathPrerequisites || 'Not specified in the blueprint.' },
    { label: 'Typical Question Style', summary: chapter.questionStyle || 'Not specified in the blueprint.' },
  ]
  return entries.map((entry, index) =>
    createNode({
      level: 'subtopic',
      name: entry.label,
      slug: `${chapter.slug}-subtopic-${index}`,
      parentId,
      metadata: { summary: entry.summary },
    }),
  )
}

function buildTopicsForChapter(parentId, subjectId, subjectName, chapter) {
  const difficulty = mapDifficulty(chapter.difficulty)
  const importance = mapImportance(chapter.highYieldStars)
  const priority = mapPriority(chapter.pyqFrequency?.includes('Frequently') ? 'High' : chapter.weightage)

  const topicDefinitions = [
    {
      label: 'Concept & Derivation',
      summary: `Core concepts and derivations for ${chapter.name}.`,
    },
    {
      label: 'Problem Solving & PYQs',
      summary: `Problem-solving practice and PYQ-style application of ${chapter.name}.`,
    },
  ]

  return topicDefinitions.map((definition, index) => {
    const slug = `${chapter.slug}-${index === 0 ? 'concept' : 'practice'}`
    const topicId = buildNodeId(parentId, slug)

    return createNode({
      level: 'topic',
      name: `${chapter.name}: ${definition.label}`,
      slug,
      parentId,
      metadata: {
        estimatedStudyTime: estimateStudyTime(difficulty),
        estimatedProblemSolvingTime: estimateProblemSolvingTime(difficulty),
        importance,
        difficulty,
        priority,
        status: TOPIC_STATUS.NOT_STARTED,
        revisionStatus: mapRevisionStatus(),
        subjectId,
        subjectName,
        chapterSlug: chapter.slug,
        chapterName: chapter.name,
        weightage: chapter.weightage,
        pyqFrequency: chapter.pyqFrequency,
        highYieldStars: chapter.highYieldStars,
        commonMisconceptions: chapter.commonMisconceptions,
        linkedModules: buildLinkedModules(subjectId, chapter.slug),
      },
      children: index === 0 ? buildSubtopics(topicId, chapter) : [],
    })
  })
}

function buildChapterNode(parentId, subjectId, subjectName, chapter) {
  const chapterId = buildNodeId(parentId, chapter.slug)

  return createNode({
    level: 'chapter',
    name: chapter.name,
    slug: chapter.slug,
    parentId,
    metadata: {
      subjectId,
      weightage: chapter.weightage,
      pyqFrequency: chapter.pyqFrequency,
      difficulty: chapter.difficulty,
      highYieldStars: chapter.highYieldStars,
    },
    children: buildTopicsForChapter(chapterId, subjectId, subjectName, chapter),
  })
}

/** Splits a subject's chapters into the blueprint's own Core Overlap vs JEST-Exclusive grouping (section 3). */
function splitCoreAndExclusive(subject) {
  const exclusiveNames = new Set(
    (subject.jestExclusiveTopics || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  )

  const isExclusive = (chapterName) => {
    const lower = chapterName.toLowerCase()
    for (const fragment of exclusiveNames) {
      if (fragment && (lower.includes(fragment) || fragment.includes(lower))) return true
    }
    return false
  }

  const exclusive = subject.chapters.filter((c) => isExclusive(c.name))
  const core = subject.chapters.filter((c) => !isExclusive(c.name))
  // Guarantee every chapter appears somewhere even if the free-text match misses.
  return core.length ? { core, exclusive } : { core: subject.chapters, exclusive: [] }
}

function buildUnitsForSubject(parentId, subjectId, subject) {
  const { core, exclusive } = splitCoreAndExclusive(subject)
  const units = []

  if (core.length) {
    const unitSlug = `${subject.id}-core-overlap`
    const unitId = buildNodeId(parentId, unitSlug)
    units.push(
      createNode({
        level: 'unit',
        name: 'Core JAM + JEST Overlap',
        slug: unitSlug,
        parentId,
        metadata: { subjectId },
        children: core.map((chapter) => buildChapterNode(unitId, subjectId, subject.name, chapter)),
      }),
    )
  }

  if (exclusive.length) {
    const unitSlug = `${subject.id}-jest-exclusive`
    const unitId = buildNodeId(parentId, unitSlug)
    units.push(
      createNode({
        level: 'unit',
        name: 'JEST-Exclusive / Advanced',
        slug: unitSlug,
        parentId,
        metadata: { subjectId },
        children: exclusive.map((chapter) => buildChapterNode(unitId, subjectId, subject.name, chapter)),
      }),
    )
  }

  return units
}

function buildSubjectNode(parentId, subject) {
  const subjectId = buildNodeId(parentId, subject.id)

  return createNode({
    level: 'subject',
    name: subject.name,
    slug: subject.id,
    parentId,
    metadata: { subjectId: subject.id, icon: subject.icon },
    children: buildUnitsForSubject(subjectId, subject.id, subject),
  })
}

function buildExamNode(examDefinition, subjectsWithIcons) {
  const examId = buildNodeId(null, examDefinition.id)

  return createNode({
    level: 'exam',
    name: examDefinition.name,
    slug: examDefinition.id,
    parentId: null,
    metadata: {},
    children: subjectsWithIcons.map((subject) => buildSubjectNode(examId, subject)),
  })
}

/**
 * Builds the full Exam -> Subject -> Unit -> Chapter -> Topic -> Subtopic
 * tree from an already-normalized `BlueprintData` object, regardless of
 * whether it was parsed from Markdown or JSON.
 *
 * `subjectsWithIcons` additionally carries the app-shaped `icon` per
 * subject (from blueprintMappingLayer) purely for the tree's `metadata.icon`
 * — the blueprint itself has no concept of an icon.
 */
function buildTreeFromBlueprintData(blueprintData, subjectsWithIcons) {
  const iconById = Object.fromEntries(subjectsWithIcons.map((s) => [s.id, s.icon]))
  const subjectsForTree = blueprintData.subjects.map((subject) => ({
    ...subject,
    icon: iconById[subject.id] ?? null,
  }))

  return EXAM_DEFINITIONS.map((exam) => buildExamNode(exam, subjectsForTree))
}

/**
 * Loads the syllabus tree from an already-normalized BlueprintData object
 * that was parsed from a JSON blueprint source.
 */
export function loadSyllabusFromJSON(blueprintData, subjectsWithIcons) {
  return buildTreeFromBlueprintData(blueprintData, subjectsWithIcons)
}

/**
 * Loads the syllabus tree from an already-normalized BlueprintData object
 * that was parsed from a Markdown blueprint source. Both loaders are
 * identical once the source has been normalized — the distinction is kept
 * as two named entry points so callers can be explicit about provenance.
 */
export function loadSyllabusFromMarkdown(blueprintData, subjectsWithIcons) {
  return buildTreeFromBlueprintData(blueprintData, subjectsWithIcons)
}
