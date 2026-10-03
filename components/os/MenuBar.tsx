'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Moon, Search, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'
import { links, profile } from '@/lib/content'
import { experience } from '@/lib/experience'
import { cn } from '@/lib/utils'
import { AppIcon, type IconName } from './AppIcon'
import { MENU_H, useOS } from './OSProvider'
import { allProjects, PROJECT_HUES, shortOrg, type AppId } from './registry'

interface MenuItem {
  label: string
  onSelect?: () => void
  href?: string
  shortcut?: string
  divider?: boolean
}

const menuPanel =
  'absolute left-0 top-[23px] min-w-[220px] overflow-hidden rounded-b-md border border-black/20 bg-[var(--menubar-top)] py-1 shadow-[0_10px_30px_rgba(0,0,0,.28)] backdrop-blur-xl'
const menuItem =
  'flex w-full items-center justify-between gap-6 px-4 py-[3px] text-left font-aqua text-[13px] text-ink hover:bg-gradient-to-b hover:from-[#a58bff] hover:to-[#7048e8] hover:text-white focus:bg-gradient-to-b focus:from-[#a58bff] focus:to-[#7048e8] focus:text-white focus:outline-none'

export function MenuBar() {
  const { open, closeAll, reboot } = useOS()
  const { theme, toggleTheme, mounted } = useTheme()
  const go = (app: AppId) => () => open(app)

  const systemMenu: MenuItem[] = [
    { label: 'About JolieOS', onSelect: go('welcome') },
    { label: '', divider: true },
    { label: 'Résumé…', href: links.resume },
    { label: '', divider: true },
    { label: 'Restart…', onSelect: reboot },
  ]
  const goMenu: MenuItem[] = [
    { label: 'About Me', onSelect: go('about') },
    { label: 'Experience', onSelect: go('experience') },
    { label: 'Projects', onSelect: go('projects') },
    { label: 'Records', onSelect: go('records') },
    { label: 'Skills', onSelect: go('skills') },
    { label: 'Leadership', onSelect: go('leadership') },
    { label: 'Press', onSelect: go('press') },
    { label: '', divider: true },
    { label: 'Terminal', onSelect: go('terminal') },
  ]
  const socialMenu: MenuItem[] = [
    { label: 'GitHub', href: links.github },
    { label: 'LinkedIn', href: links.linkedin },
    { label: 'Email Me…', onSelect: go('contact') },
  ]
  const specialMenu: MenuItem[] = [
    { label: mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode', onSelect: toggleTheme },
    { label: 'Spotlight', shortcut: '⌘K', onSelect: () => window.dispatchEvent(new Event('jolieos:spotlight')) },
    { label: '', divider: true },
    { label: 'Close All Windows', onSelect: closeAll },
    { label: 'Empty Trash…', onSelect: go('trash') },
  ]

  return (
    <header
      className="os-menubar fixed inset-x-0 top-0 z-[5000] flex items-center justify-between px-2 font-aqua text-[13px] text-ink"
      style={{ height: MENU_H }}
    >
      <nav aria-label="Menu bar" className="flex items-center">
        <Menu
          ariaLabel="JolieOS menu"
          label={<span className="font-mono text-[15px] font-bold lowercase tracking-tight">jolie</span>}
          items={systemMenu}
        />
        <Menu label="Go" items={goMenu} />
        <span className="hidden sm:contents">
          <Menu label="Social" items={socialMenu} />
          <Menu label="Special" items={specialMenu} />
        </span>
      </nav>

      <div className="flex items-center gap-1 pr-1">
        <span className="mr-2 hidden items-center gap-1.5 text-[12px] text-muted lg:flex">
          <span aria-hidden className="os-blink inline-block h-1.5 w-1.5 rounded-full bg-[#3fbf3f]" />
          {profile.availability}
        </span>
        <Spotlight />
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-[22px] w-7 items-center justify-center rounded hover:bg-black/10"
        >
          {mounted && theme === 'dark' ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />}
        </button>
        <Clock />
      </div>
    </header>
  )
}

function Clock() {
  const [now, setNow] = useState<string | null>(null)
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      setNow(`${day.replace(',', '')} ${time}`)
    }
    tick()
    const t = setInterval(tick, 15_000)
    return () => clearInterval(t)
  }, [])
  return (
    <time className="ml-1 hidden min-w-[9.5em] text-right tabular-nums sm:block" suppressHydrationWarning>
      {now ?? ''}
    </time>
  )
}

// Shared outside-click / Escape handling for dropdowns
function useDismiss(open: boolean, root: React.RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, root, close])
}

function Menu({ label, ariaLabel, items }: { label: React.ReactNode; ariaLabel?: string; items: MenuItem[] }) {
  const [isOpen, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  useDismiss(isOpen, root, () => setOpen(false))

  function onMenuKeyDown(e: React.KeyboardEvent) {
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    const i = els.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      els[(i + 1) % els.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      els[(i - 1 + els.length) % els.length]?.focus()
    }
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
            requestAnimationFrame(() => root.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus())
          }
        }}
        className={cn(
          'flex h-[22px] items-center rounded-[3px] px-2.5',
          isOpen ? 'bg-gradient-to-b from-[#a58bff] to-[#7048e8] text-white' : 'hover:bg-black/5',
        )}
      >
        {label}
      </button>

      {isOpen && (
        <div role="menu" onKeyDown={onMenuKeyDown} className={menuPanel}>
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} role="separator" className="my-1 border-t border-black/10" />
            ) : item.href ? (
              <a
                key={i}
                role="menuitem"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={menuItem}
              >
                {item.label}
                <span className="opacity-50">↗</span>
              </a>
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  item.onSelect?.()
                }}
                className={menuItem}
              >
                {item.label}
                {item.shortcut && <span className="opacity-50">{item.shortcut}</span>}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Spotlight: search everything and jump straight to it (⌘K or /)
