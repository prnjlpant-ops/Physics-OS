import StorageService from './StorageService'
import LoggerService from './LoggerService'
import { DEFAULT_TASK_PRIORITY } from '../constants/taskConstants'
import { TASK_STATUS } from '../constants/dailyStudyConstants'

/**
 * TASK SERVICE
 * ============
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * The single reusable store for user-created ("custom") Today's Mission
 * tasks — Add / Edit / Delete / Complete / Reorder / Duplicate. Built on
 * `StorageService` (Sprint 0) rather than a bespoke localStorage wrapper,
 * per this sprint's architecture rule ("no direct localStorage calls
 * outside StorageService").
 *
 * This is intentionally separate from the auto-generated Planner tasks in
 * `engine/dailyStudyService.js` / `engine/plannerService.js` — those are
 * derived live from syllabus status and are never persisted as records.
 * Custom tasks are real records with their own lifecycle, matching the
 * sprint's Task Model exactly.
 */

const TASKS_KEY = 'studyEngine.tasks'

function generateTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function readAll() {
  const stored = StorageService.get(TASKS_KEY, [])
  return Array.isArray(stored) ? stored : []
}

function writeAll(tasks) {
  const ok = StorageService.set(TASKS_KEY, tasks)
  if (!ok) LoggerService.warn('TaskService: failed to persist tasks (storage unavailable or full).')
  return tasks
}

/** Returns every stored task, unsorted (callers decide ordering — see `order`). */
function getAllTasks() {
  return readAll()
}

function getTaskById(taskId) {
  return readAll().find((task) => task.id === taskId) ?? null
}

/**
 * Creates a new task from a (possibly partial) draft, filling in every
 * Task Model field the sprint spec requires. Missing metadata never
 * throws — it falls back to a safe default so the app keeps working.
 */
function createTask(draft = {}) {
  const tasks = readAll()
  const now = Date.now()
  const maxOrder = tasks.reduce((max, t) => Math.max(max, t.order ?? 0), -1)

  const task = {
    id: generateTaskId(),
    title: typeof draft.title === 'string' && draft.title.trim() ? draft.title.trim() : 'Untitled Task',
    description: draft.description ?? '',
    subject: draft.subject ?? '',
    chapter: draft.chapter ?? '',
    topic: draft.topic ?? '',
    resourceId: draft.resourceId ?? null,
    resourceType: draft.resourceType ?? null,
    priority: draft.priority ?? DEFAULT_TASK_PRIORITY,
    estimatedDuration: Number.isFinite(draft.estimatedDuration) ? draft.estimatedDuration : 30,
    type: draft.type ?? 'Custom Task',
    status: TASK_STATUS.PENDING,
    dueDate: draft.dueDate ?? null,
    createdAt: now,
    completedAt: null,
    notes: draft.notes ?? '',
    order: maxOrder + 1,
  }

  writeAll([...tasks, task])
  return task
}

/** Merges `changes` into an existing task. No-op (returns null) if the task doesn't exist. */
function updateTask(taskId, changes) {
  const tasks = readAll()
  const index = tasks.findIndex((task) => task.id === taskId)
  if (index === -1) return null

  const updated = { ...tasks[index], ...changes }
  const next = [...tasks]
  next[index] = updated
  writeAll(next)
  return updated
}

function deleteTask(taskId) {
  const tasks = readAll()
  writeAll(tasks.filter((task) => task.id !== taskId))
}

function completeTask(taskId) {
  return updateTask(taskId, { status: TASK_STATUS.COMPLETED, completedAt: Date.now() })
}

function reopenTask(taskId) {
  return updateTask(taskId, { status: TASK_STATUS.PENDING, completedAt: null })
}

/** Duplicates a task as a fresh Pending record (own id, no completedAt), placed right after the original. */
function duplicateTask(taskId) {
  const source = getTaskById(taskId)
  if (!source) return null

  const tasks = readAll()
  const duplicate = {
    ...source,
    id: generateTaskId(),
    title: `${source.title} (Copy)`,
    status: TASK_STATUS.PENDING,
    createdAt: Date.now(),
    completedAt: null,
    order: source.order + 0.5,
  }

  const next = [...tasks, duplicate].sort((a, b) => a.order - b.order).map((task, i) => ({ ...task, order: i }))
  writeAll(next)
  return duplicate
}

/** Reorders tasks to match `orderedIds` (a full or partial id list, most-significant first). */
function reorderTasks(orderedIds) {
  const tasks = readAll()
  const byId = new Map(tasks.map((task) => [task.id, task]))
  const reordered = []

  orderedIds.forEach((id) => {
    if (byId.has(id)) {
      reordered.push(byId.get(id))
      byId.delete(id)
    }
  })
  // Anything not mentioned in orderedIds keeps its relative place at the end.
  byId.forEach((task) => reordered.push(task))

  const next = reordered.map((task, index) => ({ ...task, order: index }))
  writeAll(next)
  return next
}

function moveTask(taskId, direction) {
  const tasks = [...readAll()].sort((a, b) => a.order - b.order)
  const index = tasks.findIndex((task) => task.id === taskId)
  if (index === -1) return tasks

  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= tasks.length) return tasks

  const ids = tasks.map((task) => task.id)
  ;[ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]]
  return reorderTasks(ids)
}

const moveTaskUp = (taskId) => moveTask(taskId, -1)
const moveTaskDown = (taskId) => moveTask(taskId, 1)

/** Tasks due on a given date key (YYYY-MM-DD), sorted by `order`. Tasks with no dueDate are treated as always-today. */
function getTasksForDate(dateKey) {
  return readAll()
    .filter((task) => !task.dueDate || task.dueDate === dateKey)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function getCompletedTasks() {
  return readAll().filter((task) => task.status === TASK_STATUS.COMPLETED)
}

function subscribe(callback) {
  return StorageService.subscribe(TASKS_KEY, callback)
}

export const TaskService = {
  getAllTasks,
  getTaskById,
  getTasksForDate,
  getCompletedTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask,
  duplicateTask,
  reorderTasks,
  moveTaskUp,
  moveTaskDown,
  subscribe,
}

export default TaskService
