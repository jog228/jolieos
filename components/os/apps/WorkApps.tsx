'use client'

// Experience (calendar split view), Experience detail, Projects (shop grid),
// Project case study, Image preview, Records (turntable)

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { experience, type Experience } from '@/lib/experience'
import { cn } from '@/lib/utils'
import { AppIcon } from '../AppIcon'
import { useOS } from '../OSProvider'
import { allProjects, findExperience, findProject, PROJECT_HUES, shortOrg } from '../registry'
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

function ProjectIcon({ id, size = 40 }: { id: string; size?: number }) {
  const p = findProject(id)
  return <AppIcon name="app" size={size} letter={p?.title[0]} hue={PROJECT_HUES[id]} />
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
      <StatusBar>{experience.length} engagements</StatusBar>
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

      <p className="mt-5 max-w-[62ch] text-[14.5px] leading-[1.75]">{exp.description}</p>

      <div className="mt-6 rounded-lg border border-hairline bg-paper p-4">
        <Label className="mb-3">Projects</Label>
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
          <p className="font-aqua text-[12.5px] text-muted">Research in progress. Nothing to ship yet; check back soon.</p>
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
      <ul className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] content-start gap-4 p-4 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] sm:p-5">
        {allProjects.map(p => {
          const cover = p.images?.[0]?.src
          const hue = PROJECT_HUES[p.id]
          return (
            <li key={p.id}>
              <button type="button" onClick={() => open('project', p.id)} className="group block w-full text-center">
                <span
                  className="relative mx-auto flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(0,0,0,.18),inset_0_0_0_1px_rgba(0,0,0,.1)] transition-transform group-hover:-translate-y-1"
                  style={{ background: `linear-gradient(135deg, ${hue?.[0] ?? '#a58bff'}, ${hue?.[1] ?? '#7048e8'})` }}
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
                  ) : (
                    <span className="font-display text-[4.5rem] font-black text-white/95 [text-shadow:0_2px_10px_rgba(0,0,0,.2)]">
                      {p.title[0]}
                    </span>
                  )}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent" />
                </span>
                <span className="mt-2 block font-aqua text-[13px] font-bold text-ink">{p.title}</span>
                <span className="block font-aqua text-[11.5px] text-muted">
                  {shortOrg(p.organization)} · {p.year}
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
  const { open } = useOS()
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
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tags.map(t => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        {p.link && (
          <OSLinkButton href={p.link.href} variant="primary" className="mt-5">
            {p.link.label} <ArrowUpRight size={12} aria-hidden />
          </OSLinkButton>
        )}
      </header>

      {/* Body */}
      <div className="flex-1 space-y-8 px-6 py-7 sm:px-9">
        <section>
          <Label className="mb-2 text-accent">The problem</Label>
          <p className="max-w-[64ch] text-[15px] leading-[1.75]">{p.problem}</p>
        </section>

        <section>
          <Label className="mb-2 text-accent">The process</Label>
          <p className="max-w-[64ch] text-[15px] leading-[1.75]">{p.process}</p>
        </section>

        {p.images?.length ? (
          <section>
            <Label className="mb-3 text-accent">Screens</Label>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.images.map((img, i) => (
                <li key={img.src}>
                  <button
                    type="button"
                    onClick={() => open('preview', `${p.id}:${i}`)}
                    className="group block w-full overflow-hidden rounded-md bg-surface text-left shadow-[0_1px_4px_rgba(0,0,0,.2),inset_0_0_0_1px_rgba(0,0,0,.1)]"
                    aria-label={`Open screenshot: ${img.alt}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt=""
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <StatusBar>
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span>Part of {shortOrg(p.organization)}</span>
          <button
            type="button"
            onClick={() => open('experienceDetail', p.experienceId)}
            className="text-accent hover:underline"
          >
            Show in Experience →
          </button>
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
        <img src={img.src} alt={img.alt} className="max-h-full max-w-full rounded shadow-[0_8px_30px_rgba(0,0,0,.5)] object-contain" />
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

// ── Records: my projects, pressed to vinyl ───────────────────
export function RecordsApp() {
  const { open } = useOS()
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const p = allProjects[i]
  const hue = PROJECT_HUES[p.id] ?? ['#a58bff', '#7048e8']
  const side = (n: number) => `${n < 3 ? 'A' : 'B'}${(n % 3) + 1}`

  const step = (d: number) => {
    setI(n => (n + d + allProjects.length) % allProjects.length)
    setPlaying(true)
  }

  return (
    <div className="grid h-full grid-cols-1 sm:grid-cols-[minmax(250px,46%)_1fr]">
      {/* Turntable */}
      <div className="relative flex flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_top,#2c2c30,#101012)] p-6 text-white">
        <div className="relative aspect-square w-[min(220px,62vw)]">
          {/* Platter + record */}
          <div
            className={cn('absolute inset-0 rounded-full', playing && 'os-spin')}
            style={{
              background:
                'repeating-radial-gradient(circle at center, #111 0 2px, #1d1d1f 2px 4px), radial-gradient(circle, #222, #000)',
              boxShadow: '0 10px 30px rgba(0,0,0,.6), inset 0 0 0 2px #000',
            }}
          >
            <div
              className="absolute inset-[32%] flex items-center justify-center rounded-full"
              style={{ background: `linear-gradient(135deg, ${hue[0]}, ${hue[1]})` }}
            >
              <span className="-translate-y-[38%] font-display text-[1.35rem] font-black leading-none text-white/95">{p.title[0]}</span>
              <span className="absolute h-2.5 w-2.5 rounded-full bg-[#111]" />
            </div>
            {/* sheen */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgba(255,255,255,.10)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,.08)_220deg,transparent_260deg)]" />
          </div>

          {/* Tonearm */}
          <svg
            viewBox="0 0 100 100"
            className="absolute -right-[12%] -top-[6%] h-[80%] w-[80%] origin-[82%_14%] transition-transform duration-500"
            style={{ transform: `rotate(${playing ? 24 : 0}deg)` }}
            aria-hidden
          >
            <circle cx="82" cy="14" r="8" fill="#c9ccd2" stroke="#7a7f88" />
            <path d="M82 14 L74 70 L62 84" stroke="#d9dce2" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <rect x="55" y="80" width="12" height="7" rx="1.5" fill="#9aa1ab" transform="rotate(-38 61 83)" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Previous record" className="rounded-full p-2 text-white/80 hover:bg-white/10">
            <SkipBack size={16} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setPlaying(v => !v)}
            aria-label={playing ? 'Pause' : 'Play'}
            className="os-btn os-btn--primary flex h-10 w-10 items-center justify-center"
          >
            {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden className="translate-x-px" />}
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next record" className="rounded-full p-2 text-white/80 hover:bg-white/10">
            <SkipForward size={16} aria-hidden />
          </button>
        </div>
      </div>

      {/* Crate / tracklist */}
      <div className="flex min-h-0 flex-col bg-paper">
        <div className="border-b border-hairline px-5 py-4">
          <Label>Now spinning · {side(i)}</Label>
          <p className="mt-1 font-display text-2xl font-bold leading-tight">{p.title}</p>
          <p className="font-aqua text-[12.5px] text-muted">
            {shortOrg(p.organization)} · {p.year}
          </p>
          <OSButton variant="primary" className="mt-3" onClick={() => open('project', p.id)}>
            Read the liner notes
          </OSButton>
        </div>
        <ol className="os-scroll min-h-0 flex-1 overflow-auto py-1" aria-label="Tracklist">
          {allProjects.map((t, n) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  setI(n)
                  setPlaying(true)
                }}
                aria-current={n === i}
                className={cn(
                  'flex w-full items-center gap-3 px-5 py-2 text-left font-aqua text-[13px]',
                  n === i ? 'bg-gradient-to-b from-[#a58bff] to-[#7048e8] text-white' : 'hover:bg-canvas',
                )}
              >
                <span className={cn('w-6 font-mono text-[11px]', n === i ? 'text-white/80' : 'text-muted')}>{side(n)}</span>
                <span className="flex-1 truncate font-medium">{t.title}</span>
                <span className={cn('text-[11.5px]', n === i ? 'text-white/80' : 'text-muted')}>{t.year}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="border-t border-hairline px-5 py-2 font-aqua text-[11.5px] text-muted">
          My projects, pressed to vinyl. I collect the real ones too.
        </p>
      </div>
    </div>
  )
}
