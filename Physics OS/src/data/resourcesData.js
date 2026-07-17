import { subjects } from '../constants/subjects'

/**
 * Resources are attached to chapters, not books. This module produces
 * placeholder resource entries per chapter, grouped by type. The shape
 * matches what a future `resources.json` (loaded per chapter) would
 * provide, so the UI layer never needs to change when real data arrives.
 */
const TYPE_TEMPLATES = {
  books: [
    { suffix: 'Core Text', fields: { author: 'Author to be added', edition: '—', status: 'Not Added' } },
    { suffix: 'Problem Book', fields: { author: 'Author to be added', edition: '—', status: 'Not Added' } },
  ],
  videos: [
    { suffix: 'Lecture 1', fields: { duration: '—', source: 'Not Linked' } },
    { suffix: 'Lecture 2', fields: { duration: '—', source: 'Not Linked' } },
  ],
  pdfs: [
    { suffix: 'Notes.pdf', fields: { size: '—' } },
    { suffix: 'Summary.pdf', fields: { size: '—' } },
  ],
  solutionManuals: [
    { suffix: 'Solved Problems', fields: { author: 'Author to be added', edition: '—', status: 'Not Added' } },
  ],
  referenceMaterial: [
    { suffix: 'Reference Notes', fields: { description: 'Reference material for this chapter will appear here.' } },
  ],
  externalLinks: [
    { suffix: 'External Resource', fields: { source: 'Not Linked' } },
  ],
}

export function getChapterResources(subject, chapter) {
  const grouped = {}

  for (const [type, templates] of Object.entries(TYPE_TEMPLATES)) {
    grouped[type] = templates.map((template, index) => ({
      id: `${subject.id}__${chapter.slug}__${type}__${index}`,
      type,
      subjectId: subject.id,
      subjectName: subject.name,
      chapterSlug: chapter.slug,
      chapterName: chapter.name,
      title: `${chapter.name} — ${template.suffix}`,
      ...template.fields,
    }))
  }

  return grouped
}

export function getChapterResourcesFlat(subject, chapter) {
  return Object.values(getChapterResources(subject, chapter)).flat()
}

export function getSubjectResources(subject) {
  return subject.chapters.flatMap((chapter) => getChapterResourcesFlat(subject, chapter))
}

export function getAllResources() {
  return subjects.flatMap((subject) => getSubjectResources(subject))
}
