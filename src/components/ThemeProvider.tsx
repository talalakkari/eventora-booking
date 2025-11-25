import { ReactNode } from 'react'
import { useThemeState } from '@/hooks/useTheme'

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: 'dark' | 'light' | 'system'
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  useThemeState(defaultTheme, storageKey)

  return <>{children}</>
}