'use client'

// Experience (calendar split view), Experience detail, Projects (shop grid),
// Project case study, Image preview, Records (turntable + record crate)

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { experience, type Experience } from '@/lib/experience'
import { records, type VinylRecord } from '@/lib/records'
import { cn } from '@/lib/utils'
import { AppIcon } from '../AppIcon'
import { useOS } from '../OSProvider'
import { allProjects, findExperience, findProject, PROJECT_HUES, projectBadge, shortOrg } from '../registry'
import { Label, OSButton, OSLinkButton, StatusBar, Tag } from '../ui'

// Width of an element, for layouts that change with window size
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

// "Jun 2026 – Aug 2026" → { head: 'JUN', body: '26' }
function badgeFor(dates: string) {
  const start = dates.split(/[–-]/)[0].trim()
  const month = start.match(/[A-Za-z]{3}/)?.[0]?.toUpperCase()
  const year = start.match(/\d{4}/)?.[0] ?? ''
  return { head: month ?? 'FROM', body: `'${year.slice(2)}` }
}

function DateBadge({ dates, size = 'md' }: { dates: string; size?: 'md' | 'lg' }) {
  const b = badgeFor(dates)
  return (
    <span
      aria-hidden
      className={cn(
        'os-datebadge flex shrink-0 flex-col overflow-hidden rounded-[5px] text-center font-aqua',
        size === 'lg' ? 'w-14' : 'w-10',
      )}
    >
      <span className={cn('os-datebadge-head font-bold leading-none text-white', size === 'lg' ? 'py-1 text-[10px]' : 'py-[3px] text-[8.5px]')}>
        {b.head}
      </span>
      <span className={cn('font-semibold leading-none text-[#c0271c]', size === 'lg' ? 'py-1.5 text-[22px]' : 'py-1 text-[16px]')}>
        {b.body}
      </span>
    </span>
  )
}

// Long copy is stored as one string; a blank line starts a new paragraph.
function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn('max-w-[64ch] space-y-3.5 text-[15px] leading-[1.7]', className)}>
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  )
}

function ProjectIcon({ id, size = 40 }: { id: string; size?: number }) {
  const p = findProject(id)
  return <AppIcon name="app" size={size} letter={p && projectBadge(p)} hue={PROJECT_HUES[id]} />
}

// ── Experience: calendar list on the left, details on the right ──
export function ExperienceApp() {
  const { open } = useOS()
  const [ref, width] = useWidth<HTMLDivElement>()
  const [sel, setSel] = useState(experience[0].id)
  const wide = width === 0 || width >= 640
  const current = findExperience(sel)!

  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className={cn('min-h-0 flex-1', wide ? 'grid grid-cols-[minmax(300px,42%)_1fr]' : 'overflow-auto')}>
        {/* Calendar list */}
        <ul className={cn('bg-paper', wide && 'os-scroll overflow-auto border-r border-hairline')}>
          {experience.map(exp => {
            const isSel = wide && exp.id === sel
            return (
              <li key={exp.id} className="border-b border-hairline">
                <button
                  type="button"
                  onClick={() => (wide ? setSel(exp.id) : open('experienceDetail', exp.id))}
                  aria-current={isSel}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2.5 text-left font-aqua',
                    isSel ? 'bg-gradient-to-b from-[#a58bff] to-[#7048e8] text-white' : 'hover:bg-canvas',
                  )}
                >
                  <DateBadge dates={exp.dates} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-bold">{exp.role}</span>
                    <span className={cn('block truncate text-[12px]', isSel ? 'text-white/85' : 'text-muted')}>
                      {shortOrg(exp.organization)} · {exp.location}
                    </span>
                  </span>
                  {exp.projects.length > 0 && (
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold',
                        isSel ? 'bg-white/25 text-white' : 'bg-surface text-muted',
                      )}
                    >
                      {exp.projects.length}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Detail pane */}
        {wide && (
          <div className="os-scroll overflow-auto bg-canvas">
            <ExperienceBody exp={current} />
          </div>
        )}
      </div>
      <StatusBar>{experience.length} roles · select one to read more</StatusBar>
    </div>
  )
}

