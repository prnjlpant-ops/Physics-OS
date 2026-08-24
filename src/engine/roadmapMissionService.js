import roadmapTopics from '../data/roadmap.json' with { type: 'json' }
import { TOPIC_STATUS } from '../constants/topicConstants.js'

const CHECKPOINTS = [
  { label: 'Early October checkpoint', date: '2026-10-01', targetOrder: 7 },
  { label: 'Mid-December checkpoint', date: '2026-12-15', targetOrder: 14 },
  { label: 'Jan 20 hard stop', date: '2027-01-20', targetOrder: 20 },
]

function toDateKey(date) {
  const local = new Date(date)
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`
}

function isMastered(status) {
  return [TOPIC_STATUS.MASTERED, TOPIC_STATUS.REVISION_NEEDED].includes(status)
}

function getCheckpointForDate(date) {
  const key = toDateKey(date)
  const match = [...CHECKPOINTS].reverse().find((checkpoint) => key >= checkpoint.date)
  return match ?? CHECKPOINTS[0]
}

function sortByOrder(items) {
  return [...items].sort((left, right) => left.order - right.order)
}

export function getRoadmapMissionSnapshot(statuses = {}, date = new Date()) {
  const sortedTopics = sortByOrder(roadmapTopics)
  const nextTopic = sortedTopics.find((topic) => !isMastered(statuses[topic.id]))
  const outOfSequence = sortedTopics.filter((topic) => {
    if (isMastered(statuses[topic.id])) return false
    if (!nextTopic) return false
    return topic.order > nextTopic.order && statuses[topic.id] && statuses[topic.id] !== TOPIC_STATUS.NOT_STARTED
  })

  const checkpoint = getCheckpointForDate(date)
  const focusTopic = nextTopic ?? sortedTopics[sortedTopics.length - 1] ?? null

  return {
    nextTopic,
    focusTopic,
    outOfSequence,
    checkpoint,
    totalTopics: sortedTopics.length,
    completedTopics: sortedTopics.filter((topic) => isMastered(statuses[topic.id])).length,
  }
}
