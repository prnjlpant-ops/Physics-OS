import { useCallback, useEffect, useState } from 'react'
import { TIME_BLOCK_ORDER } from '../constants/plannerConstants'

const ORDER_STORAGE_KEY = 'physicsOS.plannerOrder'
const ORDER_EVENT = 'physicsOS.plannerOrderChanged'

function readOrderStore() {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeOrderStore(store) {
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new Event(ORDER_EVENT))
  } catch {
    // Local storage unavailable or full; order won't persist, fail silently.
  }
}

/**
 * Local-first store for the Planner's Morning/Afternoon/Evening/Flexible
 * block assignment + in-block ordering, keyed by date so each day starts
 * from the Planner Service's own default arrangement
 * (plannerService.buildDefaultBlockOrder) until the user moves something.
 *
 * UI-only reordering: this hook never decides *what* the order should be,
 * only remembers what the user did with Move Up / Move Down / Reset Today.
 */
export function usePlannerOrder(dateKey) {
  const [store, setStore] = useState(readOrderStore)

  useEffect(() => {
    const sync = () => setStore(readOrderStore())
    window.addEventListener(ORDER_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(ORDER_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const blockOrder = store[dateKey] ?? null

  const persistOrder = useCallback(
    (nextOrder) => {
      setStore((prev) => {
        const next = { ...prev, [dateKey]: nextOrder }
        writeOrderStore(next)
        return next
      })
    },
    [dateKey],
  )

  const moveTask = useCallback(
    (currentOrder, taskId, direction) => {
      const block = TIME_BLOCK_ORDER.find((b) => currentOrder[b]?.includes(taskId))
      if (!block) return
      const ids = [...currentOrder[block]]
      const index = ids.indexOf(taskId)
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= ids.length) return
      ;[ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]]
      persistOrder({ ...currentOrder, [block]: ids })
    },
    [persistOrder],
  )

  const moveTaskUp = useCallback((currentOrder, taskId) => moveTask(currentOrder, taskId, -1), [moveTask])
  const moveTaskDown = useCallback((currentOrder, taskId) => moveTask(currentOrder, taskId, 1), [moveTask])

  const resetOrder = useCallback(
    (defaultOrder) => {
      persistOrder(defaultOrder)
    },
    [persistOrder],
  )

  return { blockOrder, persistOrder, moveTaskUp, moveTaskDown, resetOrder }
}