function ExperienceBody({ exp }: { exp: Experience }) {
  const { open } = useOS()
  return (
    <div className="p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <DateBadge dates={exp.dates} size="lg" />
        <div className="min-w-0">
          <Label>
            {exp.dates} · {exp.location}
          </Label>
          <h3 className="mt-1 font-display text-[1.75rem] font-bold leading-tight tracking-tight">{exp.role}</h3>
          <p className="mt-0.5 text-[14px] text-muted">{exp.organization}</p>
        </div>
      </div>

      {exp.highlights?.length ? (
        <ul className="mt-5 max-w-[62ch] space-y-2">
          {exp.highlights.map(h => (
            <li key={h} className="flex gap-2.5 text-[14px] leading-snug">
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {h}
            </li>
          ))}
        </ul>
      ) : null}

      <p
        className={cn(
          'max-w-[62ch] leading-[1.7]',
          exp.highlights?.length ? 'mt-5 border-t border-hairline pt-4 text-[13.5px] text-muted' : 'mt-5 text-[14.5px]',
        )}
      >
        {exp.description}
      </p>

      <div className="mt-6 rounded-lg border border-hairline bg-paper p-4">
        <Label className="mb-3">{exp.projects.length ? 'Case studies' : 'Projects'}</Label>
        {exp.projects.length ? (
          <ul className="flex flex-wrap gap-2">
            {exp.projects.map(p => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => open('project', p.id)}
                  className="group flex w-[104px] flex-col items-center gap-1.5 rounded-lg p-2 hover:bg-canvas"
                >
                  <span className="transition-transform group-hover:-translate-y-0.5">
                    <ProjectIcon id={p.id} size={44} />
                  </span>
                  <span className="rounded px-1 text-center font-aqua text-[12px] leading-tight group-focus-visible:bg-accent group-focus-visible:text-white">
                    {p.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-aqua text-[12.5px] text-muted">Study in design. The write-up will live here once there is one.</p>
        )}
      </div>
    </div>
  )
}

// ── One experience in its own window (used by deep links + small windows) ──
export function ExperienceDetailApp({ id }: { id?: string }) {
  const exp = findExperience(id)
  if (!exp) return <p className="p-6">Not found.</p>
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <div className="flex-1">
        <ExperienceBody exp={exp} />
      </div>
      <StatusBar>
        {exp.projects.length} {exp.projects.length === 1 ? 'project' : 'projects'}
      </StatusBar>
    </div>
  )
}

// ── Projects: storefront-style grid ──────────────────────────
export function ProjectsApp() {
  const { open } = useOS()
  return (
    <div className="flex min-h-full flex-col">
      <ul className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] content-start gap-x-4 gap-y-5 p-4 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:p-5">
        {allProjects.map(p => {
          const cover = p.images?.[0]
          const hue = PROJECT_HUES[p.id]
          return (
            <li key={p.id}>
              <button type="button" onClick={() => open('project', p.id)} className="group block w-full text-center">
                <span
                  className="relative mx-auto flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(0,0,0,.18),inset_0_0_0_1px_rgba(0,0,0,.1)] transition-transform group-hover:-translate-y-1"
                  style={{
                    background:
                      cover?.fit === 'contain' && cover.bg
                        ? cover.bg
                        : `linear-gradient(135deg, ${hue?.[0] ?? '#a58bff'}, ${hue?.[1] ?? '#7048e8'})`,
                  }}
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.src}
                      alt=""
                      loading="lazy"
                      className={cn(
                        'h-full w-full',
                        cover.fit === 'contain' ? 'object-contain p-3' : 'object-cover object-left-top',
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        'font-display font-black text-white/95 [text-shadow:0_2px_10px_rgba(0,0,0,.2)]',
                        projectBadge(p).length > 1 ? 'text-[2.6rem]' : 'text-[4.5rem]',
                      )}
                    >
                      {projectBadge(p)}
                    </span>
                  )}
                  {!cover && (
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent" />
                  )}
                </span>
                <span className="mt-2 block font-aqua text-[13px] font-bold text-ink">{p.title}</span>
                <span className="block font-aqua text-[11.5px] text-muted">
                  {shortOrg(p.organization)} · {p.year}
                </span>
                <span className="mx-auto mt-0.5 block max-w-[22ch] font-aqua text-[11px] leading-snug text-muted">
                  {p.tags.slice(0, 3).join(' · ')}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <StatusBar>{allProjects.length} items</StatusBar>
    </div>
  )
}

// ── Project case study ───────────────────────────────────────
export function ProjectApp({ id }: { id?: string }) {
  const { open, isMobile } = useOS()
  const p = findProject(id)
  if (!p) return <p className="p-6">Application not found.</p>

  return (
    <article className="flex min-h-full flex-col">
      {/* Hero */}
      <header className="border-b border-hairline bg-canvas px-6 py-6 sm:px-9 sm:py-8">
        <div className="flex items-center gap-4">
          <ProjectIcon id={p.id} size={64} />
          <div>
            <h3 className="font-display text-[2.4rem] font-black leading-none tracking-tight sm:text-5xl">{p.title}</h3>
            <Label className="mt-1.5">
              {shortOrg(p.organization)} · {p.year}
            </Label>
          </div>
        </div>
        <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed">{p.summary}</p>

        {/* At a glance: the three things a skimming reader wants first */}
        <dl className="mt-5 grid max-w-[68ch] grid-cols-1 gap-x-6 gap-y-3 rounded-lg border border-hairline bg-paper p-4 sm:grid-cols-2">
          {p.myRole && (
            <div>
              <dt><Label>My role</Label></dt>
              <dd className="mt-1 text-[13.5px] leading-snug">{p.myRole}</dd>
            </div>
          )}
          {p.outcome && (
            <div>
              <dt><Label>Outcome</Label></dt>
              <dd className="mt-1 text-[13.5px] leading-snug">{p.outcome}</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt><Label>Skills and tools</Label></dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {p.tags.map(t => (
                <Tag key={t}>{t}</Tag>
              ))}
            </dd>
          </div>
        </dl>
        {p.links && p.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {p.links.map((l, i) => (
              <OSLinkButton key={l.href} href={l.href} variant={i === 0 ? 'primary' : 'default'}>
                {l.label} <ArrowUpRight size={12} aria-hidden />
              </OSLinkButton>
            ))}
          </div>
        )}
      </header>

      {/* Body */}
      <div className="flex-1 space-y-8 px-6 py-7 sm:px-9">
        {p.images?.length ? (
          <section>
            <Label className="mb-3 text-accent">{p.images.length > 1 ? 'Screens' : 'Preview'}</Label>
            <ul className={cn('grid gap-3', p.images.length > 1 ? 'grid-cols-2 sm:grid-cols-3' : 'max-w-[420px] grid-cols-1')}>
              {p.images.map((img, i) => (
                <li key={img.src}>
                  <button
                    type="button"
                    onClick={() => open('preview', `${p.id}:${i}`)}
                    className="group block w-full overflow-hidden rounded-md bg-surface text-left shadow-[0_1px_4px_rgba(0,0,0,.2),inset_0_0_0_1px_rgba(0,0,0,.1)]"
                    style={img.fit === 'contain' && img.bg ? { background: img.bg } : undefined}
                    aria-label={`Open image: ${img.alt}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt=""
                      loading="lazy"
                      className={cn(
                        'aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.03]',
                        img.fit === 'contain' ? 'object-contain p-4' : 'object-cover object-left-top',
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-aqua text-[11.5px] text-muted">
              {p.imagesNote ? `${p.imagesNote} ` : ''}{isMobile ? 'Tap' : 'Click'} to enlarge.
            </p>
          </section>
        ) : null}

        <section>
          <Label className="mb-2 text-accent">The problem</Label>
          <Paragraphs text={p.problem} />
        </section>

        <section>
          <Label className="mb-2 text-accent">The process</Label>
          <Paragraphs text={p.process} />
        </section>
      </div>

      <StatusBar>
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span>{p.experienceId ? `Part of ${shortOrg(p.organization)}` : `Coursework · ${p.organization}`}</span>
          {p.experienceId && (
            <button
              type="button"
              onClick={() => open('experienceDetail', p.experienceId)}
              className="text-accent hover:underline"
            >
              Show in Experience →
            </button>
          )}
        </span>
      </StatusBar>
    </article>
  )
}

// ── Image preview with prev/next ─────────────────────────────
export function PreviewApp({ param }: { param?: string }) {
  const [pid, idx] = (param ?? '').split(':')
  const p = findProject(pid)
  const images = p?.images ?? []
  const [i, setI] = useState(Number(idx) || 0)

  const prev = () => setI(n => (n - 1 + images.length) % images.length)
  const next = () => setI(n => (n + 1) % images.length)

  useEffect(() => {
    setI(Number(idx) || 0)
  }, [idx])

  if (!images.length) return <p className="p-6">Image not found.</p>
  const img = images[i]

  return (
    <div
      className="flex h-full flex-col bg-[#2b2b2e]"
      onKeyDown={e => {
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
      }}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.alt}
          style={img.bg ? { background: img.bg } : undefined}
          className="max-h-full max-w-full rounded object-contain shadow-[0_8px_30px_rgba(0,0,0,.5)]"
        />
      </div>
      <div className="os-statusbar flex items-center gap-3 px-3 py-2">
        <OSButton onClick={prev} aria-label="Previous image" className="px-2.5">
          <ChevronLeft size={14} aria-hidden />
        </OSButton>
        <p className="min-w-0 flex-1 truncate text-center font-aqua text-[12.5px] text-[var(--chrome-title)]">
          <span className="opacity-60">
            {i + 1} of {images.length}
          </span>{' '}
          · {img.alt}
        </p>
        <OSButton onClick={next} aria-label="Next image" className="px-2.5">
          <ChevronRight size={14} aria-hidden />
        </OSButton>
      </div>
    </div>
  )
}

// ── Records ──────────────────────────────────────────────────
// My actual record collection, in a crate you dig through. The crate is the
// stacked-sleeve interaction from my Cut-Out Bin case study, built for real
// and restyled to match JolieOS.

interface Spin {
  key: string
  title: string
  badge: string
  hue: [string, string]
  vinylHex?: string
}

// Sleeve colors: the JolieOS purples, so the crate belongs to this desktop
const TINTS: { bg: string; ink: string }[] = [
  { bg: '#7048e8', ink: '#ffffff' }, // accent violet
  { bg: '#cbb6ff', ink: '#2a1e45' }, // lavender
  { bg: '#4b2fd6', ink: '#ffffff' }, // indigo
  { bg: '#2e2150', ink: '#ede6fb' }, // night wallpaper
  { bg: '#9273f2', ink: '#ffffff' }, // light violet
]

const recordKey = (r: VinylRecord) => `${r.artist}/${r.title}`
// Each record keeps one tint no matter how the crate is sorted
const TINT_OF = new Map(records.map((r, n) => [recordKey(r), TINTS[n % TINTS.length]]))

type DigBy = 'recent' | 'az' | 'year'
const DIG_BY: { id: DigBy; label: string }[] = [
  { id: 'recent', label: 'New in' },
  { id: 'az', label: 'A to Z' },
  { id: 'year', label: 'Year' },
]

function sortRecords(by: DigBy) {
  const list = [...records] // lib/records.ts is already A to Z by artist
  if (by === 'recent') list.sort((a, b) => b.added.localeCompare(a.added))
  if (by === 'year') list.sort((a, b) => a.year - b.year)
  return list
}

function Turntable({ spin, playing, armAngle }: { spin: Spin; playing: boolean; armAngle: number }) {
  // Colored pressings get colored grooves; everything else is black vinyl
  const grooves = spin.vinylHex
    ? `repeating-radial-gradient(circle at center, ${spin.vinylHex} 0 2px, color-mix(in srgb, ${spin.vinylHex}, #000 14%) 2px 4px)`
    : 'repeating-radial-gradient(circle at center, #111 0 2px, #1d1d1f 2px 4px), radial-gradient(circle, #222, #000)'

  return (
    <div
      className="relative aspect-[5/4] w-[min(280px,74vw)] shrink-0 rounded-xl border border-white/[.06] max-sm:w-[44vw] max-sm:max-w-[200px]"
      style={{
        background: 'linear-gradient(145deg, #2b2b30, #151517)',
        boxShadow: '0 12px 30px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06)',
      }}
    >
      {/* Record box: 70% of the plinth width, so 1 SVG unit = 0.7% of the plinth */}
      <div className="absolute left-[5%] top-[6.25%] aspect-square w-[70%]">
        {/* Platter + record. Always animated, just paused, so it stops where it is instead of snapping back. */}
        <div
          className="os-spin absolute inset-0 rounded-full"
          style={{
            animationPlayState: playing ? 'running' : 'paused',
            background: grooves,
            boxShadow: '0 6px 18px rgba(0,0,0,.6), inset 0 0 0 2px rgba(0,0,0,.85)',
          }}
        >
          <div
            className="absolute inset-[32%] flex items-center justify-center rounded-full shadow-[0_0_0_1px_rgba(0,0,0,.25)]"
            style={{ background: `linear-gradient(135deg, ${spin.hue[0]}, ${spin.hue[1]})` }}
          >
            <span
              className={cn(
                '-translate-y-[38%] font-display font-black leading-none text-white/95',
                spin.badge.length > 1 ? 'text-[0.8rem]' : 'text-[1.2rem]',
              )}
            >
              {spin.badge}
            </span>
            <span className="absolute h-2 w-2 rounded-full bg-[#111]" />
          </div>
          {/* sheen */}
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgba(255,255,255,.10)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,.08)_220deg,transparent_260deg)]" />
        </div>

        {/* Tonearm. Coordinates: the record is 0..100, centre (50,50).
            Pivot sits off the platter at (114,10). Stopped (0deg) the arm parks on its
            rest beside the record; playing, armAngle moves the needle inward per track. */}
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {/* static: pivot base + arm rest */}
          <circle cx="114" cy="10" r="9" fill="#232327" stroke="#3c3c42" strokeWidth="1" />
          <rect x="110" y="57" width="8" height="5" rx="1.2" fill="#3a3a40" />
          <g
            style={{
              transform: `rotate(${armAngle}deg)`,
              transformOrigin: '114px 10px',
              transformBox: 'view-box',
              transition: 'transform 700ms cubic-bezier(.4,0,.2,1)',
            }}
          >
            {/* counterweight */}
            <rect x="110" y="-6" width="8" height="9" rx="1.5" fill="#9aa1ab" stroke="#6f757e" strokeWidth=".6" />
            {/* tube + headshell offset */}
            <path d="M114 10 L114 62 L110 72" stroke="#d9dce2" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* headshell + cartridge, needle tip at (110,76) */}
            <rect x="107" y="69" width="6" height="8" rx="1.2" fill="#9aa1ab" transform="rotate(16 110 73)" />
            <rect x="108.6" y="75" width="2.8" height="2" rx=".5" fill="#c0271c" transform="rotate(16 110 73)" />
            {/* pivot cap */}
            <circle cx="114" cy="10" r="4.5" fill="#c9ccd2" stroke="#7a7f88" strokeWidth=".8" />
          </g>
        </svg>
      </div>

      {/* start/stop indicator */}
      <span
        className={cn(
          'absolute bottom-[6%] right-[6%] h-2 w-2 rounded-full transition-colors',
          playing ? 'bg-[#5fe0b4] shadow-[0_0_6px_#5fe0b4]' : 'bg-white/20',
        )}
      />
    </div>
  )
}

export function RecordsApp() {
  const { open } = useOS()
  const [playing, setPlaying] = useState(true)
  const [digBy, setDigBy] = useState<DigBy>('recent')
  const crate = useMemo(() => sortRecords(digBy), [digBy])
  const [pulled, setPulled] = useState(() => recordKey(sortRecords('recent')[0]))
  const index = Math.max(0, crate.findIndex(r => recordKey(r) === pulled))
  const rec = crate[index]
  const tint = TINT_OF.get(recordKey(rec))!

  const spin: Spin = {
    key: recordKey(rec),
    title: rec.title,
    badge: '',
    hue: [tint.bg, tint.bg],
    vinylHex: rec.vinylHex,
  }

  // Tonearm angle: 0deg = parked on the rest. While playing, the needle walks
  // inward as you move through the crate: the first record sits in the outer
  // grooves (18deg), the last just outside the label (35deg).
  const ARM_FIRST = 18
  const ARM_LAST = 35
  const armAngle = playing ? ARM_FIRST + ((ARM_LAST - ARM_FIRST) * index) / Math.max(crate.length - 1, 1) : 0

  const step = (d: number) => {
    setPulled(recordKey(crate[(index + d + crate.length) % crate.length]))
    setPlaying(true)
  }

  return (
    <div className="grid h-full grid-cols-1 max-sm:grid-rows-[auto_minmax(0,1fr)] sm:grid-cols-[minmax(250px,44%)_1fr]">
      {/* Turntable. Phones: a compact row (deck left, controls right) so the crate keeps most of the screen */}
      <div className="relative flex items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_top,#2c2c30,#101012)] p-4 text-white sm:flex-col sm:p-6">
        <Turntable spin={spin} playing={playing} armAngle={armAngle} />

        <div className="flex min-w-0 flex-col items-center gap-3 max-sm:flex-1 max-sm:flex-col-reverse sm:contents">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Previous record" className="rounded-full p-2 text-white/80 hover:bg-white/10 max-sm:p-3">
            <SkipBack size={16} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setPlaying(v => !v)}
            aria-label={playing ? 'Pause' : 'Play'}
            className="os-btn os-btn--primary flex h-10 w-10 shrink-0 items-center justify-center !p-0 max-sm:h-11 max-sm:w-11"
          >
            {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden className="translate-x-px" />}
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next record" className="rounded-full p-2 text-white/80 hover:bg-white/10 max-sm:p-3">
            <SkipForward size={16} aria-hidden />
          </button>
        </div>

        <p className="max-w-full text-center font-aqua" aria-live="polite">
          <span className="block text-[10.5px] font-bold uppercase tracking-[0.08em] text-white/50">
            {playing ? 'Now spinning' : 'Paused'}
          </span>
          <span className="mt-0.5 block truncate text-[13px] font-bold text-white/95">{rec.title}</span>
          <span className="block truncate text-[12px] text-white/65">{rec.artist}</span>
        </p>
        </div>
      </div>

      <Crate
        crate={crate}
        pulled={pulled}
        digBy={digBy}
        onDigBy={setDigBy}
        onPull={key => {
          setPulled(key)
          setPlaying(true)
        }}
        onOpenCaseStudy={() => open('project', 'cut-out-bin')}
      />
    </div>
  )
}

// The crate: sleeves stacked edge-on. Pull one forward to read it.
const SLEEVE_H = 46
const PULLED_H = 176
const OVERLAP = 12

function Crate({
  crate,
  pulled,
  digBy,
  onDigBy,
  onPull,
  onOpenCaseStudy,
}: {
  crate: VinylRecord[]
  pulled: string
  digBy: DigBy
  onDigBy: (d: DigBy) => void
  onPull: (key: string) => void
  onOpenCaseStudy: () => void
}) {
  const pulledRef = useRef<HTMLButtonElement>(null)
  const pulledIdx = crate.findIndex(r => recordKey(r) === pulled)
  const artists = new Set(records.map(r => r.artist)).size
  const years = records.map(r => r.year)

  // Keep the pulled sleeve in view when stepping with the turntable buttons.
  // Wait for the sleeve to finish opening so its full height is measured.
  useEffect(() => {
    const t = setTimeout(() => pulledRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 380)
    return () => clearTimeout(t)
  }, [pulled, digBy])

  return (
    <div className="flex min-h-0 flex-col bg-canvas text-ink">
      <div className="os-statusbar flex flex-wrap items-center justify-between gap-2 !border-t-0 border-b border-[var(--chrome-border)] px-4 py-2">
        <Label className="!text-[var(--chrome-title)]">My crate</Label>
        <div className="flex items-center gap-2">
          <span className="font-aqua text-[11px] text-[var(--chrome-title)] opacity-70">Dig by</span>
          <div
            role="group"
            aria-label="Dig by"
            className="inline-flex overflow-hidden rounded-md shadow-[0_1px_2px_rgba(0,0,0,.2),inset_0_0_0_1px_rgba(0,0,0,.25)]"
          >
            {DIG_BY.map(d => (
              <button
                key={d.id}
                type="button"
                aria-pressed={digBy === d.id}
                onClick={() => onDigBy(d.id)}
                className={cn(
                  'os-seg border-l border-black/15 px-2.5 py-[3px] font-aqua text-[11.5px] first:border-l-0',
                  digBy === d.id
                    ? 'bg-gradient-to-b from-[#c7b5ff] via-[#9273f2] to-[#7048e8] text-white [text-shadow:0_-1px_0_rgba(0,0,0,.25)]'
                    : 'bg-gradient-to-b from-white to-[#e4e4e4] text-[#1d1d1f] hover:to-[#d8d8d8]',
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ol aria-label="Record collection" className="os-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3.5 pb-5 pt-4">
        {crate.map((r, idx) => {
          const key = recordKey(r)
          const isPulled = key === pulled
          const tint = TINT_OF.get(key)!
          // Sleeves above the pulled one tuck under it; sleeves below stack downward
          const zIndex = isPulled ? 100 : idx < pulledIdx ? idx + 1 : crate.length + 20 - idx
          return (
            <li key={key} className="relative" style={{ marginBottom: -OVERLAP, zIndex }}>
              <button
                ref={isPulled ? pulledRef : undefined}
                type="button"
                aria-expanded={isPulled}
                onClick={() => onPull(key)}
                className="os-sleeve relative block w-full overflow-hidden text-left"
                style={{
                  height: isPulled ? PULLED_H : SLEEVE_H,
                  background: `linear-gradient(180deg, ${tint.bg}, color-mix(in srgb, ${tint.bg}, #000 16%))`,
                  color: tint.ink,
                  borderRadius: '10px 10px 4px 4px',
                  boxShadow: isPulled
                    ? '0 8px 24px rgba(30,16,70,.45), 0 2px 6px rgba(30,16,70,.3), inset 0 0 0 1px rgba(0,0,0,.28)'
                    : '0 3px 8px rgba(30,16,70,.3), inset 0 0 0 1px rgba(0,0,0,.28)',
                }}
              >
                {/* Aqua gloss along the top edge */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-[22px] bg-gradient-to-b from-white/30 to-transparent"
                />

                {isPulled ? (
                  <>
                    {/* the record, sliding out of its sleeve */}
                    <span
                      aria-hidden
                      className="absolute -right-[58px] top-1/2 h-[150px] w-[150px] -translate-y-1/2 rounded-full"
                      style={{
                        background: r.vinylHex
                          ? `repeating-radial-gradient(circle, ${r.vinylHex} 0 2px, color-mix(in srgb, ${r.vinylHex}, #000 14%) 2px 4px)`
                          : 'repeating-radial-gradient(circle, #131313 0 2px, #222 2px 4px)',
                        boxShadow: '0 4px 14px rgba(0,0,0,.45), inset 0 0 0 1px rgba(0,0,0,.6)',
                      }}
                    >
                      <span className="absolute inset-[34%] rounded-full bg-[#f5f6f8] shadow-[inset_0_0_0_1px_rgba(0,0,0,.25)]" />
                      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111]" />
                    </span>

                    <span className="absolute left-4 top-3 font-aqua text-[10.5px] font-bold uppercase tracking-[0.08em] opacity-75">
                      No. {String(idx + 1).padStart(2, '0')} of {crate.length}
                    </span>
                    <span className="absolute inset-x-4 bottom-3.5 block pr-[92px]">
                      <span className="block font-display text-[22px] font-bold leading-[1.1] tracking-tight">{r.artist}</span>
                      <span className="mt-1 block font-aqua text-[13px] font-bold leading-snug">{r.title}</span>
                      <span className="mt-1.5 block font-aqua text-[11.5px] opacity-80">
                        {r.year} · {r.format}
                        {r.vinyl ? ` · ${r.vinyl} vinyl` : ''}
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="absolute inset-x-3.5 top-[8px] flex items-baseline justify-between gap-3">
                    <span className="truncate font-aqua text-[12.5px] font-bold">{r.title}</span>
                    <span className="shrink-0 font-aqua text-[11px] opacity-80">{r.artist}</span>
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      <StatusBar>
        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
          <span>
            {records.length} records · {artists} artists · {Math.min(...years)} to {Math.max(...years)}
          </span>
          <button type="button" onClick={onOpenCaseStudy} className="text-accent hover:underline">
            How I designed this crate →
          </button>
        </span>
      </StatusBar>
    </div>
  )
}
