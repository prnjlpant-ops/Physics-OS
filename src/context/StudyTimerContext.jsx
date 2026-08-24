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
import { toDateKey } from '../utils/calendarStats'

const ACTIVE_TIMER_STORAGE_KEY = 'physicsOS.activeStudyTimer'

const defaultSessionMeta = {
  subject: 'Not Selected',
  chapter: 'None',
  task: 'No active task',
  // Sprint 27: when set, links this session to a Topic Index record so the
  // Study Session workspace can surface that topic's mapped resources
  // (see components/timer/SessionResourceLinks.jsx + engine/topics/studyMappingService.js).
  topicId: null,
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
  // Sprint 27: resources opened during this session (Session Model field
  // `resourcesOpened`) and autosaved session notes.
  resourcesOpened: [],
  notes: '',
  focusTargetMs: 50 * 60 * 1000,
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
    case 'SET_TOPIC': {
      // Only meaningful before a session starts — mid-session topic changes
      // would make "resourcesOpened" and the reflection ambiguous.
      if (state.status !== 'idle') return state
      return {
        ...state,
        subject: action.subject ?? state.subject,
        chapter: action.chapter ?? state.chapter,
        task: action.task ?? state.task,
        topicId: action.topicId ?? null,
      }
    }

    case 'LOG_RESOURCE': {
      if (state.status !== 'running' && state.status !== 'paused') return state
      if (state.resourcesOpened.some((r) => r.id === action.resource.id)) return state
      return { ...state, resourcesOpened: [...state.resourcesOpened, action.resource] }
    }

    case 'SET_NOTES': {
      return { ...state, notes: action.notes }
    }

    case 'SET_FOCUS_TARGET': {
      if (state.status !== 'idle') return state
      return { ...state, focusTargetMs: action.focusTargetMs }
    }

    case 'START': {
      if (state.status !== 'idle') return state
      return {
        ...idleState,
        subject: state.subject,
        chapter: state.chapter,
        task: state.task,
        topicId: state.topicId,
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
        topicId: state.topicId,
      }
    }

    case 'RESET': {
      if (state.status !== 'idle') return state
      return { ...idleState, subject: state.subject, chapter: state.chapter, task: state.task, topicId: state.topicId }
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
  const setTopic = useCallback(
    ({ subject, chapter, task, topicId }) => dispatch({ type: 'SET_TOPIC', subject, chapter, task, topicId }),
    [],
  )
  const logResourceOpened = useCallback(
    (resource) => dispatch({ type: 'LOG_RESOURCE', resource }),
    [],
  )
  const setNotes = useCallback((notes) => dispatch({ type: 'SET_NOTES', notes }), [])
  const setFocusTarget = useCallback((focusTargetMs) => dispatch({ type: 'SET_FOCUS_TARGET', focusTargetMs }), [])

  const completeSession = useCallback(
    (reflection) => {
      const totalStudyTime = state.finalElapsedMs ?? getElapsedMs(state, Date.now())
      const breakTime = state.finalBreakMs ?? state.breakMs

      saveStudySession({
        id: generateSessionId(),
        date: toDateKey(state.startTime ?? Date.now()),
        startTime: state.startTime,
        endTime: state.endTime ?? Date.now(),
        duration: totalStudyTime,
        totalStudyTime,
        breakTime,
        subject: state.subject,
        chapter: state.chapter,
        task: state.task,
        topic: state.topicId,
        topicId: state.topicId,
        resourcesOpened: state.resourcesOpened,
        tasksCompleted: reflection.tasksCompleted ?? [],
        notes: state.notes,
        // Sprint 27 Reflection fields (see services/ReflectionService.js).
        reflection: {
          whatStudied: reflection.whatStudied ?? reflection.completedSummary ?? '',
          whatWasDifficult: reflection.whatWasDifficult ?? '',
          whatToRevise: reflection.whatToRevise ?? reflection.nextAction ?? '',
        },
        confidence: reflection.confidence ?? null,
        // Legacy fields kept for backward compatibility with sessions saved
        // before this sprint and existing renderers (e.g. DayDetailPanel).
        completedSummary: reflection.whatStudied ?? reflection.completedSummary ?? '',
        nextAction: reflection.whatToRevise ?? reflection.nextAction ?? '',
        conceptualTakeaway: reflection.conceptualTakeaway ?? '',
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
      topicId: state.topicId,
      resourcesOpened: state.resourcesOpened,
      notes: state.notes,
      startTime: state.startTime,
      elapsedMs,
      breakMs: state.status === 'ending' ? state.finalBreakMs ?? state.breakMs : state.breakMs,
      focusTargetMs: state.focusTargetMs,
      isSessionActive: state.status === 'running' || state.status === 'paused',
      isEndModalOpen: state.status === 'ending',
      start,
      pause,
      resume,
      endSession,
      reset,
      discardSession,
      completeSession,
      setTopic,
      logResourceOpened,
      setNotes,
      setFocusTarget,
    }),
    [
      state.status,
      state.subject,
      state.chapter,
      state.task,
      state.topicId,
      state.resourcesOpened,
      state.notes,
      state.startTime,
      state.breakMs,
      state.finalBreakMs,
      state.focusTargetMs,
      elapsedMs,
      start,
      pause,
      resume,
      endSession,
      reset,
      discardSession,
      completeSession,
      setTopic,
      logResourceOpened,
      setNotes,
      setFocusTarget,
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
