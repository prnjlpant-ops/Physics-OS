/**
 * REFLECTION SERVICE
 * ==================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Owns the reflection question set the sprint spec requires at the end of
 * every study session: What did you study? What was difficult? Confidence
 * (1-5)? What should be revised? This is a small, pure module (question
 * definitions + a blank-draft builder + a light shape check) — the actual
 * persistence is `context/StudyTimerContext.jsx`'s `completeSession`,
 * which already owns writing to the session store via
 * `utils/studySessionsStorage.js`. Kept separate so `EndSessionModal.jsx`
 * and any future reflection surface (e.g. a Reflection History page) share
 * one definition instead of hardcoding the four questions twice.
 */

export const CONFIDENCE_SCALE = [1, 2, 3, 4, 5]

export const CONFIDENCE_LABELS = {
  1: 'Not confident',
  2: 'Shaky',
  3: 'Okay',
  4: 'Confident',
  5: 'Very confident',
}

export const REFLECTION_FIELDS = [
  { key: 'whatStudied', label: 'What did you study?', kind: 'textarea' },
  { key: 'whatWasDifficult', label: 'What was difficult?', kind: 'textarea' },
  { key: 'confidence', label: 'Confidence (1–5)', kind: 'scale' },
  { key: 'whatToRevise', label: 'What should be revised?', kind: 'text' },
]

export function createBlankReflection() {
  return {
    whatStudied: '',
    whatWasDifficult: '',
    confidence: null,
    whatToRevise: '',
  }
}

/** True if the reflection has at least one answered field — used to decide whether to show a summary. */
export function hasReflectionContent(reflection) {
  if (!reflection) return false
  return Boolean(
    reflection.whatStudied?.trim() ||
      reflection.whatWasDifficult?.trim() ||
      reflection.confidence ||
      reflection.whatToRevise?.trim(),
  )
}

export const ReflectionService = {
  CONFIDENCE_SCALE,
  CONFIDENCE_LABELS,
  REFLECTION_FIELDS,
  createBlankReflection,
  hasReflectionContent,
}

export default ReflectionService
