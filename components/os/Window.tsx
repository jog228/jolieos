'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { DOCK_H, MENU_H, useOS, type Win } from './OSProvider'

const MIN_W = 300
const MIN_H = 200

export function Window({ win, children }: { win: Win; children: React.ReactNode }) {
  const { focusedId, isMobile, focus, close, minimize, toggleMax, move, resize } = useOS()
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const active = focusedId === win.id
  const fullscreen = isMobile || win.maximized
  const titleId = `win-title-${win.id.replace(/\W/g, '-')}`

  // Move keyboard focus into a window when it first opens
  // (unless a child, like the Terminal input, already took focus)
  useEffect(() => {
    if (!ref.current?.contains(document.activeElement)) {
      ref.current?.focus({ preventScroll: true })
    }
  }, [])

  // ── Dragging by the title bar ──────────────────────────────
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null)

  function onTitlePointerDown(e: React.PointerEvent) {
    if (fullscreen || (e.target as HTMLElement).closest('button')) return
    drag.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onTitlePointerMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Keep at least part of the title bar reachable on screen
    const x = Math.max(-win.w + 80, Math.min(d.x + e.clientX - d.px, vw - 80))
    const y = Math.max(MENU_H, Math.min(d.y + e.clientY - d.py, vh - 60))
    move(win.id, x, y)
  }
  function onTitlePointerUp() {
    drag.current = null
  }

  // ── Resizing from the bottom-right corner ──────────────────
  const sizing = useRef<{ px: number; py: number; w: number; h: number } | null>(null)

  function onGripPointerDown(e: React.PointerEvent) {
    e.stopPropagation()
    sizing.current = { px: e.clientX, py: e.clientY, w: win.w, h: win.h }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onGripPointerMove(e: React.PointerEvent) {
    const s = sizing.current
    if (!s) return
    const w = Math.max(MIN_W, Math.min(s.w + e.clientX - s.px, window.innerWidth - win.x - 4))
    const h = Math.max(MIN_H, Math.min(s.h + e.clientY - s.py, window.innerHeight - win.y - 4))
    resize(win.id, w, h)
  }

  // Esc closes the window that currently holds keyboard focus
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      close(win.id)
    }
  }

  // Window coords are viewport-based; the desktop <main> starts below the menu bar
  const style: React.CSSProperties = fullscreen
    ? { left: 0, right: 0, top: 0, bottom: DOCK_H, zIndex: win.z + 10 }
    : { left: win.x, top: win.y - MENU_H, width: win.w, height: win.h, zIndex: win.z + 10 }

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      hidden={win.minimized}
      data-active={active}
      onPointerDownCapture={() => focus(win.id)}
      onFocusCapture={() => focus(win.id)}
      onKeyDown={onKeyDown}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
      style={style}
      className={cn('os-window absolute flex flex-col bg-paper text-ink outline-none', fullscreen && '!rounded-none')}
    >
      {/* Title bar */}
      <div
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onDoubleClick={() => !isMobile && toggleMax(win.id)}
        className="os-titlebar relative flex h-[26px] shrink-0 select-none items-center px-2.5"
      >
        {/* Traffic lights */}
        <div className="os-lights relative z-10 flex items-center gap-2">
          <Light kind="close" label={`Close ${win.title}`} onClick={() => close(win.id)}>
            <path d="M3 3l4 4M7 3L3 7" stroke="#4d0000" strokeWidth="1.3" />
          </Light>
          {!isMobile && (
            <>
              <Light kind="min" label={`Minimize ${win.title}`} onClick={() => minimize(win.id)}>
                <path d="M2.5 5h5" stroke="#5a3a00" strokeWidth="1.3" />
              </Light>
              <Light
                kind="zoom"
                label={win.maximized ? `Restore ${win.title}` : `Zoom ${win.title}`}
                onClick={() => toggleMax(win.id)}
              >
                <path d="M5 2.5v5M2.5 5h5" stroke="#0b4000" strokeWidth="1.3" />
              </Light>
            </>
          )}
        </div>

        <h2
          id={titleId}
          className={cn(
            'pointer-events-none absolute inset-x-20 truncate text-center font-aqua text-[13px] leading-none',
            active ? 'text-[var(--chrome-title)]' : 'text-[var(--chrome-title-dim)]',
          )}
        >
          {win.title}
        </h2>
      </div>

      {/* Body */}
      <div className="os-scroll relative min-h-0 flex-1 overflow-auto">{children}</div>

      {/* Resize grip */}
      {!fullscreen && (
        <div
          aria-hidden
          onPointerDown={onGripPointerDown}
          onPointerMove={onGripPointerMove}
          onPointerUp={() => (sizing.current = null)}
          className="absolute bottom-0 right-0 z-20 h-4 w-4 cursor-nwse-resize"
          style={{
            background:
              'linear-gradient(135deg, transparent 55%, rgba(0,0,0,.28) 55%, rgba(0,0,0,.28) 60%, transparent 60%, transparent 72%, rgba(0,0,0,.28) 72%, rgba(0,0,0,.28) 77%, transparent 77%)',
          }}
        />
      )}
    </motion.div>
  )
}

function Light({
  kind,
  label,
  onClick,
  children,
}: {
  kind: 'close' | 'min' | 'zoom'
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label.split(' ')[0]}
      onClick={onClick}
      className={`os-light os-light--${kind} flex items-center justify-center`}
    >
      <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden className="relative z-10">
        {children}
      </svg>
    </button>
  )
}
