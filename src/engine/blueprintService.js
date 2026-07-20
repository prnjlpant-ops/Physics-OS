import blueprintMarkdown from '../data/blueprint/JEST_2027_Master_Blueprint.md?raw'
import blueprintJSON from '../data/blueprint/jestBlueprint.json'
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

export function getBlueprintHighYieldChecklist() {
  return getBlueprintData().highYieldChecklist
}
