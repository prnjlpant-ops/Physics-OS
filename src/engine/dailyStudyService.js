import { TOPIC_STATUS } from '../constants/syllabusConstants'
import {
  TASK_TYPES,
  TASK_TYPE_BASE_MINUTES,
  DIFFICULTY_TIME_MULTIPLIER,
  TASK_STATUS,
} from '../constants/dailyStudyConstants'
import { createTask } from './taskModel'
import { createMission } from './missionModel'
import { getAllTopics } from '../data/syllabusData'
import { getTopicResourcesFlat } from './resourceMappingService'

/**
 * DAILY STUDY SERVICE
 * ===================
 * Sprint 19A — Daily Study Engine (Core).
 *
 * Generates "Today's Mission" by walking the same syllabus tree the
 * Syllabus Explorer and Roadmap Engine already read (`data/syllabusData.js`
 * -> `getAllTopics()`), picking the first Topic that isn't yet Mastered
 * (a live status coming from `useSyllabusStatus`), and turning that one
 * Topic's already-mapped resources (`engine/resourceMappingService.js`,
 * plus the chapter-level PYQ/Formula/Memory/Active Recall/Notes stores)
 * into a flat task list.
 *
 * PLACEHOLDER LOGIC, BY DESIGN:
 * - "Next topic" = first non-Mastered topic in syllabus order. No spaced
 *   repetition, no adaptive difficulty, no calendar awareness.
 * - Estimated time per task is a fixed placeholder band, only lightly
 *   scaled by the topic's existing difficulty rating.
 * - Task priority is inherited directly from the topic's own
 *   blueprint-derived priority (no separate per-task priority model).
 *
 * ARCHITECTURE NOTE — future blueprint integration: every task here is
 * built by `buildTasksForTopic`, the single place that decides which task
 * types apply to a topic and how long each takes. A future sprint that
 * adds a real per-topic study blueprint (explicit task list, real
 * durations) only needs to change this function's body — `TaskModel`,
 * `MissionModel`, and every caller (Today's Mission page/section) read the
 * same shape either way.
 */

function resolveEffectiveStatus(topicId, statusOverrides) {
  return statusOverrides[topicId] ?? TOPIC_STATUS.NOT_STARTED
}

function roadmapQueue(topic) {
  const phase = String(topic.metadata?.roadmapPhase ?? '')
  const timing = String(topic.metadata?.timing ?? '')
  const core = /^Topic\s+(\d+)/i.exec(phase)
  if (core) return { stage: 0, order: Number(core[1]) }
  const bonus = /Bonus\s*#?(\d+)/i.exec(phase)
  if (bonus) return { stage: 1, order: Number(bonus[1]) }
  const tier = /Tier\s*(\d+)/i.exec(`${phase} ${timing}`)
  if (tier) return { stage: Number(tier[1]) + 1, order: topic.metadata?.roadmapOrder ?? Number.MAX_SAFE_INTEGER }
  if (/supplemental/i.test(phase) && /phase a/i.test(timing)) {
    const feeds = /topic\s*(\d+)/i.exec(phase)
    return { stage: 0, order: feeds ? Number(feeds[1]) + 0.5 : 12.5 }
  }
  return { stage: 5, order: Number.MAX_SAFE_INTEGER }
}

const QUEUE_LABELS = [
  'Core Topics 1–20',
  'Phase A bonus',
  'Phase B — Tier 1',
  'Phase B — Tier 2',
  'Phase B — Tier 3',
  'Unscheduled / review',
]

function isDuplicateRoadmapRow(topic) {
  // v5 retains a cross-sheet copy of Bonus #7 for traceability. V3 says to
  // study it once, from either source, so it remains visible in resources
  // but never becomes a second mission.
  return /\bdup(?:licate)?\b/i.test(String(topic.metadata?.roadmapPhase ?? ''))
    || /duplicate of/i.test(`${topic.metadata?.summary ?? ''} ${topic.metadata?.additionalNotes ?? ''}`)
}

/**
 * V3's governing order: finish the numbered JAM-overlap core first, then
 * the ranked bonus list, then Phase-B tiers.  v5 supplies the topic IDs,
 * resources, and timing; this function only applies the v3 sequencing rule.
 */
function getNextUnmasteredTopic(statusOverrides) {
  const unmastered = getAllTopics().filter((topic) =>
    resolveEffectiveStatus(topic.id, statusOverrides) !== TOPIC_STATUS.MASTERED
      && !isDuplicateRoadmapRow(topic),
  )
  return unmastered.sort((left, right) => {
    const a = roadmapQueue(left)
    const b = roadmapQueue(right)
    return a.stage - b.stage || a.order - b.order || left.name.localeCompare(right.name)
  })[0] ?? null
}

