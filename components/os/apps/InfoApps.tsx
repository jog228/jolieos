'use client'

// Read_Me_First, About_Me.txt, Skills, Leadership, Press

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { about, links, profile, proofPoints, skillGroups } from '@/lib/content'
import { leadership } from '@/lib/experience'
import { press } from '@/lib/press'
import { cn } from '@/lib/utils'
import { useOS } from '../OSProvider'
import { AppIcon } from '../AppIcon'
import { Label, Linkified, OSButton, OSLinkButton, StatusBar, type LinkMap } from '../ui'

// ── Read_Me_First ────────────────────────────────────────────
export function WelcomeApp() {
  const { open, isMobile } = useOS()
  return (
    <div className="p-5 sm:px-7 sm:py-6">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <Label>Welcome to JolieOS</Label>
        <p className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-2.5 py-0.5 font-aqua text-[11.5px] text-muted">
          <span aria-hidden className="os-blink inline-block h-1.5 w-1.5 rounded-full bg-[#3fbf3f]" />
          {profile.availability}
        </p>
      </div>

      <h3 className="mt-3 font-display text-[1.7rem] font-bold leading-[1.15] tracking-tight sm:text-[2rem]">
        Hi, I&apos;m Jolie. This desktop is my portfolio.
      </h3>
      <p className="mt-2 font-aqua text-[12.5px] font-bold text-accent">{profile.school}</p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink">{profile.tagline}</p>

      {/* The short version: three facts, each opening the window that backs it up */}
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {proofPoints.map(pt => (
          <li key={pt.label} className="flex">
            <button
              type="button"
              onClick={() => open(pt.app, pt.param)}
              className="os-card group flex w-full flex-col rounded-lg border border-hairline bg-canvas p-3 text-left"
            >
              <span className="flex items-center justify-between gap-1 font-aqua text-[11px] font-bold uppercase tracking-[0.05em] text-muted group-hover:text-accent">
                {pt.label}
                <ArrowUpRight size={11} aria-hidden className="shrink-0 opacity-50 group-hover:opacity-100" />
              </span>
              <span className="mt-1.5 text-[12.5px] leading-snug text-ink">{pt.text}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <OSLinkButton href={links.resume} variant="primary" className="px-4">
          View resume <ArrowUpRight size={12} aria-hidden />
        </OSLinkButton>
        <OSButton onClick={() => open('projects')}>Projects</OSButton>
        <OSButton onClick={() => open('experience')}>Experience</OSButton>
        <OSButton onClick={() => open('about')}>About me</OSButton>
        <OSButton onClick={() => open('leadership')}>Leadership</OSButton>
        <OSButton onClick={() => open('contact')}>Contact</OSButton>
      </div>

      <div className="mt-4 border-t border-hairline pt-3">
        <Label className="mb-1.5">How to use</Label>
        <ul className="space-y-0.5 text-[12.5px] leading-relaxed text-muted">
          {isMobile ? (
            <li>Tap an icon or the dock to open things. Close windows with the red button.</li>
          ) : (
            <>
              <li>Double-click desktop icons, or click anything in the dock. Drag windows by their title bars.</li>
              <li>
                Press <kbd className="rounded border border-hairline bg-canvas px-1 font-aqua text-[12px] text-ink">⌘K</kbd> to
                search everything with Spotlight. Linked words open related windows.
              </li>
            </>
          )}
          <li>
            Curious? Type <code className="rounded bg-surface px-1 font-mono text-[12px] text-ink">help</code> in
            the Terminal, or put on a record.
          </li>
        </ul>
      </div>
    </div>
  )
}

// ── About_Me.txt ─────────────────────────────────────────────
const ABOUT_LINKS: LinkMap = {
  'Federal Reserve Board': { app: 'experienceDetail', param: 'federal-reserve' },
  iCodePal: { app: 'project', param: 'icodepal' },
  'DiFranzo Lab': { app: 'experienceDetail', param: 'difranzo-lab' },
  "Lehigh's AI Club": { app: 'leadership' },
  'Global Social Impact Fellowship': { app: 'experienceDetail', param: 'creative-inquiry' },
}

export function AboutApp() {
  const words = about.join(' ').split(/\s+/).length
  return (
    <div className="flex min-h-full flex-col">
      <article className="flex-1 px-6 py-6 sm:px-9 sm:py-8">
        <Label>~/Desktop/About_Me.txt</Label>
        <h3 className="mt-2 font-display text-[2.25rem] font-bold leading-none tracking-tight">About me</h3>
        <div className="mt-6 max-w-[60ch] space-y-5 text-[15.5px] leading-[1.75]">
          {about.map((p, i) => (
            <p key={i}>
              <Linkified text={p} map={ABOUT_LINKS} />
            </p>
          ))}
        </div>
      </article>
      <StatusBar>
        {about.length} paragraphs · {words} words · Plain text · Read-only
      </StatusBar>
    </div>
  )
}

// ── Skills Control Panel ─────────────────────────────────────
export function SkillsApp() {
  const [tab, setTab] = useState(0)
  const group = skillGroups[tab]

  function onTabKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const next = (tab + (e.key === 'ArrowRight' ? 1 : -1) + skillGroups.length) % skillGroups.length
      setTab(next)
      document.getElementById(`skills-tab-${next}`)?.focus()
    }
  }

  return (
    <div className="p-5">
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Skill categories"
          className="inline-flex overflow-hidden rounded-md shadow-[0_1px_2px_rgba(0,0,0,.2),inset_0_0_0_1px_rgba(0,0,0,.25)]"
        >
          {skillGroups.map((g, i) => (
            <button
              key={g.label}
              id={`skills-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={tab === i}
              aria-controls="skills-panel"
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={onTabKey}
              className={cn(
                'border-l border-black/15 px-3.5 py-1 font-aqua text-[12.5px] first:border-l-0',
                tab === i
                  ? 'bg-gradient-to-b from-[#c7b5ff] via-[#9273f2] to-[#7048e8] text-white [text-shadow:0_-1px_0_rgba(0,0,0,.25)]'
                  : 'bg-gradient-to-b from-white to-[#e4e4e4] text-[#1d1d1f] hover:to-[#d8d8d8]',
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <ul
        id="skills-panel"
        role="tabpanel"
        aria-labelledby={`skills-tab-${tab}`}
        className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 rounded-lg border border-hairline bg-canvas p-4 sm:grid-cols-2"
      >
        {group.items.map(item => (
          <li key={item} className="flex items-center gap-2.5 text-[14.5px]">
            <span
              aria-hidden
              className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] bg-gradient-to-b from-[#c7b5ff] to-[#7048e8] text-[10px] font-bold text-white shadow-[inset_0_0_0_1px_rgba(0,0,0,.25)]"
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center font-aqua text-[11.5px] text-muted">
        {group.items.length} modules installed · All systems nominal
      </p>
    </div>
  )
}

// ── Leadership ───────────────────────────────────────────────
export function LeadershipApp() {
  return (
    <div className="flex min-h-full flex-col">
      <ul className="flex-1 divide-y divide-hairline px-5 py-2">
        {leadership.map(item => (
          <li key={item.role + item.organization} className="flex items-start gap-3 py-3.5">
            <AppIcon name="trophy" size={32} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-semibold leading-snug">{item.role}</p>
              <p className="text-[14px] text-muted">{item.organization}</p>
              {item.note && <p className="mt-1 max-w-[46ch] text-[13px] leading-snug text-ink">{item.note}</p>}
            </div>
            <p className="shrink-0 pt-1 text-right font-aqua text-[11.5px] text-muted">
              {item.dates}
            </p>
          </li>
        ))}
      </ul>
      <StatusBar>{leadership.length} items</StatusBar>
    </div>
  )
}

// ── Press Clippings ──────────────────────────────────────────
export function PressApp() {
  return (
    <div className="space-y-5 p-5">
      {press.map(item => (
        <article key={item.href} className="rounded-lg border border-hairline bg-canvas p-5 shadow-[0_1px_3px_rgba(0,0,0,.08)]">
          <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2">
            <Label className="text-ink">{item.publication}</Label>
            <Label>{item.date}</Label>
          </div>
          <h3 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight">{item.title}</h3>
          {item.pullQuote && (
            <blockquote className="mt-3 border-l-[3px] border-accent pl-3 text-[14.5px] italic leading-relaxed">
              &ldquo;{item.pullQuote}&rdquo;
              {item.attribution && (
                <footer className="mt-1.5 font-aqua text-[12px] not-italic text-muted">
                  {item.attribution}
                </footer>
              )}
            </blockquote>
          )}
          {item.authors && <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.authors}</p>}
          <OSLinkButton href={item.href} className="mt-4">
            {item.linkLabel ?? 'Read article'} <ArrowUpRight size={12} aria-hidden />
          </OSLinkButton>
        </article>
      ))}
    </div>
  )
}
