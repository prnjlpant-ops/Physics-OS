/**
 * BACKUP SERVICE
 * ==============
 * One-Click Backup & Restore and Scoped Reset Engine for Physics OS.
 *
 * Backs up all `physicsOS.*` namespaced localStorage entries into a single JSON
 * archive with metadata, and restores them safely with schema validation.
 * Also provides scoped reset utilities for individual feature domains.
 */

const NAMESPACE_PREFIX = 'physicsOS.'

/**
 * Iterates localStorage and collects all keys prefixed with `physicsOS.`.
 * Returns a key-value data dictionary.
 */
export function getAllNamespacedData() {
  const data = {}
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const fullKey = localStorage.key(i)
      if (!fullKey || !fullKey.startsWith(NAMESPACE_PREFIX)) continue

      try {
        const raw = localStorage.getItem(fullKey)
        data[fullKey] = raw ? JSON.parse(raw) : null
      } catch {
        data[fullKey] = localStorage.getItem(fullKey)
      }
    }
  } catch (err) {
    console.error('Failed to read localStorage for backup:', err)
  }
  return data
}

/**
 * Builds the full backup payload object.
 */
export function createBackupPayload() {
  const data = getAllNamespacedData()
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  }
}

/**
 * Triggers a browser file download for a JSON string.
 */
