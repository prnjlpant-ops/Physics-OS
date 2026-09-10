import { RESOURCE_TYPE_ORDER } from '../constants/resourceTypes'
import { getResourcesForTopicId } from './resourceCatalogService'
import chapterToTopicMap from './chapterToTopicMap.json' with { type: 'json' }
import { getResources } from './blueprintService'

function emptyBundle() {
  return Object.fromEntries(RESOURCE_TYPE_ORDER.map((type) => [type, []]))
}

/**
 * Resolves syllabus resources through the Topic Index ids. This replaces the
 * previous vocabulary matching, synthetic page counts, and placeholder data.
 */
export function getTopicResources(topic) {
  const subjectId = topic?.metadata?.subjectId
  const chapterSlug = topic?.metadata?.chapterSlug
  if (subjectId && chapterSlug) {
    const bundle = emptyBundle()
    Object.entries(getResources(subjectId, chapterSlug)).forEach(([type, resources]) => {
      bundle[type] = resources.filter((resource) => !resource.topicName || resource.topicName === topic.name)
    })
    if (Object.values(bundle).some((resources) => resources.length)) return bundle
  }
  const fallbackChapterSlug = topic?.metadata?.chapterSlug || topic?.slug
  const topicId = chapterToTopicMap[fallbackChapterSlug] || fallbackChapterSlug
  if (!topicId) return emptyBundle()
  const bundle = emptyBundle()
  getResourcesForTopicId(topicId).forEach((resource) => {
    if (bundle[resource.type]) bundle[resource.type].push(resource)
  })
  return bundle
}

export function getTopicResourcesFlat(topic) {
  return Object.values(getTopicResources(topic)).flat()
}

export function getTopicPrimaryResources(topic) {
  const { books, videos, pdfs } = getTopicResources(topic)
  return { books, videos, pdfs }
}
