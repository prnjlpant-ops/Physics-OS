import { TOPIC_STATUS } from '../constants/topicConstants'
import {
  TASK_TYPES,
  TASK_TYPE_BASE_MINUTES,
  DIFFICULTY_TIME_MULTIPLIER,
  TASK_STATUS,
} from '../constants/dailyStudyConstants'
import { createTask } from './taskModel'
import { createMission } from './missionModel'
import roadmapTopics from '../data/roadmap.json' with { type: 'json' }
import { getRoadmapMissionSnapshot } from './roadmapMissionService'

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
  const roadmapStatusMap = Object.fromEntries(
    roadmapTopics.map((topic) => [topic.id, resolveEffectiveStatus(topic.id, statusOverrides)]),
  )
  const roadmapSnapshot = getRoadmapMissionSnapshot(roadmapStatusMap)
  const currentTopic = roadmapSnapshot.nextTopic

  if (!currentTopic) {
    return createMission({ isAllCaughtUp: true })
  }

  const tasks = buildTasksForTopic(currentTopic, taskStatusOverrides)

  return createMission({
    subject: { id: 'roadmap', name: 'Roadmap' },
    chapter: { slug: 'roadmap', name: roadmapSnapshot.checkpoint.label },
    topic: { id: currentTopic.id, name: currentTopic.title },
    tasks,
    meta: {
      roadmapCheckpoint: roadmapSnapshot.checkpoint.label,
      outOfSequence: roadmapSnapshot.outOfSequence.map((topic) => topic.title),
    },
  })
}
