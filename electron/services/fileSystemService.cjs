/**
 * FILE SYSTEM SERVICE (Electron / main process)
 * ================================================
 * Sprint 29B — Native Desktop Integration.
 *
 * Real disk access for the desktop build. Physics OS is a personal,
 * single-user, offline-first application (see PROJECT_CONTEXT.md) reading
 * paths the user themselves configured (Knowledge Base root, individual
 * resource paths) or picked via a native dialog — there is no remote
 * input here to sandbox against, so every function operates on whatever
 * absolute path it's given.
 *
 * Every function resolves/rejects in a way `ipc/handlers.cjs`'s
 * `safeHandle` can turn into a clean `IpcFailure` — Node's raw `ENOENT`/
 * `EACCES` errors are re-thrown with a readable message instead of a
 * bare error code.
 */

const fs = require('fs/promises')
const fsSync = require('fs')

function friendlyError(error, targetPath) {
  if (error?.code === 'ENOENT') return new Error(`No such file or folder: ${targetPath}`)
  if (error?.code === 'EACCES' || error?.code === 'EPERM') return new Error(`Permission denied: ${targetPath}`)
  if (error?.code === 'ENOTDIR') return new Error(`Not a folder: ${targetPath}`)
  if (error?.code === 'EISDIR') return new Error(`Expected a file, found a folder: ${targetPath}`)
  return error instanceof Error ? error : new Error(String(error))
}

async function readFile(targetPath, encoding = 'utf-8') {
  if (!targetPath || typeof targetPath !== 'string') throw new Error('A file path is required.')
  try {
    return await fs.readFile(targetPath, { encoding })
  } catch (error) {
    throw friendlyError(error, targetPath)
  }
}

async function writeFile(targetPath, contents, encoding = 'utf-8') {
  if (!targetPath || typeof targetPath !== 'string') throw new Error('A file path is required.')
  try {
    await fs.writeFile(targetPath, contents ?? '', { encoding })
    return true
  } catch (error) {
    throw friendlyError(error, targetPath)
  }
}

/** Never throws — existence checks should always be able to answer `false`. */
async function exists(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') return false
  try {
    await fs.access(targetPath, fsSync.constants.F_OK)
    return true
  } catch {
    return false
  }
}

/** Directory listing with enough metadata for a simple file browser (name, whether it's a folder). */
async function listDir(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') throw new Error('A folder path is required.')
  try {
    const entries = await fs.readdir(targetPath, { withFileTypes: true })
    return entries
      .map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        isFile: entry.isFile(),
      }))
      .sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1
        return a.name.localeCompare(b.name)
      })
  } catch (error) {
    throw friendlyError(error, targetPath)
  }
}

/** File/folder metadata — size, timestamps, kind. */
async function stat(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') throw new Error('A path is required.')
  try {
    const info = await fs.stat(targetPath)
    return {
      size: info.size,
      isDirectory: info.isDirectory(),
      isFile: info.isFile(),
      createdAt: info.birthtime?.toISOString?.() ?? null,
      modifiedAt: info.mtime?.toISOString?.() ?? null,
    }
  } catch (error) {
    throw friendlyError(error, targetPath)
  }
}

/**
 * Validates a candidate Knowledge Base root (or any folder): exists, is
 * actually a directory, and is readable. Never throws — callers (the
 * Knowledge Base settings flow) need a structured `{ valid, reason }`
 * rather than a rejected Promise to show inline in the UI.
 */
async function validateDir(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') {
    return { valid: false, reason: 'No folder path given.' }
  }
  try {
    const info = await fs.stat(targetPath)
    if (!info.isDirectory()) return { valid: false, reason: 'That path is not a folder.' }
  } catch (error) {
    if (error?.code === 'ENOENT') return { valid: false, reason: 'That folder does not exist.' }
    return { valid: false, reason: 'That folder could not be read.' }
  }
  try {
    await fs.access(targetPath, fsSync.constants.R_OK)
  } catch {
    return { valid: false, reason: 'That folder is not readable.' }
  }
  return { valid: true, reason: null }
}

module.exports = { readFile, writeFile, exists, listDir, stat, validateDir }
