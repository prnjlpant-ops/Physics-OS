import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MENU_ACTIONS } from '../constants/desktopConstants'
import DesktopService from '../services/DesktopService'
import ExportService from '../services/ExportService'
import ImportService from '../services/ImportService'
import NotificationService from '../services/NotificationService'
import { setKnowledgeBaseRootPath } from '../hooks/useKnowledgeBaseSettings'

export default function useDesktopMenu() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!DesktopService.isElectronReady() || !window.physicsOSDesktop?.menu?.onAction) {
      return undefined
    }

    const unsubscribe = window.physicsOSDesktop.menu.onAction(async ({ action, payload }) => {
      switch (action) {
        case MENU_ACTIONS.OPEN_KNOWLEDGE_BASE_FOLDER: {
          if (payload && typeof payload.path === 'string') {
            setKnowledgeBaseRootPath(payload.path)
            NotificationService.success('Knowledge Base folder selected.')
          }
          break
        }
        case MENU_ACTIONS.EXPORT: {
          const { success, canceled, error } = await ExportService.exportCategoriesNative(
            ExportService.EXPORT_CATEGORIES,
            'physics-os-export.json',
          )
          if (success) {
            NotificationService.success('Data exported successfully.')
          } else if (!canceled) {
            NotificationService.error(error ?? 'Export failed.')
          }
          break
        }
        case MENU_ACTIONS.IMPORT: {
          const { success, canceled, unsupported, error, payload: importPayload } = await ImportService.importFromNative()
          if (unsupported) {
            NotificationService.error('Native import is available only in the desktop build.')
            break
          }
          if (canceled) break
          if (!success) {
            NotificationService.error(error ?? 'Could not read that file.')
            break
          }
          const confirmed = await window.confirm(
            'Import data from the selected file? Existing data with the same keys will be overwritten.',
          )
          if (!confirmed) break
          const { applied } = ImportService.applyPayload(importPayload)
          NotificationService.success(`Imported ${applied} item${applied === 1 ? '' : 's'}.`)
          break
        }
        case MENU_ACTIONS.SEARCH:
          navigate('/resources')
          break
        case MENU_ACTIONS.NEW_STUDY_SESSION:
          navigate('/study-timer')
          break
        case MENU_ACTIONS.TODAYS_MISSION:
          navigate('/todays-mission')
          break
        default:
          break
      }
    })

    return unsubscribe
  }, [navigate])
}
