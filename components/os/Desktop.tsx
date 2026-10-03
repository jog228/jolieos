'use client'

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { links } from '@/lib/content'
import { cn } from '@/lib/utils'
import { AppContent } from './AppContent'
import { AppIcon, type IconName } from './AppIcon'
import { BootScreen } from './BootScreen'
import { MenuBar } from './MenuBar'
import { DOCK_H, MENU_H, OSProvider, useOS, type Win } from './OSProvider'
import { getMeta, PROJECT_HUES, findProject, projectBadge, type AppId } from './registry'
import { Window } from './Window'

// ─────────────────────────────────────────────────────────────
// Root: boot screen + window manager
// ─────────────────────────────────────────────────────────────
export function JolieOS() {
  const [booting, setBooting] = useState(true)
  const [session, setSession] = useState(0) // bump to "restart" with fresh state

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem('jolieos-booted', '1')
    } catch {}
    document.documentElement.setAttribute('data-booted', '')
    setBooting(false)
  }, [])

  const reboot = useCallback(() => {
    document.documentElement.removeAttribute('data-booted')
    history.replaceState(null, '', window.location.pathname)
    setSession(s => s + 1)
    setBooting(true)
  }, [])

  return (
    <OSProvider key={session} onReboot={reboot}>
      <MenuBar />
      <Desktop />
      <AnimatePresence>{booting && <BootScreen key={session} onDone={finishBoot} />}</AnimatePresence>
    </OSProvider>
  )
}

// Icon for a given window (project windows get their own colored icon)
export function iconProps(win: Pick<Win, 'app' | 'param'>) {
  if (win.app === 'project') {
    const p = findProject(win.param)
    return { name: 'app' as IconName, letter: p && projectBadge(p), hue: PROJECT_HUES[win.param ?? ''] }
  }
  return { name: getMeta(win.app, win.param).icon }
}

// ─────────────────────────────────────────────────────────────
// Desktop
// ─────────────────────────────────────────────────────────────
interface DesktopItem {
  label: string
  icon: IconName
  app?: AppId
  href?: string
}

const DESKTOP_ITEMS: DesktopItem[] = [
  { label: 'Read Me', icon: 'readme', app: 'welcome' },
  { label: 'About Me.txt', icon: 'doc', app: 'about' },
  { label: 'Experience', icon: 'calendar', app: 'experience' },
  { label: 'Projects', icon: 'folder', app: 'projects' },
  { label: 'Leadership', icon: 'trophy', app: 'leadership' },
  { label: 'Press', icon: 'press', app: 'press' },
  { label: 'Resume.pdf', icon: 'pdf', href: links.resume },
]

