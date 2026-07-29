import { useCallback, useEffect, useMemo, useState } from 'react'
import TaskService from '../services/TaskService'
import { toDateKey } from '../utils/calendarStats'

/**
 * useCustomTasks
 * ==============
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Live view over `TaskService`'s store, scoped to "today" (or any date
 * passed in) — mirrors the read/subscribe pattern every other hook in this
 * app already uses (`useNotes`, `useMissionTaskStatus`, etc.), just backed
 * by `StorageService` through `TaskService` instead of a bespoke key.
 */
export function useCustomTasks(dateKey = toDateKey(new Date())) {
  const [tasks, setTasks] = useState(TaskService.getAllTasks)

  useEffect(() => TaskService.subscribe(() => setTasks(TaskService.getAllTasks())), [])

  const tasksForDate = useMemo(() => TaskService.getTasksForDate(dateKey), [tasks, dateKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const addTask = useCallback((draft) => TaskService.createTask({ ...draft, dueDate: draft.dueDate ?? dateKey }), [dateKey])
  const editTask = useCallback((taskId, changes) => TaskService.updateTask(taskId, changes), [])
  const removeTask = useCallback((taskId) => TaskService.deleteTask(taskId), [])
  const completeTask = useCallback((taskId) => TaskService.completeTask(taskId), [])
  const reopenTask = useCallback((taskId) => TaskService.reopenTask(taskId), [])
  const duplicateTask = useCallback((taskId) => TaskService.duplicateTask(taskId), [])
  const moveUp = useCallback((taskId) => TaskService.moveTaskUp(taskId), [])
  const moveDown = useCallback((taskId) => TaskService.moveTaskDown(taskId), [])

  return {
    tasks: tasksForDate,
    allTasks: tasks,
    addTask,
    editTask,
    removeTask,
    completeTask,
    reopenTask,
    duplicateTask,
    moveUp,
    moveDown,
  }
}

export default useCustomTasks
