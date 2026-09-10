import { libraryMasterIndex } from './library'
import { getAllResources } from './library/masterIndexService'
import { topicRecords } from './topics'
import chapterToTopicMap from './chapterToTopicMap.json' with { type: 'json' }
import { getSubjectById, getResources } from './blueprintService'

function typeFor(resource) {
  return resource.categoryKey === 'videos' ? 'videos' : 'books'
}

function usageByResourceId() {
  const usage = new Map()
  topicRecords.forEach((topic) => {
    // Record book usage
    ;(topic.relatedBooks ?? []).forEach((bookId) => {
      const topics = usage.get(bookId) ?? []
      topics.push({ id: topic.id, name: topic.name, subjectId: topic.subjectId, chapter: topic.chapter })
      usage.set(bookId, topics)
    })

    // Record video usage (topic.id is the video resource ID in Master Index)
    if (topic.relatedVideos?.length || topic.video) {
      const topics = usage.get(topic.id) ?? []
      topics.push({ id: topic.id, name: topic.name, subjectId: topic.subjectId, chapter: topic.chapter })
      usage.set(topic.id, topics)

      ;(topic.relatedVideos ?? []).forEach((v) => {
        if (typeof v === 'string') {
          const vTopics = usage.get(v) ?? []
          vTopics.push({ id: topic.id, name: topic.name, subjectId: topic.subjectId, chapter: topic.chapter })
          usage.set(v, vTopics)
        }
      })
    }

    // Record PYQ usage
    ;(topic.relatedPYQs ?? []).forEach((pyqId) => {
      const topics = usage.get(pyqId) ?? []
      topics.push({ id: topic.id, name: topic.name, subjectId: topic.subjectId, chapter: topic.chapter })
      usage.set(pyqId, topics)
    })
  })
  return usage
}

/** The one card-ready catalog used outside the Library's own management UI. */
export function getCatalogResources() {
  const usage = usageByResourceId()
  return getAllResources(libraryMasterIndex)
    .filter((resource) => resource.categoryKey === 'books' || resource.categoryKey === 'videos')
    .map((resource) => ({
      ...resource,
      type: typeFor(resource),
      usedIn: usage.get(resource.id) ?? [],
      source: resource.categoryKey === 'videos' ? resource.author : 'books.json',
      pages: resource.pages ?? null,
      duration: resource.duration ?? null,
    }))
}

export function getResourcesForTopicRecord(topic) {
  if (!topic) return []
  const bookIds = Array.isArray(topic.relatedBooks) ? topic.relatedBooks : []
  const videoIds = [topic.id]
  if (Array.isArray(topic.relatedVideos)) {
    topic.relatedVideos.forEach((v) => {
      if (typeof v === 'string') videoIds.push(v)
    })
  }
  const ids = new Set([...bookIds, ...videoIds])
  return getCatalogResources().filter((resource) => ids.has(resource.id))
}

export function getResourcesForSubject(subjectId) {
  const subjectResources = []
  const seen = new Set()
  // The v5 workbook supplies the authoritative subject/chapter mapping.
  // Use it first, keeping the older Master Index mapping as a fallback.
  const subject = getSubjectById(subjectId)
  subject?.chapters.forEach((chapter) => {
    Object.values(getResources(subjectId, chapter.slug)).flat().forEach((resource) => {
      if (!seen.has(resource.id)) {
        seen.add(resource.id)
        subjectResources.push({ ...resource, usedIn: [{ name: resource.topicName ?? chapter.name, subjectId, chapter: chapter.name }] })
      }
    })
  })
  return subjectResources.length ? subjectResources : getCatalogResources().filter((resource) => resource.usedIn.some((topic) => topic.subjectId === subjectId))
}

export function getResourcesForTopicId(topicId) {
  const resolvedId = chapterToTopicMap[topicId] || topicId
  return getResourcesForTopicRecord(topicRecords.find((topic) => topic.id === resolvedId))
}
