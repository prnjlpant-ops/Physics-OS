import markdown from './chapterResources.md?raw'

const normalise = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, ' ')
const words = (value) => new Set(normalise(value).split(/\s+/).filter((word) => word.length > 1 && !['and', 'the', 'theory'].includes(word)))

function parseRows(source) {
  return source.split('\n').filter((line) => line.startsWith('| ') && !line.startsWith('| Unit |')).map((line) => {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    return { unit: cells[0], chapter: cells[1], syllabus: cells[2], videoTitle: cells[3], videoUrl: cells[4], watch: cells[5], book: cells[6], bookChapter: cells[7] }
  }).filter((row) => row.chapter && row.chapter !== '---')
}

const records = parseRows(markdown)

/** The Markdown file is the data source; matching is punctuation-tolerant so it stays usable as chapter labels evolve. */
export function getChapterResourceRecord(chapterName) {
  const target = words(chapterName)
  return records.map((record) => ({ record, score: [...target].filter((word) => words(record.chapter).has(word)).length }))
    .sort((a, b) => b.score - a.score)[0]?.record ?? null
}

export { records as chapterResourceRecords }