function Desktop() {
  const { windows, isMobile, open } = useOS()
  const [selected, setSelected] = useState<string | null>(null)
  const lastPointer = useRef<string>('mouse')

  function launch(item: DesktopItem) {
    setSelected(null)
    if (item.href) window.open(item.href, '_blank', 'noopener,noreferrer')
    else if (item.app) open(item.app)
  }

  return (
    <main
      id="main-content"
      className="os-wallpaper fixed inset-x-0 bottom-0 overflow-hidden"
      style={{ top: MENU_H }}
      onPointerDown={e => {
        if (e.target === e.currentTarget) setSelected(null)
      }}
    >
      {/* Desktop icons */}
      <ul
        aria-label="Desktop"
        className={cn(
          'list-none',
          isMobile
            ? 'grid grid-cols-4 gap-y-5 px-3 pb-28 pt-8'
            : 'absolute right-5 top-5 flex flex-col flex-wrap-reverse content-start gap-x-3 gap-y-3',
        )}
        style={isMobile ? undefined : { bottom: DOCK_H + 8 }}
      >
        {DESKTOP_ITEMS.map(item => {
          const isSel = selected === item.label
          return (
            <li key={item.label}>
              <button
                type="button"
                onPointerDown={e => (lastPointer.current = e.pointerType)}
                onClick={() => {
                  // Touch: tap to open. Mouse: click selects, double-click opens.
                  if (isMobile || lastPointer.current === 'touch') launch(item)
                  else setSelected(item.label)
                }}
                onDoubleClick={() => launch(item)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    launch(item)
                  }
                }}
                aria-label={item.href ? `${item.label} (opens in new tab)` : `Open ${item.label}`}
                className="group flex w-[86px] flex-col items-center gap-1.5 outline-none"
              >
                <span
                  className={cn(
                    'flex h-[66px] w-[66px] items-center justify-center rounded-lg transition-transform group-hover:-translate-y-0.5',
                    isSel && 'bg-black/20',
                  )}
                >
                  <AppIcon name={item.icon} size={58} />
                </span>
                <span
                  className={cn(
                    'os-icon-label max-w-full rounded px-1.5 text-center font-aqua text-[12px] font-semibold leading-tight',
                    isSel ? 'bg-[#7048e8] text-white [text-shadow:none]' : 'group-focus-visible:bg-[#7048e8] group-focus-visible:text-white',
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* Windows */}
      <AnimatePresence>
        {windows.map(win => (
          <Window key={win.id} win={win}>
            <AppContent app={win.app} param={win.param} />
          </Window>
        ))}
      </AnimatePresence>

      <Dock />
    </main>
  )
}

// ─────────────────────────────────────────────────────────────
// Dock with hover magnification
// ─────────────────────────────────────────────────────────────
interface DockApp {
  label: string
  icon: IconName
  app?: AppId
  href?: string
  owns?: AppId[] // other window types that count as "running" for this icon
  desktopOnly?: boolean // hidden on phones to keep the dock narrow
}

const DOCK_APPS: DockApp[] = [
  { label: 'Welcome', icon: 'readme', app: 'welcome' },
  { label: 'About Me', icon: 'doc', app: 'about', desktopOnly: true },
  { label: 'Experience', icon: 'calendar', app: 'experience', owns: ['experienceDetail'] },
  { label: 'Projects', icon: 'folder', app: 'projects', owns: ['project', 'preview'] },
  { label: 'Records', icon: 'vinyl', app: 'records' },
  { label: 'Skills', icon: 'gear', app: 'skills' },
  { label: 'Mail', icon: 'mail', app: 'contact' },
  { label: 'Terminal', icon: 'terminal', app: 'terminal' },
  { label: 'Resume', icon: 'pdf', href: links.resume, desktopOnly: true },
]

function Dock() {
  const { windows, isMobile, open, focus } = useOS()
  const reduceMotion = useReducedMotion()
  const mouseX = useMotionValue(Infinity)
  const magnify = !isMobile && !reduceMotion
  const base = isMobile ? 34 : 48

  const minimized = windows.filter(w => w.minimized)
  const isRunning = (d: DockApp) => windows.some(w => w.app === d.app || d.owns?.includes(w.app))
  const trashOpen = windows.some(w => w.app === 'trash')

  return (
    <nav
      aria-label="Dock"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[4000] flex justify-center px-2 pb-2"
    >
      <div
        onMouseMove={e => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="os-dock pointer-events-auto flex max-w-full items-end gap-1.5 rounded-2xl px-2.5 pb-1.5 pt-2 sm:gap-2"
        style={{ height: base + 20 }}
      >
        {DOCK_APPS.filter(d => !(isMobile && d.desktopOnly)).map(d => (
          <DockIcon
            key={d.label}
            label={d.label}
            running={isRunning(d)}
            mouseX={mouseX}
            magnify={magnify}
            base={base}
            onClick={() => (d.href ? window.open(d.href, '_blank', 'noopener,noreferrer') : d.app && open(d.app))}
          >
            <AppIcon name={d.icon} size={base} />
          </DockIcon>
        ))}

        <span aria-hidden className="mx-0.5 h-[70%] w-px shrink-0 self-center bg-white/45" />

        {minimized.map(w => (
          <DockIcon
            key={w.id}
            label={`${w.title} (minimized)`}
            running
            mouseX={mouseX}
            magnify={magnify}
            base={base}
            onClick={() => focus(w.id)}
          >
            <AppIcon {...iconProps(w)} size={base} />
          </DockIcon>
        ))}

        <DockIcon
          label="Trash"
          running={trashOpen}
          mouseX={mouseX}
          magnify={magnify}
          base={base}
          onClick={() => open('trash')}
        >
          <AppIcon name="trash" size={base} />
        </DockIcon>
      </div>
    </nav>
  )
}

function DockIcon({
  label,
  running,
  mouseX,
  magnify,
  base,
  onClick,
  children,
}: {
  label: string
  running: boolean
  mouseX: MotionValue<number>
  magnify: boolean
  base: number
  onClick: () => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hover, setHover] = useState(false)

  // Distance from cursor to this icon's center drives its size
  const distance = useTransform(mouseX, x => {
    const b = ref.current?.getBoundingClientRect()
    return b ? x - (b.left + b.width / 2) : Infinity
  })
  const target = useTransform(distance, [-150, 0, 150], [base, base * 1.6, base])
  const size = useSpring(target, { mass: 0.15, stiffness: 180, damping: 14 })

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={magnify ? { width: size, height: size } : { width: base, height: base }}
      className="relative flex shrink-0 items-end justify-center outline-none"
    >
      <span className="block h-full w-full [&>svg]:h-full [&>svg]:w-full">{children}</span>

      {/* Running indicator */}
      {running && (
        <span
          aria-hidden
          className="absolute -bottom-[5px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_6px_2px_rgba(200,170,255,.9)]"
        />
      )}

      {/* Hover label */}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="os-dock-tip pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 font-aqua text-[12px] text-white"
          >
            {label.replace(' (minimized)', '')}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