// ─────────────────────────────────────────────────────────────
interface Hit {
  label: string
  kind: string
  icon: IconName
  letter?: string
  hue?: [string, string]
  run: (open: (app: AppId, param?: string) => void) => void
  keywords: string
}

function buildIndex(): Hit[] {
  const app = (label: string, icon: IconName, appId: AppId, keywords = ''): Hit => ({
    label,
    kind: 'Application',
    icon,
    run: open => open(appId),
    keywords: `${label} ${keywords}`.toLowerCase(),
  })
  const ext = (label: string, href: string, keywords = ''): Hit => ({
    label,
    kind: 'Link',
    icon: label === 'Résumé' ? 'pdf' : 'doc',
    run: () => window.open(href, '_blank', 'noopener,noreferrer'),
    keywords: `${label} ${keywords}`.toLowerCase(),
  })

  return [
    app('About Me', 'doc', 'about', 'bio lehigh story'),
    app('Experience', 'calendar', 'experience', 'jobs work internship'),
    app('Projects', 'folder', 'projects', 'portfolio case studies'),
    app('Records', 'vinyl', 'records', 'music vinyl'),
    app('Skills', 'gear', 'skills', 'python react typescript flask design'),
    app('Leadership', 'trophy', 'leadership', 'ai club president'),
    app('Press', 'press', 'press', 'news publication article'),
    app('Mail', 'mail', 'contact', 'contact email hire'),
    app('Terminal', 'terminal', 'terminal', 'cli shell command'),
    ext('Résumé', links.resume, 'resume cv pdf'),
    ext('GitHub', links.github, 'code'),
    ext('LinkedIn', links.linkedin),
    ...allProjects.map<Hit>(p => ({
      label: p.title,
      kind: `Project · ${p.year}`,
      icon: 'app',
      letter: p.title[0],
      hue: PROJECT_HUES[p.id],
      run: open => open('project', p.id),
      keywords: `${p.title} ${p.tags.join(' ')} ${p.summary}`.toLowerCase(),
    })),
    ...experience.map<Hit>(e => ({
      label: shortOrg(e.organization),
      kind: e.role,
      icon: 'folder',
      run: open => open('experienceDetail', e.id),
      keywords: `${e.organization} ${e.role} ${e.location}`.toLowerCase(),
    })),
  ]
}

function Spotlight() {
  const { open } = useOS()
  const [isOpen, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const index = useMemo(buildIndex, [])

  const close = () => {
    setOpen(false)
    setQ('')
    setSel(0)
  }
  useDismiss(isOpen, root, close)

  // ⌘K / Ctrl+K / "/" opens Spotlight from anywhere (except while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest('input, textarea')
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    const onEvt = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('jolieos:spotlight', onEvt)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('jolieos:spotlight', onEvt)
    }
  }, [])

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => input.current?.focus())
  }, [isOpen])

  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const hits = terms.length ? index.filter(h => terms.every(t => h.keywords.includes(t))).slice(0, 8) : index.slice(0, 6)

  function choose(h: Hit | undefined) {
    if (!h) return
    h.run(open)
    close()
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label="Spotlight search"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : setOpen(true))}
        className={cn(
          'flex h-[22px] w-7 items-center justify-center rounded',
          isOpen ? 'bg-gradient-to-b from-[#a58bff] to-[#7048e8] text-white' : 'hover:bg-black/10',
        )}
      >
        <Search size={14} strokeWidth={2.2} aria-hidden />
      </button>

      {isOpen && (
        <div className="fixed right-2 top-[26px] w-[min(380px,calc(100vw-16px))] overflow-hidden rounded-lg border border-black/20 bg-[var(--menubar-top)] shadow-[0_14px_40px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-black/10 px-3 py-2">
            <span className="font-aqua text-[13px] font-bold">Spotlight</span>
            <input
              ref={input}
              value={q}
              onChange={e => {
                setQ(e.target.value)
                setSel(0)
              }}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setSel(s => Math.min(s + 1, hits.length - 1))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setSel(s => Math.max(s - 1, 0))
                } else if (e.key === 'Enter') {
                  e.preventDefault()
                  choose(hits[sel])
                }
              }}
              placeholder="Search projects, skills, links…"
              aria-label="Search JolieOS"
              aria-controls="spotlight-results"
              className="min-w-0 flex-1 rounded-full border border-black/20 bg-white px-3 py-1 font-aqua text-[13px] text-[#1d1d1f] shadow-inner outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <ul id="spotlight-results" role="listbox" className="max-h-[60vh] overflow-auto py-1">
            {hits.length === 0 && <li className="px-4 py-3 font-aqua text-[13px] text-muted">No results</li>}
            {hits.map((h, i) => (
              <li key={h.label + h.kind} role="option" aria-selected={i === sel}>
                <button
                  type="button"
                  onMouseEnter={() => setSel(i)}
                  onClick={() => choose(h)}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-1.5 text-left font-aqua',
                    i === sel && 'bg-gradient-to-b from-[#a58bff] to-[#7048e8] text-white',
                  )}
                >
                  <AppIcon name={h.icon} size={22} letter={h.letter} hue={h.hue} />
                  <span className="min-w-0 flex-1 truncate text-[13px]">{h.label}</span>
                  <span className={cn('truncate text-[11px]', i === sel ? 'text-white/80' : 'text-muted')}>
                    {h.kind}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
