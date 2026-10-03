'use client'

// Window manager state for JolieOS.
// Every open window is one entry in `windows`; z-order is a counter that
// increments whenever a window is focused.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { getMeta, parseHash, windowId, type AppId } from './registry'

export const MENU_H = 24 // top menu bar height (px)
export const DOCK_H = 84 // space reserved for the dock (px)

export interface Win {
  id: string
  app: AppId
  param?: string
  title: string
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  maximized: boolean
  centered: boolean // true until the window is laid out against the real viewport
}

interface State {
  windows: Win[]
  topZ: number
  opened: number // running count, used to cascade new windows
}

type Action =
  | { type: 'open'; app: AppId; param?: string; vw: number; vh: number }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'toggleMax'; id: string }
  | { type: 'move'; id: string; x: number; y: number }
  | { type: 'resize'; id: string; w: number; h: number }
  | { type: 'layout'; vw: number; vh: number }
  | { type: 'closeAll' }

function fit(w: Win, vw: number, vh: number): Win {
  const maxW = vw - 16
  const maxH = vh - MENU_H - DOCK_H - 16
  const width = Math.min(w.w, maxW)
  const height = Math.min(w.h, maxH)
  let { x, y } = w
  if (w.centered) {
    // Nudge right on wide screens so the desktop widgets stay visible
    x = Math.round((vw - width) / 2)
    y = Math.round(MENU_H + (vh - MENU_H - DOCK_H - height) / 2)
  }
  x = Math.max(8, Math.min(x, vw - width - 8))
  y = Math.max(MENU_H + 8, Math.min(y, vh - DOCK_H - height - 8))
  return { ...w, w: width, h: height, x, y, centered: false }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open': {
      const id = windowId(action.app, action.param)
      const existing = state.windows.find(w => w.id === id)
      const z = state.topZ + 1
      if (existing) {
        return {
          ...state,
          topZ: z,
          windows: state.windows.map(w => (w.id === id ? { ...w, z, minimized: false } : w)),
        }
      }
      const meta = getMeta(action.app, action.param)
      const step = state.opened % 7
      const win = fit(
        {
          id,
          app: action.app,
          param: action.param,
          title: meta.title,
          w: meta.w,
          h: meta.h,
          // Cascade from the upper-left third of the screen
          x: Math.round(action.vw * 0.12) + step * 32,
          y: MENU_H + 24 + step * 28,
          z,
          minimized: false,
          maximized: false,
          centered: false,
        },
        action.vw,
        action.vh,
      )
      return { windows: [...state.windows, win], topZ: z, opened: state.opened + 1 }
    }
    case 'close':
      return { ...state, windows: state.windows.filter(w => w.id !== action.id) }
    case 'closeAll':
      return { ...state, windows: [] }
    case 'focus': {
      const target = state.windows.find(w => w.id === action.id)
      if (!target || (target.z === state.topZ && !target.minimized)) return state
      const z = state.topZ + 1
      return {
        ...state,
        topZ: z,
        windows: state.windows.map(w => (w.id === action.id ? { ...w, z, minimized: false } : w)),
      }
    }
    case 'minimize':
      return {
        ...state,
        windows: state.windows.map(w => (w.id === action.id ? { ...w, minimized: true } : w)),
      }
    case 'toggleMax':
      return {
        ...state,
        windows: state.windows.map(w => (w.id === action.id ? { ...w, maximized: !w.maximized } : w)),
      }
    case 'move':
      return {
        ...state,
        windows: state.windows.map(w => (w.id === action.id ? { ...w, x: action.x, y: action.y } : w)),
      }
    case 'resize':
      return {
        ...state,
        windows: state.windows.map(w => (w.id === action.id ? { ...w, w: action.w, h: action.h } : w)),
      }
    case 'layout':
      return { ...state, windows: state.windows.map(w => fit(w, action.vw, action.vh)) }
  }
}

// The Read Me window is open on first paint, so the server-rendered HTML
// already contains a real introduction (good for SEO and no-JS visitors).
const initialMeta = getMeta('welcome')
const initialState: State = {
  windows: [
    {
      id: 'welcome',
      app: 'welcome',
      title: initialMeta.title,
      w: initialMeta.w,
      h: initialMeta.h,
      x: 0,
      y: MENU_H + 40,
      z: 1,
      minimized: false,
      maximized: false,
      centered: true,
    },
  ],
  topZ: 1,
  opened: 1,
}

interface OSContextValue {
  windows: Win[]
  focusedId: string | null
  isMobile: boolean
  open: (app: AppId, param?: string) => void
  close: (id: string) => void
  focus: (id: string) => void
  minimize: (id: string) => void
  toggleMax: (id: string) => void
  move: (id: string, x: number, y: number) => void
  resize: (id: string, w: number, h: number) => void
  closeAll: () => void
  reboot: () => void
}

const OSContext = createContext<OSContextValue | null>(null)

export function useOS() {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS must be used inside <OSProvider>')
  return ctx
}

function viewport() {
  return { vw: window.innerWidth, vh: window.innerHeight }
}

export function OSProvider({
  children,
  onReboot,
}: {
  children: React.ReactNode
  onReboot: () => void
}) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isMobile, setIsMobile] = useState(false)

  // Track mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Lay windows out against the real viewport on mount and on resize
  useEffect(() => {
    const onResize = () => dispatch({ type: 'layout', ...viewport() })
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const open = useCallback((app: AppId, param?: string) => {
    dispatch({ type: 'open', app, param, ...viewport() })
  }, [])

  // Deep links: joliegoldstein.com/#project/intelswap opens that window
  useEffect(() => {
    const fromHash = () => {
      const target = parseHash(window.location.hash)
      if (target) open(target.app, target.param)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [open])

  const visible = state.windows.filter(w => !w.minimized)
  const focused = visible.length
    ? visible.reduce((top, w) => (w.z > top.z ? w : top))
    : null
  const focusedId = focused?.id ?? null

  // Keep the URL hash in sync with the focused window so it can be shared
  useEffect(() => {
    const next = focusedId && focusedId !== 'welcome' ? `#${focusedId}` : ''
    if (window.location.hash !== next) {
      history.replaceState(null, '', next || window.location.pathname)
    }
  }, [focusedId])

  const value = useMemo<OSContextValue>(
    () => ({
      windows: state.windows,
      focusedId,
      isMobile,
      open,
      close: id => dispatch({ type: 'close', id }),
      focus: id => dispatch({ type: 'focus', id }),
      minimize: id => dispatch({ type: 'minimize', id }),
      toggleMax: id => dispatch({ type: 'toggleMax', id }),
      move: (id, x, y) => dispatch({ type: 'move', id, x, y }),
      resize: (id, w, h) => dispatch({ type: 'resize', id, w, h }),
      closeAll: () => dispatch({ type: 'closeAll' }),
      reboot: onReboot,
    }),
    [state.windows, focusedId, isMobile, open, onReboot],
  )

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}
