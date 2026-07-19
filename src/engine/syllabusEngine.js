import { SYLLABUS_LEVELS } from '../constants/syllabusConstants'

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
 * Future data loaders (Sprint 17)
 * ---------------------------------------------------------------------
 * These are intentionally NOT implemented in Sprint 16. They exist only
 * to document the extension point: once implemented, each must return
 * an array of root nodes built with `createNode`, in the exact same
 * shape the placeholder data in `syllabusData.js` already produces —
 * so no UI code needs to change.
 */
export function loadSyllabusFromJSON() {
  throw new Error('loadSyllabusFromJSON is not implemented yet — planned for Sprint 17.')
}

export function loadSyllabusFromMarkdown() {
  throw new Error('loadSyllabusFromMarkdown is not implemented yet — planned for Sprint 17.')
}
