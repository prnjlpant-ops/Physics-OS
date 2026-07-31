declare global {
  interface Window {
    physicsOSDesktop?: {
      ready?: boolean
      environment?: string
      isDev?: boolean
      platform?: string
      versions?: Record<string, string>
      clipboard?: {
        readText?: () => Promise<string>
        writeText?: (text: string) => Promise<void>
      }
      dialog?: {
        show?: (options?: unknown) => Promise<unknown>
        openFolder?: (options?: unknown) => Promise<{ canceled?: boolean; path?: string | null; unsupported?: boolean }>
        openFile?: (options?: unknown) => Promise<{ canceled?: boolean; paths?: string[]; unsupported?: boolean }>
        saveFile?: (options?: unknown) => Promise<{ canceled?: boolean; path?: string | null; unsupported?: boolean }>
      }
      notification?: {
        show?: (options?: unknown) => Promise<unknown>
      }
      fileSystem?: {
        readFile?: (path: string, encoding?: string) => Promise<string>
        writeFile?: (path: string, contents: string, encoding?: string) => Promise<void>
        exists?: (path: string) => Promise<boolean>
        listDir?: (path: string) => Promise<unknown[]>
        stat?: (path: string) => Promise<unknown>
        validateDir?: (path: string) => Promise<{ valid?: boolean; reason?: string }>
      }
      resource?: {
        open?: (path: string) => Promise<unknown>
        reveal?: (path: string) => Promise<unknown>
      }
      workspace?: {
        getBounds?: () => Promise<unknown>
        setBounds?: (bounds: unknown) => Promise<unknown>
        getState?: () => Promise<unknown>
        setState?: (changes: unknown) => Promise<unknown>
      }
      menu?: {
        onAction?: (callback: (payload: { action?: string; payload?: unknown }) => void) => () => void
      }
    }
  }
}

export {}