/** UI-safe summary of the same v3 gate used to generate a mission. */
export function getMissionQueueSummary(statusOverrides = {}) {
  const topics = getAllTopics().filter((topic) => !isDuplicateRoadmapRow(topic))
  const nextTopic = getNextUnmasteredTopic(statusOverrides)
  const nextQueue = nextTopic ? roadmapQueue(nextTopic) : null
  const coreRemaining = topics.filter((topic) =>
    roadmapQueue(topic).stage === 0
      && resolveEffectiveStatus(topic.id, statusOverrides) !== TOPIC_STATUS.MASTERED,
  ).length

  return {
    nextTopic,
    stage: nextQueue?.stage ?? null,
    stageLabel: nextQueue ? QUEUE_LABELS[nextQueue.stage] : 'All roadmap material complete',
    coreRemaining,
  }
}

function scaledMinutes(type, difficulty, { scaleWithDifficulty = false } = {}) {
  const base = TASK_TYPE_BASE_MINUTES[type] ?? 20
  if (!scaleWithDifficulty) return base
  const multiplier = DIFFICULTY_TIME_MULTIPLIER[difficulty] ?? 1
  return Math.max(5, Math.round((base * multiplier) / 5) * 5)
}

/**
 * Builds the flat task list for one roadmap topic. The roadmap itself is
 * now the source of truth for Today's Mission, so the task list is built
 * from the topic's own book/video/note references rather than chapter-level
 * syllabus resources that may not exist for the roadmap entry.
 */
function buildTasksForTopic(topic, taskStatusOverrides) {
  const candidates = []
  const priority = topic.priority ?? 'High'
  const difficulty = topic.difficulty ?? 'Moderate'

  if (topic.bookAssetLink) {
    candidates.push({
      type: TASK_TYPES.READ_BOOK,
      title: `Open book for: ${topic.title}`,
      link: topic.bookAssetLink ? `/library/resource/${topic.bookAssetLink}` : null,
      estimatedMinutes: topic.estimatedStudyMinutes ?? scaledMinutes(TASK_TYPES.READ_BOOK, difficulty, { scaleWithDifficulty: true }),
      meta: { bookAssetLink: topic.bookAssetLink },
    })
  }

  if (topic.video) {
    candidates.push({
      type: TASK_TYPES.WATCH_VIDEO,
      title: `Watch roadmap video/playlist`,
      link: null,
      estimatedMinutes: topic.estimatedStudyMinutes ?? scaledMinutes(TASK_TYPES.WATCH_VIDEO, difficulty, { scaleWithDifficulty: true }),
      meta: { video: topic.video },
    })
  }

  if (topic.notes) {
    candidates.push({
      type: TASK_TYPES.NOTES_REVISION,
      title: 'Read roadmap notes',
      link: null,
      estimatedMinutes: topic.estimatedProblemSolvingMinutes ?? scaledMinutes(TASK_TYPES.NOTES_REVISION, difficulty),
      meta: { notes: topic.notes },
    })
  }

  return candidates.map((candidate, index) => {
    const id = `${topic.id}__task__${index}`
    return createTask({
      id,
      type: candidate.type,
      title: candidate.title,
      estimatedMinutes: candidate.estimatedMinutes,
      priority,
      status: taskStatusOverrides[id] ?? TASK_STATUS.PENDING,
      link: candidate.link,
      topicId: topic.id,
      subjectId: 'roadmap',
      chapterSlug: 'roadmap',
      meta: candidate.meta,
    })
  })
}

/**
 * Generates Today's Mission.
 *
 * @param statusOverrides - live topic status map from `useSyllabusStatus()`.
 * @param taskStatusOverrides - live per-task status map from `useMissionTaskStatus()`.
 */
export function generateTodaysMission(statusOverrides = {}, taskStatusOverrides = {}) {
  const currentTopic = getNextUnmasteredTopic(statusOverrides)

  if (!currentTopic) {
    return createMission({ isAllCaughtUp: true })
  }

  const resources = getTopicResourcesFlat(currentTopic)
  const tasks = resources.map((resource, index) => {
    const isVideo = resource.type === 'videos'
    const id = `${currentTopic.id}__task__${index}`
    return createTask({
      id,
      type: isVideo ? TASK_TYPES.WATCH_VIDEO : TASK_TYPES.READ_BOOK,
      title: `${isVideo ? 'Watch' : 'Study'}: ${resource.title}`,
      estimatedMinutes: isVideo ? scaledMinutes(TASK_TYPES.WATCH_VIDEO, currentTopic.metadata.difficulty) : scaledMinutes(TASK_TYPES.READ_BOOK, currentTopic.metadata.difficulty),
      priority: currentTopic.metadata.priority ?? 'Medium',
      status: taskStatusOverrides[id] ?? TASK_STATUS.PENDING,
      link: resource.url ?? `/subjects/${currentTopic.metadata.subjectId}/chapters/${currentTopic.metadata.chapterSlug}`,
      topicId: currentTopic.id,
      subjectId: currentTopic.metadata.subjectId,
      chapterSlug: currentTopic.metadata.chapterSlug,
      meta: { resourceId: resource.id },
    })
  })

  return createMission({
    subject: { id: currentTopic.metadata.subjectId, name: currentTopic.metadata.subjectName },
    chapter: { slug: currentTopic.metadata.chapterSlug, name: currentTopic.metadata.chapterName },
    topic: { id: currentTopic.id, name: currentTopic.name },
    tasks,
  })
}
