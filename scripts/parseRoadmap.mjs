import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, '..')

const roadmapPath = path.join(workspaceRoot, 'roadmap.md')
const booksPath = path.join(workspaceRoot, 'src', 'data', 'library', 'books.json')
const outputPath = path.join(workspaceRoot, 'src', 'data', 'roadmap.json')

const roadmapText = fs.readFileSync(roadmapPath, 'utf8')
const booksJson = JSON.parse(fs.readFileSync(booksPath, 'utf8'))
const books = Array.isArray(booksJson?.books) ? booksJson.books : []

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function slugify(value) {
  return normalizeText(value).replace(/\s+/g, '-')
}

function extractTag(title) {
  const tagMatch = title.match(/\[([A-Z][^\]]*)\]/)
  return tagMatch ? [tagMatch[1]] : []
}

function cleanHeading(text) {
  return text
    .replace(/^##\s*\d+\.\s*/, '')
    .replace(/^\*\*\s*/, '')
    .replace(/\s*\*\*$/, '')
    .trim()
}

function inferBookAssetLink(topic) {
  const source = `${topic.book || ''} ${topic.title || ''}`.toLowerCase()

  if (source.includes('boas')) return 'boas_math_methods'
  if (source.includes('kleppner')) return 'kleppner'
  if (source.includes('goldstein')) return 'goldstein'
  if (source.includes('griffiths')) return 'griffiths_em'
  if (source.includes('garg') || source.includes('bansal') || source.includes('ghosh')) return 'garg_bansal_ghosh_thermal_physics'
  if (source.includes('beiser')) return 'beiser_concepts_of_modern_physics'
  if (source.includes('millman') || source.includes('halkias')) return 'millman_halkias'
  if (source.includes('kittel')) return 'kittel'
  if (source.includes('hecht')) return 'hecht'
  if (source.includes('pathria')) return 'pathria'
  if (source.includes('arfken')) return 'boas_math_methods'

  const match = books.find((book) => {
    const title = normalizeText(book.title)
    return title.includes(normalizeText(topic.book)) || normalizeText(topic.book).includes(title)
  })
  return match?.id ?? null
}

function parseTopicBody(lines) {
  const contentLines = lines.filter((line) => line.trim())
  const bookLine = contentLines.find((line) => line.startsWith('- **Book:**'))
  const videoLine = contentLines.find((line) => line.startsWith('- **Video:**'))
  const depthLine = contentLines.find((line) => line.includes('**Depth:**'))

  const notes = contentLines
    .filter((line) => line.startsWith('- **') && !line.startsWith('- **Book:**') && !line.startsWith('- **Video:**'))
    .map((line) => line.replace(/^-\s*/, '').trim())

  return {
    book: bookLine ? bookLine.replace(/^- \*\*Book:\*\*/i, '').trim() : '',
    video: videoLine ? videoLine.replace(/^- \*\*Video:\*\*/i, '').trim() : '',
    videoDepthNote: depthLine ? depthLine.replace(/^[^*]*\*\*Depth:\*\*/i, '').trim() : '',
    notes: notes.join('\n'),
  }
}

const lines = roadmapText.split(/\r?\n/)
const topics = []
let currentPhase = null
let currentTier = null
let currentTopic = null
let currentTopicLines = []
let phaseBCount = 0

function flushTopic() {
  if (!currentTopic) return
  const { book, video, videoDepthNote, notes } = parseTopicBody(currentTopicLines)
  const titleText = cleanHeading(currentTopic.title)
  const topic = {
    sprint: currentPhase,
    tier: currentPhase === 'Phase B' ? currentTier : null,
    id: currentTopic.id,
    title: titleText,
    tags: extractTag(titleText),
    book,
    bookAssetLink: inferBookAssetLink({ book, title: titleText }),
    video,
    videoDepthNote,
    notes,
    order: currentTopic.order,
  }
  topics.push(topic)
  currentTopic = null
  currentTopicLines = []
}

function startTopic(phase, tier, title, order, id) {
  flushTopic()
  currentPhase = phase
  currentTier = tier
  currentTopic = { id, title, order }
  currentTopicLines = []
}

for (let index = 0; index < lines.length; index += 1) {
  const line = lines[index]

  if (line.trim().startsWith('# PHASE A-BONUS')) {
    flushTopic()
    currentPhase = 'Phase A-Bonus'
    currentTier = null
    continue
  }

  if (line.trim().startsWith('# PHASE A')) {
    flushTopic()
    currentPhase = 'Phase A'
    currentTier = null
    continue
  }

  if (line.trim().startsWith('# PHASE B')) {
    flushTopic()
    currentPhase = 'Phase B'
    currentTier = null
    phaseBCount = 0
    continue
  }

  if (line.trim().startsWith('# FINAL LOCKDOWN')) {
    flushTopic()
    currentPhase = 'Final Lockdown'
    currentTier = null
    continue
  }

  if (/^## Tier 1/.test(line)) {
    currentTier = 'Tier 1'
    continue
  }

  if (/^## Tier 2/.test(line)) {
    currentTier = 'Tier 2'
    continue
  }

  if (/^## Tier 3/.test(line)) {
    currentTier = 'Tier 3'
    continue
  }

  const phaseAHeading = line.match(/^##\s*(\d+)\.\s*(.+)$/)
  if (phaseAHeading && currentPhase === 'Phase A') {
    const order = Number(phaseAHeading[1])
    startTopic(currentPhase, null, phaseAHeading[2].trim(), order, `phase-a-${String(order).padStart(2, '0')}`)
    continue
  }

  const bonusHeading = line.match(/^\*\*(\d+)\.\s*(.+)\*\*$/)
  if (bonusHeading && currentPhase === 'Phase A-Bonus') {
    const order = Number(bonusHeading[1])
    startTopic(currentPhase, null, bonusHeading[2].trim(), order, `phase-a-bonus-${String(order).padStart(2, '0')}`)
    continue
  }

  const phaseBHeading = line.match(/^\*\*(.+)\*\*$/)
  if (phaseBHeading && currentPhase === 'Phase B') {
    phaseBCount += 1
    const title = phaseBHeading[1].trim()
    startTopic(currentPhase, currentTier, title, phaseBCount, `phase-b-${slugify(currentTier || 'tier')}-${String(phaseBCount).padStart(2, '0')}`)
    continue
  }

  if (currentTopic && (line.trim().startsWith('- **Book:**') || line.trim().startsWith('- **Video:**') || line.includes('**Depth:**') || line.trim().startsWith('- **Why') || line.trim().startsWith('- **Correction') || line.trim().startsWith('- **Note') || line.trim().startsWith('- **'))) {
    currentTopicLines.push(line)
  }
}

flushTopic()

if (!topics.some((topic) => topic.sprint === 'Final Lockdown')) {
  topics.push({
    sprint: 'Final Lockdown',
    tier: null,
    id: 'final-lockdown',
    title: 'Final Lockdown — Pure PYQ window',
    tags: [],
    book: '',
    bookAssetLink: null,
    video: '',
    videoDepthNote: '',
    notes: 'Pure PYQ practice, timed mocks, mistake logs, and formula-sheet drilling only. No new content starts here.',
    order: topics.length + 1,
  })
}

const orderedTopics = topics.map((topic, index) => ({ ...topic, order: index + 1 }))
fs.writeFileSync(outputPath, `${JSON.stringify(orderedTopics, null, 2)}\n`)

const counts = orderedTopics.reduce((acc, topic) => {
  acc[topic.sprint] = (acc[topic.sprint] ?? 0) + 1
  return acc
}, {})

console.log(`Parsed ${orderedTopics.length} topics from roadmap.md.`)
console.log(JSON.stringify(counts, null, 2))
