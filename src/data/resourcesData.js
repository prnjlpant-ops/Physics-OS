import { getSubjects } from '../engine/blueprintService'
import { getBlueprintResourcesForSubject } from '../engine/blueprintMappingLayer'

/**
 * Resources — Sprint 17.
 * =======================
 * Books, Videos and Solution Manuals are now populated from the imported
 * JEST blueprint wherever it has data for a subject (see
 * `engine/blueprintMappingLayer.js` -> `getBlueprintResourcesForSubject`).
 * Blueprint resources are recorded per *subject* (a book covers a whole
 * subject, not one chapter), so the same subject-level list is attached to
 * every chapter of that subject, with the chapter name folded into the
 * title for context — this keeps the existing per-chapter resource shape
 * every page/component already consumes.
 *
 * PDFs, Reference Material and External Links have no equivalent in the
 * blueprint (it is a study-strategy document, not a file index), so those
 * three types remain placeholder entries, as they were in Sprint 16 —
 * "populate wherever possible" per the Sprint 17 brief.
 */

const PLACEHOLDER_TEMPLATES = {
  pdfs: [
    { suffix: 'Notes.pdf', fields: { size: '—' } },
    { suffix: 'Summary.pdf', fields: { size: '—' } },
  ],
  referenceMaterial: [
    { suffix: 'Reference Notes', fields: { description: 'Reference material for this chapter will appear here.' } },
  ],
  externalLinks: [
    { suffix: 'External Resource', fields: { source: 'Not Linked' } },
  ],
}

const FALLBACK_BOOK_TEMPLATE = { suffix: 'Core Text', fields: { author: 'Author to be added', edition: '—', status: 'Not Added' } }
const FALLBACK_VIDEO_TEMPLATE = { suffix: 'Lecture', fields: { duration: '—', source: 'Not Linked' } }
const FALLBACK_SOLUTION_TEMPLATE = { suffix: 'Solved Problems', fields: { author: 'Author to be added', edition: '—', status: 'Not Added' } }

function bookToResource(book, subject, chapter, index) {
  return {
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
  }
}

function videoToResource(video, subject, chapter, index) {
  return {
    id: `${subject.id}__${chapter.slug}__videos__${index}`,
    type: 'videos',
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    title: `${chapter.name} — ${video.title}`,
    duration: video.duration ?? '—',
    source: video.platform ?? video.title,
    url: video.url ?? null,
    platform: video.platform ?? null,
  }
}

/** Picks a "practice/exercise-oriented" book from a subject's list to stand in as its solution-manual entry. */
function pickSolutionManualBook(books) {
  if (!books.length) return null
  return books.length > 1 ? books[1] : books[0]
}

function solutionManualToResource(book, subject, chapter, index) {
  return {
    id: `${subject.id}__${chapter.slug}__solutionManuals__${index}`,
    type: 'solutionManuals',
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    title: `${chapter.name} — ${book.title} (Practice & Exercises)`,
    author: book.author ?? 'Author to be added',
    edition: book.tier ?? '—',
    status: 'Recommended (JEST 2027 Blueprint)',
  }
}

function placeholderResources(subject, chapter, type) {
  return PLACEHOLDER_TEMPLATES[type].map((template, index) => ({
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

function fallbackResource(subject, chapter, type, template) {
  return [
    {
      id: `${subject.id}__${chapter.slug}__${type}__0`,
      type,
      subjectId: subject.id,
      subjectName: subject.name,
      chapterSlug: chapter.slug,
      chapterName: chapter.name,
      title: `${chapter.name} — ${template.suffix}`,
      ...template.fields,
    },
  ]
}

export function getChapterResources(subject, chapter) {
  const blueprintResources = getBlueprintResourcesForSubject(subject.id)

  const books = blueprintResources.books.length
    ? blueprintResources.books.map((book, index) => bookToResource(book, subject, chapter, index))
    : fallbackResource(subject, chapter, 'books', FALLBACK_BOOK_TEMPLATE)

  const videos = blueprintResources.videos.length
    ? blueprintResources.videos.map((video, index) => videoToResource(video, subject, chapter, index))
    : fallbackResource(subject, chapter, 'videos', FALLBACK_VIDEO_TEMPLATE)

  const solutionManualBook = pickSolutionManualBook(blueprintResources.books)
  const solutionManuals = solutionManualBook
    ? [solutionManualToResource(solutionManualBook, subject, chapter, 0)]
    : fallbackResource(subject, chapter, 'solutionManuals', FALLBACK_SOLUTION_TEMPLATE)

  return {
    books,
    videos,
    pdfs: placeholderResources(subject, chapter, 'pdfs'),
    solutionManuals,
    referenceMaterial: placeholderResources(subject, chapter, 'referenceMaterial'),
    externalLinks: placeholderResources(subject, chapter, 'externalLinks'),
  }
}

export function getChapterResourcesFlat(subject, chapter) {
  return Object.values(getChapterResources(subject, chapter)).flat()
}

export function getSubjectResources(subject) {
  return subject.chapters.flatMap((chapter) => getChapterResourcesFlat(subject, chapter))
}

export function getAllResources() {
  return getSubjects().flatMap((subject) => getSubjectResources(subject))
}
