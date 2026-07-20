import { getSubjectById } from '../constants/subjects'
import { getChapterResources } from '../data/resourcesData'
import { RESOURCE_TYPE_ORDER, RESOURCE_TYPE_META } from '../constants/resourceTypes'
import { PRIORITY_LEVELS } from '../constants/syllabusConstants'

/**
 * RESOURCE MAPPING SERVICE
 * ========================
 * Sprint 18A — Resource Mapping Engine.
 *
 * The Blueprint Import Engine (Sprint 17) already knows the syllabus down
 * to the Topic level. This service is the mapping layer that connects each
 * Topic to its resources across all six types: Books, Videos, PDFs,
 * Solution Manuals, Reference Material, External Links.
 *
 * It does not invent new resource records — it re-scopes the existing
 * chapter-level resources (`data/resourcesData.js`, itself sourced from the
 * JEST blueprint where available) down to the Topic that requested them,
 * and backfills the two card fields the chapter-level shape didn't need:
 * `pages` and `priority`. This means a Topic's Books/Videos/PDFs section is
 * always in sync with its chapter's Resources tab — one underlying source,
 * two views.
 *
 * ARCHITECTURE NOTE — JSON-ready by design: every getter below returns
 * plain, serializable objects built from a single normalization step
 * (`normalizeForTopic`). A future sprint can replace the "generated from
 * resourcesData" step with "loaded from a resourceMap.json keyed by topic
 * id" without changing any caller — see `loadResourceMapFromJSON` at the
 * bottom of this file, which documents that exact extension point (the
 * same pattern `engine/syllabusEngine.js` used for `loadSyllabusFromJSON`
 * before Sprint 17 implemented it).
 */

/** Placeholder priority-by-type — a book or solution manual is worth prioritizing before a reference link. */
const TYPE_PRIORITY = {
  books: PRIORITY_LEVELS[2], // High
  solutionManuals: PRIORITY_LEVELS[2], // High
  videos: PRIORITY_LEVELS[1], // Medium
  pdfs: PRIORITY_LEVELS[1], // Medium
  referenceMaterial: PRIORITY_LEVELS[0], // Low
  externalLinks: PRIORITY_LEVELS[0], // Low
}

/** Placeholder page-count bands per type, deterministic per resource index (no two identical cards). */
const TYPE_PAGE_BAND = {
  books: [280, 460],
  solutionManuals: [120, 220],
  pdfs: [8, 24],
  referenceMaterial: [4, 12],
  videos: null, // videos are measured in duration, not pages
  externalLinks: null, // external links have no fixed page count
}

function estimatePages(type, index) {
  const band = TYPE_PAGE_BAND[type]
  if (!band) return '—'
  const [min, max] = band
  const step = (max - min) / 4
  return String(Math.round(min + step * (index % 5)))
}

/** Normalizes "author" across types that don't naturally have one, so every card can show the field. */
function deriveAuthor(resource) {
  if (resource.author) return resource.author
  if (resource.type === 'videos') return resource.source ?? 'Instructor to be added'
  if (resource.type === 'pdfs') return 'Physics OS Notes'
  if (resource.type === 'referenceMaterial') return 'Curated Reference'
  if (resource.type === 'externalLinks') return 'Web Resource'
  return 'Author to be added'
}

/** Normalizes "status" across types that don't naturally have one. */
function deriveStatus(resource) {
  if (resource.status) return resource.status
  if (resource.type === 'videos') return resource.source === 'Not Linked' ? 'Not Linked' : 'Recommended'
  return 'Not Added'
}

/** Re-scopes one chapter-level resource record to a specific Topic and backfills the uniform card fields. */
function normalizeForTopic(resource, topic, type, index) {
  return {
    ...resource,
    id: `${topic.id}__${type}__${index}`,
    topicId: topic.id,
    topicName: topic.name,
    resourceType: type,
    resourceTypeLabel: RESOURCE_TYPE_META[type].singular,
    author: deriveAuthor(resource),
    status: deriveStatus(resource),
    priority: resource.priority ?? TYPE_PRIORITY[type],
    pages: resource.pages ?? estimatePages(type, index),
  }
}

function emptyBundle() {
  return Object.fromEntries(RESOURCE_TYPE_ORDER.map((type) => [type, []]))
}

/**
 * The core mapping function: given a Topic node from the syllabus tree
 * (see engine/syllabusEngine.js), returns { books, videos, pdfs,
 * solutionManuals, referenceMaterial, externalLinks } — each an array of
 * uniform, card-ready resource records for that Topic.
 */
export function getTopicResources(topic) {
  if (!topic?.metadata?.subjectId || !topic?.metadata?.chapterSlug) return emptyBundle()

  const subject = getSubjectById(topic.metadata.subjectId)
  const chapter = subject?.chapters.find((item) => item.slug === topic.metadata.chapterSlug)
  if (!subject || !chapter) return emptyBundle()

  const chapterResources = getChapterResources(subject, chapter)

  const bundle = {}
  for (const type of RESOURCE_TYPE_ORDER) {
    bundle[type] = chapterResources[type].map((resource, index) => normalizeForTopic(resource, topic, type, index))
  }
  return bundle
}

/** Flat list across all six types, for a single Topic — useful for search/counts. */
export function getTopicResourcesFlat(topic) {
  return Object.values(getTopicResources(topic)).flat()
}

/** Just the three types the Topic dashboard's compact preview reads by default: Books, Videos, PDFs. */
export function getTopicPrimaryResources(topic) {
  const { books, videos, pdfs } = getTopicResources(topic)
  return { books, videos, pdfs }
}

/**
 * ---------------------------------------------------------------------
 * Future data loader (prepared, not implemented)
 * ---------------------------------------------------------------------
 * Once a real per-topic resource file exists, this is the single place
 * that should change: parse/validate `jsonResourceMap` (an object keyed
 * by topic id, each value shaped like the bundle `getTopicResources`
 * already returns) and use it in place of the resourcesData-derived
 * bundle above. No page or component would need to change, since they
 * all call `getTopicResources` / `getTopicResourcesFlat` /
 * `getTopicPrimaryResources`, never the underlying source directly.
 */
export function loadResourceMapFromJSON() {
  throw new Error('loadResourceMapFromJSON is not implemented yet — prepared for a future sprint.')
}
