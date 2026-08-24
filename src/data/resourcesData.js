import { getSubjects } from '../engine/blueprintService'
import { getBlueprintResourcesForSubject } from '../engine/blueprintMappingLayer'
import { libraryMasterIndex } from '../engine/library'
import { getChapterResourceRecord } from './chapterResourceDatabase'
import workbookVideoLinks from './videoLinks.json'

const FALLBACK_BOOK = { title: 'Core text', author: 'To be added', tier: 'Recommended' }
const FALLBACK_VIDEO = { title: 'Lecture', platform: 'To be added', duration: '—' }

const normalise = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '')
const STOP_WORDS = new Set(['and', 'the', 'of', 'for', 'with', 'basic', 'full', 'theory', 'physics'])

function tokens(value = '') {
  return new Set(value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter((word) => word.length > 2 && !STOP_WORDS.has(word)))
}

/** Workbook rows are intentionally matched by topic vocabulary, not fragile exact labels. */
function getWorkbookRows(chapterName) {
  const target = tokens(chapterName)
  const scored = workbookVideoLinks.map((row) => {
    const candidate = tokens(`${row.chapter} ${row.subtopic}`)
    const score = [...target].filter((word) => candidate.has(word)).length
    return { row, score }
  }).filter(({ score }) => score > 0)

  const highestScore = Math.max(0, ...scored.map(({ score }) => score))
  return scored
    .filter(({ score }) => score === highestScore && highestScore >= 2)
    .map(({ row }) => row)
}

function localBooksFor(subject) {
  const target = normalise(subject.name)
  const entry = Object.values(libraryMasterIndex.subjects ?? {}).find(({ name }) => {
    const candidate = normalise(name)
    return candidate === target || target.includes(candidate) || candidate.includes(target) || (target.startsWith('mathematical') && candidate.startsWith('mathematical'))
  })
  return entry?.categories?.books ?? []
}

function makeBook(book, subject, chapter, index, fromLibrary = false) {
  return {
    id: `${subject.id}__${chapter.slug}__books__${book.id ?? index}`,
    type: 'books', subjectId: subject.id, subjectName: subject.name,
    chapterSlug: chapter.slug, chapterName: chapter.name,
    title: book.title, author: book.author ?? 'Unknown author', edition: book.edition ?? book.tier ?? '—',
    status: book.status ?? 'Recommended', path: book.path ?? null, url: book.url ?? null,
    source: fromLibrary ? 'books.json' : 'JEST blueprint',
    description: book.description || book.mustRead || `Read the sections relevant to ${chapter.name}, then complete the review problems.`,
    coveredChapters: [chapter.name],
  }
}

function makeVideo(video, subject, chapter, index) {
  return {
    id: `${subject.id}__${chapter.slug}__videos__${index}`,
    type: 'videos', subjectId: subject.id, subjectName: subject.name,
    chapterSlug: chapter.slug, chapterName: chapter.name,
    title: video.title, duration: video.duration ?? '—', source: video.platform ?? video.title,
    url: video.url ?? null, platform: video.platform ?? null,
    description: video.useCase || `Watch this for the concepts and worked examples in ${chapter.name}.`,
    coveredChapters: [chapter.name],
  }
}

/** Returns ordered study resources: the first book/video is the chapter's primary recommendation. */
export function getChapterResources(subject, chapter) {
  const blueprint = getBlueprintResourcesForSubject(subject.id)
  const record = getChapterResourceRecord(chapter.name)
  const workbookRows = getWorkbookRows(chapter.name)
  const libraryBooks = localBooksFor(subject)
  const matchedBook = libraryBooks.find((book) => normalise(book.title).includes(normalise(record?.book?.split('â€”')[0] ?? '')))
  const books = record ? [{ ...makeBook(matchedBook ?? { title: record.book, author: 'See source', tier: record.bookChapter }, subject, chapter, 0, Boolean(matchedBook)), title: record.book, edition: record.bookChapter, description: `Read ${record.bookChapter}.`, syllabus: record.syllabus, source: 'JEST_2026_Chapter_Resources.md' }] : (libraryBooks.length ? libraryBooks.map((book, index) => makeBook(book, subject, chapter, index, true)) : blueprint.books.map((book, index) => makeBook(book, subject, chapter, index))).slice(0, 3)
  const videos = workbookRows.length
    ? workbookRows.filter((row) => row.url).map((row, index) => ({
      ...makeVideo({ title: `${row.source}: ${row.subtopic}`, url: row.url, platform: row.source }, subject, chapter, index),
      description: row.studyNotes,
      syllabus: row.exam,
      roadmap: row.roadmap,
      source: 'JEST-JAM-video-links.xlsx',
    }))
    : record
      ? (record.videoUrl.startsWith('http') ? [{ ...makeVideo({ title: record.videoTitle, url: record.videoUrl, platform: record.videoTitle }, subject, chapter, 0), description: record.watch, syllabus: record.syllabus, source: 'JEST_2026_Chapter_Resources.md' }] : [])
      : (blueprint.videos.length ? blueprint.videos : [FALLBACK_VIDEO]).map((video, index) => makeVideo(video, subject, chapter, index)).slice(0, 3)
  return { books: books.length ? books : [makeBook(FALLBACK_BOOK, subject, chapter, 0)], videos }
}

export function getChapterResourcesFlat(subject, chapter) { return Object.values(getChapterResources(subject, chapter)).flat() }
export function getSubjectResources(subject) { return subject.chapters.flatMap((chapter) => getChapterResourcesFlat(subject, chapter)) }
export function getAllResources() { return getSubjects().flatMap((subject) => getSubjectResources(subject)) }
