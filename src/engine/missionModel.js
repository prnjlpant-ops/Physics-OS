import { totalEstimatedMinutes, completedTaskCount } from './taskModel'

/**
 * MISSION MODEL
 * =============
 * Sprint 19A — Daily Study Engine (Core).
 *
 * The reusable shape for "Today's Mission": one Subject -> one Chapter ->
 * one Topic -> a list of Tasks (see taskModel.js). Only one topic is ever
 * "in focus" at a time, mirroring how a person actually studies — this is
 * intentionally not a full-day, multi-topic schedule (that is adaptive
 * scheduling, explicitly out of scope for this sprint).
 *
 * Mission shape:
 * {
 *   date, subject: {id, name}, chapter: {slug, name},
 *   topic: {id, name}, tasks: Task[], totalEstimatedMinutes,
 *   completedTaskCount, isAllCaughtUp, isEmpty
 * }
 */
export function createMission({
  date = new Date().toISOString().slice(0, 10),
  subject = null,
  chapter = null,
  topic = null,
  tasks = [],
  isAllCaughtUp = false,
  isEmpty = false,
}) {
  return {
    date,
    subject,
    chapter,
    topic,
    tasks,
    totalEstimatedMinutes: totalEstimatedMinutes(tasks),
    completedTaskCount: completedTaskCount(tasks),
    isAllCaughtUp,
    isEmpty,
  }
}
