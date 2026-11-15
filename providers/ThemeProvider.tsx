'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  mounted: false,
})

const DARK_QUERY = '(prefers-color-scheme: dark)'
// Not 'theme': older versions wrote that key on every visit, so it doesn't
// reflect a real choice. Keep in sync with themeScript in app/layout.tsx.
const STORAGE_KEY = 'theme-choice'

// A stored value only exists once the visitor has picked a theme themselves.
function readStored(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    setTheme(readStored() ?? (media.matches ? 'dark' : 'light'))
    setMounted(true)

    // Follow the system setting live until the visitor picks a theme.
    const onChange = (e: MediaQueryListEvent) => {
      if (readStored() === null) setTheme(e.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try {
      // Picking the theme the system already uses clears the override, so the
      // site goes back to following the system setting.
      const system: Theme = window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
      if (next === system) localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
