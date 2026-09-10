import { SYLLABUS_LEVELS, TOPIC_STATUS } from '../constants/syllabusConstants'
import {
  mapDifficulty,
  mapImportance,
  mapPriority,
  mapRevisionStatus,
  estimateStudyTime,
  estimateProblemSolvingTime,
} from './blueprintModel'
import roadmapTopics from '../data/roadmap.json' with { type: 'json' }

function priorityFromRoadmapPhase(value, fallback) {
  const phase = String(value ?? '').toLowerCase()
  if (/\btopic\s*(?:[1-9]|1\d|20)\b/.test(phase) || phase.includes('supplemental')) return 'High'
  if (phase.includes('bonus') || phase.includes('tier 1')) return 'Medium'
  if (phase.includes('tier 2') || phase.includes('tier 3')) return 'Low'
  return fallback
}

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

import chapterToTopicMap from './chapterToTopicMap.json' with { type: 'json' }

function roadmapMetadataFor(chapterSlug) {
  const topicId = chapterToTopicMap[chapterSlug]
  if (!topicId) return null
  return roadmapTopics.find(t => t.id === topicId) || null
}

function v3RoadmapEntryFor(sourceTopic, subjectId) {
  const phase = String(sourceTopic?.roadmapPhase ?? '')
  const core = /^Topic\s+(\d+)/i.exec(phase)
  if (core) return roadmapTopics.find((item) => item.id === `phase-a-${core[1].padStart(2, '0')}`) ?? null

  const bonus = /Bonus\s*#?(\d+)/i.exec(phase)
  if (bonus) return roadmapTopics.find((item) => item.id === `phase-a-bonus-${bonus[1].padStart(2, '0')}`) ?? null

  // Phase B labels in v5 identify the tier, while the resource ID identifies
  // the item inside it. This map preserves v3's ranked order within a tier.
  const resourceId = String(sourceTopic?.resourceId ?? '')
  const phaseBId = [
    [/^S10-PhaseBTier1/, 'phase-b-tier-1-01'],
    [/^S4-PhaseBTier1/, 'phase-b-tier-1-02'],
    [/^S9-PhaseBTier1/, 'phase-b-tier-1-04'],
    [/^S1-PhaseBTier2-a/, 'phase-b-tier-2-05'],
    [/^S8-PhaseBTier2/, 'phase-b-tier-2-06'],
    [/^S1-PhaseBTier2-b/, 'phase-b-tier-2-07'],
    [/^S11-PhaseBTier2/, 'phase-b-tier-2-08'],
    [/^S6-PhaseBTier3/, 'phase-b-tier-3-09'],
    [/^S7-PhaseBTier3/, 'phase-b-tier-3-10'],
    [/^S11-PhaseBTier3/, 'phase-b-tier-3-11'],
  ].find(([pattern]) => pattern.test(resourceId))?.[1]

  if (phaseBId) return roadmapTopics.find((item) => item.id === phaseBId) ?? null
  return null
}

function v3StudyProfile(sourceTopic, subjectId, chapter, fallbackDifficulty, fallbackImportance, fallbackPriority) {
  const entry = v3RoadmapEntryFor(sourceTopic, subjectId)
  return {
    difficulty: entry?.difficulty ?? fallbackDifficulty,
    importance: entry?.importance ?? fallbackImportance,
    priority: entry?.priority ?? priorityFromRoadmapPhase(sourceTopic?.roadmapPhase, sourceTopic?.priority ?? fallbackPriority),
    roadmapOrder: entry?.order ?? Number.MAX_SAFE_INTEGER,
    phaseLabel: sourceTopic?.roadmapPhase ?? 'Unscheduled',
    subjectDifficulty: chapter.difficulty,
  }
}

