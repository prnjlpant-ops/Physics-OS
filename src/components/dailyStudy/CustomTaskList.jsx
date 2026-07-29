import { useMemo, useState } from 'react'
import { Plus, ListPlus } from 'lucide-react'
import { useCustomTasks } from '../../hooks/useCustomTasks'
import CustomTaskCard from './CustomTaskCard'
import TaskFormModal from './TaskFormModal'
import EmptyState from '../../pages/subject/EmptyState'

/**
 * CUSTOM TASK LIST
 * ================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * The manual task layer of Today's Mission — sits alongside the existing
 * syllabus-generated Planner blocks (`useDailyPlanner`) without touching
 * them. Supports Add / Edit / Delete / Complete / Reorder / Duplicate, all
 * backed by `TaskService` through `useCustomTasks`.
 */
export default function CustomTaskList({ dateKey }) {
  const { tasks, addTask, editTask, removeTask, completeTask, reopenTask, duplicateTask, moveUp, moveDown } =
    useCustomTasks(dateKey)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [search, setSearch] = useState('')

  const visibleTasks = useMemo(() => {
    if (!search.trim()) return tasks
    const q = search.trim().toLowerCase()
    return tasks.filter((task) =>
      [task.title, task.description, task.subject, task.chapter, task.topic, task.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [tasks, search])

  const openAddModal = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSave = (form) => {
    if (editingTask) editTask(editingTask.id, form)
    else addTask(form)
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#e8e8e8]">My Tasks</h2>
          <p className="text-xs text-[#858585]">Custom tasks you add yourself — reading, PYQs, revision, mock tests, or anything else.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-md border border-[#0e639c] bg-[#0e639c] px-3 py-1.5 text-xs font-medium text-[#ffffff] transition-colors duration-150 hover:bg-[#1177bb]"
        >
          <Plus size={13} strokeWidth={1.75} />
          Add Task
        </button>
      </div>

      {tasks.length > 0 && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="mt-3 w-full rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-1.5 text-xs text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
        />
      )}

      <div className="mt-4 flex flex-col gap-2">
        {tasks.length === 0 && (
          <EmptyState icon={ListPlus} title="No custom tasks yet" description="Add a task to plan reading, PYQs, revision, or anything else for today." />
        )}

        {tasks.length > 0 && visibleTasks.length === 0 && (
          <p className="py-4 text-center text-xs text-[#858585]">No tasks match &ldquo;{search}&rdquo;.</p>
        )}

        {visibleTasks.map((task, index) => (
          <CustomTaskCard
            key={task.id}
            task={task}
            isFirst={index === 0}
            isLast={index === visibleTasks.length - 1}
            onComplete={completeTask}
            onReopen={reopenTask}
            onEdit={openEditModal}
            onDuplicate={duplicateTask}
            onDelete={removeTask}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
          />
        ))}
      </div>

      <TaskFormModal
        open={modalOpen}
        initialTask={editingTask}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false)
          setEditingTask(null)
        }}
      />
    </section>
  )
}
