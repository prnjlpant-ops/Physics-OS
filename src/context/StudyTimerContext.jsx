import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import {
  generateSessionId,
  saveStudySession,
} from '../utils/studySessionsStorage'

const ACTIVE_TIMER_STORAGE_KEY = 'physicsOS.activeStudyTimer'

const defaultSessionMeta = {
  subject: 'Not Selected',
  chapter: 'None',
  task: 'No active task',
}

const idleState = {
  status: 'idle', // idle | running | paused | ending
  startTime: null,
  lastResumeTime: null,
  accumulatedMs: 0,
  breakMs: 0,
  pauseStart: null,
  endTime: null,
  finalElapsedMs: null,
  finalBreakMs: null,
  ...defaultSessionMeta,
}

function loadActiveTimer() {
  try {
    const raw = localStorage.getItem(ACTIVE_TIMER_STORAGE_KEY)
    if (!raw) return idleState
    const parsed = JSON.parse(raw)
    return { ...idleState, ...parsed }
  } catch {
    return idleState
  }
}

function reducer(state, action) {
  const now = Date.now()

  switch (action.type) {
    case 'START': {
      if (state.status !== 'idle') return state
      return {
        ...idleState,
        subject: state.subject,
        chapter: state.chapter,
        task: state.task,
        status: 'running',
        startTime: now,
        lastResumeTime: now,
      }
    }

    case 'PAUSE': {
      if (state.status !== 'running') return state
      return {
        ...state,
        status: 'paused',
        accumulatedMs: state.accumulatedMs + (now - state.lastResumeTime),
        lastResumeTime: null,
        pauseStart: now,
      }
    }

    case 'RESUME': {
      if (state.status !== 'paused') return state
      return {
        ...state,
        status: 'running',
        lastResumeTime: now,
        pauseStart: null,
        breakMs: state.breakMs + (now - state.pauseStart),
      }
    }

    case 'END_SESSION': {
      if (state.status !== 'running' && state.status !== 'paused') return state
      const finalElapsedMs =
        state.status === 'running'
          ? state.accumulatedMs + (now - state.lastResumeTime)
          : state.accumulatedMs
      const finalBreakMs =
        state.status === 'paused' && state.pauseStart
          ? state.breakMs + (now - state.pauseStart)
          : state.breakMs
      return {
        ...state,
        status: 'ending',
        endTime: now,
        finalElapsedMs,
        finalBreakMs,
      }
    }

    case 'DISCARD_SESSION':
    case 'COMPLETE_SESSION': {
      return {
        ...idleState,
        subject: state.subject,
        chapter: state.chapter,
        task: state.task,
      }
    }

    case 'RESET': {
      if (state.status !== 'idle') return state
      return { ...idleState, subject: state.subject, chapter: state.chapter, task: state.task }
    }

    default:
      return state
  }
}

function getElapsedMs(state, now) {
  if (state.status === 'running') {
    return state.accumulatedMs + (now - state.lastResumeTime)
  }
  if (state.status === 'paused') {
    return state.accumulatedMs
  }
  if (state.status === 'ending') {
    return state.finalElapsedMs ?? 0
  }
  return 0
}

const StudyTimerContext = createContext(null)

export function StudyTimerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadActiveTimer)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (state.status !== 'running') return undefined
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [state.status])

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TIMER_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Local storage unavailable; timer keeps working in-memory only.
    }
  }, [state])

  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [])
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), [])
  const endSession = useCallback(() => dispatch({ type: 'END_SESSION' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])
  const discardSession = useCallback(
    () => dispatch({ type: 'DISCARD_SESSION' }),
    [],
  )

  const completeSession = useCallback(
    (reflection) => {
      const totalStudyTime = state.finalElapsedMs ?? getElapsedMs(state, Date.now())
      const breakTime = state.finalBreakMs ?? state.breakMs

      saveStudySession({
        id: generateSessionId(),
        date: new Date(state.startTime ?? Date.now()).toISOString().slice(0, 10),
        startTime: state.startTime,
        endTime: state.endTime ?? Date.now(),
        totalStudyTime,
        breakTime,
        subject: state.subject,
        chapter: state.chapter,
        task: state.task,
        completedSummary: reflection.completedSummary,
        nextAction: reflection.nextAction,
        conceptualTakeaway: reflection.conceptualTakeaway,
      })

      dispatch({ type: 'COMPLETE_SESSION' })
    },
    [state],
  )

  const elapsedMs = getElapsedMs(state, now)

  const value = useMemo(
    () => ({
      status: state.status,
      subject: state.subject,
      chapter: state.chapter,
      task: state.task,
      startTime: state.startTime,
      elapsedMs,
      breakMs: state.status === 'ending' ? state.finalBreakMs ?? state.breakMs : state.breakMs,
      isSessionActive: state.status === 'running' || state.status === 'paused',
      isEndModalOpen: state.status === 'ending',
      start,
      pause,
      resume,
      endSession,
      reset,
      discardSession,
      completeSession,
    }),
    [
      state.status,
      state.subject,
      state.chapter,
      state.task,
      state.startTime,
      state.breakMs,
      state.finalBreakMs,
      elapsedMs,
      start,
      pause,
      resume,
      endSession,
      reset,
      discardSession,
      completeSession,
    ],
  )

  return (
    <StudyTimerContext.Provider value={value}>
      {children}
    </StudyTimerContext.Provider>
  )
}

export function useStudyTimer() {
  const context = useContext(StudyTimerContext)
  if (!context) {
    throw new Error('useStudyTimer must be used within a StudyTimerProvider')
  }
  return context
}