function buildSubtopics(parentId, chapter, roadmapMetadata = null) {
  const entries = [
    { label: 'Math Prerequisites', summary: roadmapMetadata?.prerequisites || chapter.mathPrerequisites || 'Not specified in the blueprint.' },
    { label: 'Typical Question Style', summary: roadmapMetadata?.typicalQuestionStyle || chapter.questionStyle || 'Not specified in the blueprint.' },
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
  const roadmapMetadata = roadmapMetadataFor(chapter.slug)
  const difficulty = roadmapMetadata?.difficulty ?? mapDifficulty(chapter.difficulty)
  const importance = roadmapMetadata?.importance ?? mapImportance(chapter.highYieldStars)
  const fallbackPriority = chapter.priority ?? roadmapMetadata?.priority ?? mapPriority(chapter.pyqFrequency?.includes('Frequently') ? 'High' : chapter.weightage)

  const topicDefinitions = chapter.topics?.length ? chapter.topics.map((topic) => ({
    label: topic.name,
    slug: topic.resourceId || topic.slug,
    summary: topic.whatToCover || topic.additionalNotes || `Study ${topic.name}.`,
    sourceTopic: topic,
  })) : [
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
    const slug = definition.slug || `${chapter.slug}-${index === 0 ? 'concept' : 'practice'}`
    const topicId = buildNodeId(parentId, slug)
    const profile = v3StudyProfile(
      definition.sourceTopic,
      subjectId,
      chapter,
      difficulty,
      importance,
      fallbackPriority,
    )

    return createNode({
      level: 'topic',
      name: definition.label,
      slug,
      parentId,
      metadata: {
        fullTitle: `${chapter.name}: ${definition.label}`,
        summary: definition.summary,
        estimatedStudyTime: roadmapMetadata?.estimatedStudyMinutes ? `${roadmapMetadata.estimatedStudyMinutes / 60} hr` : estimateStudyTime(difficulty),
        estimatedProblemSolvingTime: roadmapMetadata?.estimatedProblemSolvingMinutes ? `${roadmapMetadata.estimatedProblemSolvingMinutes / 60} hr` : estimateProblemSolvingTime(difficulty),
        importance: profile.importance,
        difficulty: profile.difficulty,
        priority: profile.priority,
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
        prerequisites: roadmapMetadata?.prerequisites ?? null,
        typicalQuestionStyle: roadmapMetadata?.typicalQuestionStyle ?? null,
        linkedModules: buildLinkedModules(subjectId, chapter.slug),
        resourceId: definition.sourceTopic?.resourceId ?? null,
        roadmapPhase: definition.sourceTopic?.roadmapPhase ?? '',
        roadmapOrder: profile.roadmapOrder,
        phaseLabel: profile.phaseLabel,
        subjectDifficulty: profile.subjectDifficulty,
        source: definition.sourceTopic?.source ?? '',
        videoUrl: definition.sourceTopic?.videoLink ?? '',
        bookReference: definition.sourceTopic?.bookReference ?? '',
        timing: definition.sourceTopic?.timing ?? '',
        additionalNotes: definition.sourceTopic?.additionalNotes ?? '',
      },
      children: definition.sourceTopic ? [] : index === 0 ? buildSubtopics(topicId, chapter, roadmapMetadata) : [],
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

/**
 * Infers the exam scope for a chapter from the chapter's own topic tags when
 * available, while retaining the older blueprint labels for subjects that only
 * record a coarse JEST-only/JAM+JEST split.
 */
function inferChapterExamScope(chapter) {
  const scopes = (chapter.topics ?? [])
    .map((topic) => String(topic.exams ?? topic.examScope ?? '').trim())
    .filter(Boolean)

  const normalized = scopes.find((scope) => /JAM\+JEST/i.test(scope))
    ? 'JAM+JEST'
    : scopes.find((scope) => /JAM-only/i.test(scope))
      ? 'JAM-only'
      : scopes.find((scope) => /JAM-partial/i.test(scope))
        ? 'JAM-partial'
        : scopes.find((scope) => /JEST-only \(low\)/i.test(scope))
          ? 'JEST-only (low)'
          : scopes.find((scope) => /JEST-only/i.test(scope))
            ? 'JEST-only'
            : scopes.find((scope) => /JEST-edge/i.test(scope))
              ? 'JEST-edge'
              : 'JAM+JEST'

  return normalized
}

function splitChaptersByExamScope(subject) {
  const buckets = {
    'JAM+JEST': [],
    'JAM-only': [],
    'JAM-partial': [],
    'JEST-only': [],
    'JEST-edge': [],
    'JEST-only (low)': [],
  }

  subject.chapters.forEach((chapter) => {
    const scope = inferChapterExamScope(chapter)
    const key = buckets[scope] ? scope : 'JAM+JEST'
    buckets[key].push(chapter)
  })

  return buckets
}

function buildUnitsForSubject(parentId, subjectId, subject) {
  const buckets = splitChaptersByExamScope(subject)
  const unitDefinitions = [
    { key: 'JAM+JEST', name: 'Core JAM + JEST Overlap' },
    { key: 'JAM-only', name: 'JAM Only' },
    { key: 'JAM-partial', name: 'JAM Partial / Foundation' },
    { key: 'JEST-only', name: 'JEST Only' },
    { key: 'JEST-edge', name: 'JEST Edge / Advanced' },
    { key: 'JEST-only (low)', name: 'JEST Only (Low Priority)' },
  ]

  return unitDefinitions.flatMap(({ key, name }) => {
    const chapters = buckets[key]
    if (!chapters?.length) return []

    const unitSlug = `${subject.id}-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    const unitId = buildNodeId(parentId, unitSlug)

    return [
      createNode({
        level: 'unit',
        name,
        slug: unitSlug,
        parentId,
        metadata: { subjectId, examScope: key },
        children: chapters.map((chapter) => buildChapterNode(unitId, subjectId, subject.name, chapter)),
      }),
    ]
  })
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