function triggerBrowserDownload(filename, jsonString) {
  try {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename.endsWith('.json') ? filename : `${filename}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    return true
  } catch (err) {
    console.error('Download failed:', err)
    return false
  }
}

/**
 * One-Click Backup Export.
 * Generates a JSON backup file named `physicsOS_backup_YYYY-MM-DD.json` and triggers browser download.
 */
export function exportBackup() {
  const payload = createBackupPayload()
  const dateStr = new Date().toISOString().slice(0, 10)
  const filename = `physicsOS_backup_${dateStr}.json`
  const jsonString = JSON.stringify(payload, null, 2)
  const success = triggerBrowserDownload(filename, jsonString)
  const count = Object.keys(payload.data).length

  return { success, count, filename }
}

/**
 * Parses and validates an imported backup payload.
 */
export function parseBackupFile(fileContent) {
  try {
    const parsed = typeof fileContent === 'string' ? JSON.parse(fileContent) : fileContent
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'File does not contain valid JSON.', payload: null }
    }

    let dataObj = parsed.data
    if (!dataObj || typeof dataObj !== 'object') {
      // Check if the JSON is directly a key-value dictionary of physicsOS keys
      const keys = Object.keys(parsed)
      const hasPhysicsKeys = keys.some((k) => k.startsWith(NAMESPACE_PREFIX))
      if (hasPhysicsKeys) {
        dataObj = parsed
      } else {
        return { success: false, error: 'Invalid backup file format: missing "data" container.', payload: null }
      }
    }

    const dataKeys = Object.keys(dataObj)
    if (dataKeys.length === 0) {
      return { success: false, error: 'Backup file contains no data entries.', payload: null }
    }

    return { success: true, error: null, payload: { ...parsed, data: dataObj } }
  } catch (err) {
    return { success: false, error: 'Failed to parse JSON file: ' + err.message, payload: null }
  }
}

/**
 * One-Click Backup Restore.
 * Writes all `physicsOS.*` keys from the validated payload into localStorage and reloads the window.
 *
 * @param {string|object} fileContent - Raw JSON string or parsed object from uploaded file
 * @param {boolean} [autoReload=true] - Whether to reload the page automatically after applying
 */
export function importBackup(fileContent, autoReload = true) {
  const { success, error, payload } = parseBackupFile(fileContent)
  if (!success || !payload) {
    return { success: false, error: error ?? 'Invalid backup payload.', applied: 0 }
  }

  let applied = 0
  try {
    Object.entries(payload.data).forEach(([rawKey, value]) => {
      const fullKey = rawKey.startsWith(NAMESPACE_PREFIX) ? rawKey : `${NAMESPACE_PREFIX}${rawKey}`
      try {
        localStorage.setItem(fullKey, typeof value === 'string' ? value : JSON.stringify(value))
        applied += 1
        // Dispatch custom storage event for this key
        window.dispatchEvent(new Event(`physicsOS.storageChanged:${fullKey}`))
      } catch (writeErr) {
        console.warn(`Could not restore key ${fullKey}:`, writeErr)
      }
    })

    // Dispatch global storage events
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new Event('physicsOS.notesChanged'))
    window.dispatchEvent(new Event('physicsOS.studySessionsChanged'))
    window.dispatchEvent(new Event('physicsOS.plannerSettingsChanged'))
    window.dispatchEvent(new Event('physicsOS.knowledgeBaseSettingsChanged'))

    if (autoReload && typeof window !== 'undefined' && window.location) {
      setTimeout(() => {
        window.location.reload()
      }, 250)
    }

    return { success: true, applied, error: null }
  } catch (err) {
    return { success: false, applied, error: err.message }
  }
}

/**
 * Scope definitions for targeted feature resets.
 */
export const SCOPES = {
  ACTIVE_TIMER: 'activeTimer',
  STUDY_HISTORY: 'studyHistory',
  NOTES_AND_BOOKMARKS: 'notesAndBookmarks',
  MOCK_TESTS: 'mockTests',
  ERROR_LOG: 'errorLog',
}

/**
 * Returns item counts and status for each scoped feature area.
 */
export function getScopedCounts() {
  const counts = {
    [SCOPES.ACTIVE_TIMER]: { label: 'Idle / None', active: false, count: 0 },
    [SCOPES.STUDY_HISTORY]: { count: 0, label: '0 study sessions' },
    [SCOPES.NOTES_AND_BOOKMARKS]: { count: 0, notesCount: 0, bookmarksCount: 0, label: '0 items' },
    [SCOPES.MOCK_TESTS]: { count: 0, label: '0 mock items' },
    [SCOPES.ERROR_LOG]: { count: 0, label: '0 error entries' },
  }

  try {
    // 1. Active Study Timer
    const timerRaw = localStorage.getItem('physicsOS.activeStudyTimer')
    if (timerRaw) {
      try {
        const timer = JSON.parse(timerRaw)
        if (timer && timer.status && timer.status !== 'idle') {
          counts[SCOPES.ACTIVE_TIMER] = {
            label: `Status: ${timer.status} (${timer.subject || 'No topic'})`,
            active: true,
            count: 1,
          }
        }
      } catch {
        // ignore parse error
      }
    }

    // 2. Study History
    const sessionsRaw = localStorage.getItem('physicsOS.studySessions')
    if (sessionsRaw) {
      try {
        const sessions = JSON.parse(sessionsRaw)
        if (Array.isArray(sessions)) {
          counts[SCOPES.STUDY_HISTORY] = {
            count: sessions.length,
            label: `${sessions.length} session${sessions.length === 1 ? '' : 's'} recorded`,
          }
        }
      } catch {
        // ignore
      }
    }

    // 3. Notes & Bookmarks
    let notesCount = 0
    let bookmarksCount = 0
    const notesRaw = localStorage.getItem('physicsOS.notes')
    if (notesRaw) {
      try {
        const notes = JSON.parse(notesRaw)
        if (Array.isArray(notes)) notesCount = notes.length
      } catch {
        // ignore
      }
    }

    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (!key) continue
      if (
        key.includes('Bookmark') ||
        key.includes('bookmark') ||
        key.includes('favorite') ||
        key.includes('Favorites')
      ) {
        try {
          const val = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(val)) {
            bookmarksCount += val.length
          } else if (val && typeof val === 'object') {
            bookmarksCount += Object.keys(val).length
          }
        } catch {
          // ignore
        }
      }
    }

    const totalNotesAndBookmarks = notesCount + bookmarksCount
    counts[SCOPES.NOTES_AND_BOOKMARKS] = {
      count: totalNotesAndBookmarks,
      notesCount,
      bookmarksCount,
      label: `${notesCount} note${notesCount === 1 ? '' : 's'}, ${bookmarksCount} bookmark${bookmarksCount === 1 ? '' : 's'}`,
    }

    // 4. Mock Tests
    let mockCount = 0
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (key && key.startsWith('physicsOS.mock')) {
        try {
          const val = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(val)) mockCount += val.length
          else if (val && typeof val === 'object') mockCount += Object.keys(val).length
          else if (val !== null) mockCount += 1
        } catch {
          mockCount += 1
        }
      }
    }
    counts[SCOPES.MOCK_TESTS] = {
      count: mockCount,
      label: `${mockCount} mock record${mockCount === 1 ? '' : 's'}`,
    }

    // 5. Error Learning Log
    let errorCount = 0
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (key && key.startsWith('physicsOS.error')) {
        try {
          const val = JSON.parse(localStorage.getItem(key))
          if (Array.isArray(val)) errorCount += val.length
          else if (val && typeof val === 'object') errorCount += Object.keys(val).length
          else if (val !== null) errorCount += 1
        } catch {
          errorCount += 1
        }
      }
    }
    counts[SCOPES.ERROR_LOG] = {
      count: errorCount,
      label: `${errorCount} error log item${errorCount === 1 ? '' : 's'}`,
    }
  } catch (err) {
    console.warn('Error computing scoped counts:', err)
  }

  return counts
}

/**
 * Resets an individual scoped feature domain.
 */
export function resetScope(scope) {
  try {
    switch (scope) {
      case SCOPES.ACTIVE_TIMER: {
        localStorage.removeItem('physicsOS.activeStudyTimer')
        window.dispatchEvent(new Event('physicsOS.storageChanged:physicsOS.activeStudyTimer'))
        window.dispatchEvent(new Event('storage'))
        break
      }

      case SCOPES.STUDY_HISTORY: {
        localStorage.removeItem('physicsOS.studySessions')
        window.dispatchEvent(new Event('physicsOS.studySessionsChanged'))
        window.dispatchEvent(new Event('physicsOS.storageChanged:physicsOS.studySessions'))
        window.dispatchEvent(new Event('storage'))
        break
      }

      case SCOPES.NOTES_AND_BOOKMARKS: {
        localStorage.removeItem('physicsOS.notes')
        window.dispatchEvent(new Event('physicsOS.notesChanged'))
        window.dispatchEvent(new Event('physicsOS.storageChanged:physicsOS.notes'))

        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i)
          if (!key) continue
          if (
            key.startsWith(NAMESPACE_PREFIX) &&
            (key.includes('Bookmark') ||
              key.includes('bookmark') ||
              key.includes('favorite') ||
              key.includes('Favorites'))
          ) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key)
          window.dispatchEvent(new Event(`physicsOS.storageChanged:${key}`))
        })
        window.dispatchEvent(new Event('storage'))
        break
      }

      case SCOPES.MOCK_TESTS: {
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i)
          if (key && key.startsWith('physicsOS.mock')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key)
          window.dispatchEvent(new Event(`physicsOS.storageChanged:${key}`))
        })
        window.dispatchEvent(new Event('storage'))
        break
      }

      case SCOPES.ERROR_LOG: {
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i)
          if (key && key.startsWith('physicsOS.error')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key)
          window.dispatchEvent(new Event(`physicsOS.storageChanged:${key}`))
        })
        window.dispatchEvent(new Event('storage'))
        break
      }

      default:
        return { success: false, error: 'Unknown scope' }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const BackupService = {
  getAllNamespacedData,
  createBackupPayload,
  exportBackup,
  parseBackupFile,
  importBackup,
  SCOPES,
  getScopedCounts,
  resetScope,
}

export default BackupService
