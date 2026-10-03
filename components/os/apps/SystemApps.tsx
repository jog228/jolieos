'use client'

// Mail (contact), Terminal, Trash

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { links, profile, skillGroups } from '@/lib/content'
import { experience } from '@/lib/experience'
import { useTheme } from '@/providers/ThemeProvider'
import { useOS } from '../OSProvider'
import { AppIcon, type IconName } from '../AppIcon'
import { allProjects, type AppId } from '../registry'
import { Label, OSButton, OSLinkButton } from '../ui'

// ── Mail: compose a message, sent via the visitor's mail app ──
export function ContactApp() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [copied, setCopied] = useState(false)

  const href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const field = 'w-full rounded-md border border-hairline bg-paper px-2.5 py-1.5 font-aqua text-[13.5px] text-ink shadow-[inset_0_1px_2px_rgba(0,0,0,.08)] placeholder:text-muted focus:outline-none focus:ring-[3px] focus:ring-accent/35'

  return (
    <form
      className="flex h-full flex-col gap-3 p-5"
      onSubmit={e => {
        e.preventDefault()
        window.location.href = href
      }}
    >
      <p className="text-[14.5px] leading-relaxed">
        Whether it&apos;s a role, a project, or a conversation about UX, front-end, or AI, I&apos;m glad to hear from you.
      </p>

      <div className="flex items-center gap-2">
        <Label className="w-16 shrink-0">To</Label>
        <span className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md border border-hairline bg-canvas px-2.5 py-1.5 font-aqua text-[13.5px]">
          <span className="truncate">{profile.email}</span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Email copied' : 'Copy email address'}
            className="shrink-0 text-muted hover:text-accent"
          >
            {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          </button>
        </span>
      </div>
      <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>

      <label className="flex items-center gap-2">
        <Label className="w-16 shrink-0">Subject</Label>
        <input
          className={field}
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Summer 2027 internship"
        />
      </label>

      <label className="flex min-h-0 flex-1 flex-col gap-1.5">
        <span className="sr-only">Message</span>
        <textarea
          className={`${field} min-h-[120px] flex-1 resize-none leading-relaxed`}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Hi Jolie, …"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <OSButton type="submit" variant="primary">Send</OSButton>
        <OSLinkButton href={links.linkedin}>LinkedIn</OSLinkButton>
        <OSLinkButton href={links.github}>GitHub</OSLinkButton>
      </div>
    </form>
  )
}

// ── Terminal ─────────────────────────────────────────────────
type Line = { kind: 'in' | 'out' | 'err'; text: string }

const PROMPT = 'guest@jolieos ~ %'

const OPENABLE: { names: string[]; app: AppId; param?: string }[] = [
  { names: ['about', 'about_me.txt', 'about_me', 'about.txt'], app: 'about' },
  { names: ['experience', 'experience/'], app: 'experience' },
  { names: ['projects', 'projects/'], app: 'projects' },
  { names: ['skills'], app: 'skills' },
  { names: ['leadership'], app: 'leadership' },
  { names: ['press'], app: 'press' },
  { names: ['mail', 'contact'], app: 'contact' },
  { names: ['trash'], app: 'trash' },
  { names: ['records', 'music', 'vinyl'], app: 'records' },
  { names: ['readme', 'read_me_first', 'welcome'], app: 'welcome' },
  ...allProjects.map(p => ({
    names: [p.id, p.title.toLowerCase(), `${p.title.toLowerCase()}.app`],
    app: 'project' as AppId,
    param: p.id,
  })),
]

const HELP = `available commands:
  help              show this list
  ls                list files on the desktop
  open <name>       open a file, folder, or project (try: open intelswap)
  whoami            who built this
  experience        list where I've worked
  projects          list projects
  skills            print my skills
  resume            open my resume
  contact           how to reach me
  play              put on a record
  theme             toggle light / dark mode
  date              print the date
  clear             clear the screen`

export function TerminalApp() {
  const { open, close } = useOS()
  const { toggleTheme } = useTheme()
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: 'JolieOS Terminal v2026.10. Type "help" to get started.' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  function run(raw: string): Line[] | 'clear' {
    const cmd = raw.trim()
    if (!cmd) return []
    const [name, ...args] = cmd.split(/\s+/)
    const arg = args.join(' ').toLowerCase()
    const out = (text: string): Line[] => [{ kind: 'out', text }]

    switch (name.toLowerCase()) {
      case 'help':
      case 'man':
        return out(HELP)
      case 'ls':
        return out(
          'About_Me.txt   Experience/   Projects/   Skills   Leadership\nPress          Resume.pdf    Mail          Terminal   Trash',
        )
      case 'open':
      case 'cat':
      case 'cd': {
        if (!arg) return [{ kind: 'err', text: `usage: ${name} <name>` }]
        if (arg.startsWith('resume')) {
          window.open(links.resume, '_blank', 'noopener,noreferrer')
          return out('opening Resume.pdf in a new tab…')
        }
        const hit = OPENABLE.find(o => o.names.includes(arg))
        if (!hit) return [{ kind: 'err', text: `${name}: ${arg}: No such file or directory. Try "ls".` }]
        open(hit.app, hit.param)
        return out(`opening ${arg}…`)
      }
      case 'whoami':
        return out(`${profile.name}\n${profile.role}\n${profile.tagline}`)
      case 'experience':
        return out(experience.map(e => `• ${e.role} @ ${e.organization.split('·')[0].trim()}  (${e.dates})`).join('\n'))
      case 'projects':
        return out(
          allProjects.map(p => `• ${p.title.padEnd(15)} ${p.year}  ${p.tags.slice(0, 3).join(', ')}`).join('\n') +
            '\n\nrun "open <project>" to launch one',
        )
      case 'skills':
        return out(skillGroups.map(g => `${g.label}:\n  ${g.items.join(', ')}`).join('\n'))
      case 'resume':
        window.open(links.resume, '_blank', 'noopener,noreferrer')
        return out('opening Resume.pdf in a new tab…')
      case 'contact':
      case 'email':
        return out(`email     ${profile.email}\nlinkedin  ${links.linkedin}\ngithub    ${links.github}`)
      case 'play':
        open('records')
        return out('dropping the needle… ♪')
      case 'theme':
        toggleTheme()
        return out('theme toggled.')
      case 'date':
        return out(new Date().toString())
      case 'echo':
        return out(args.join(' '))
      case 'clear':
        return 'clear'
      case 'exit':
        close('terminal')
        return []
      case 'sudo':
        if (/hire/.test(arg)) {
          open('contact')
          return out('[sudo] permission granted. Opening Mail so you can make it official ✉')
        }
        return [{ kind: 'err', text: 'guest is not in the sudoers file. This incident will be reported.' }]
      case 'rm':
        return [{ kind: 'err', text: 'rm: permission denied. Nice try.' }]
      default:
        return [{ kind: 'err', text: `command not found: ${name}. Type "help".` }]
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const result = run(input)
    if (result === 'clear') setLines([])
    else setLines(l => [...l, { kind: 'in', text: input }, ...result])
    if (input.trim()) setHistory(h => [...h, input])
    setHIdx(null)
    setInput('')
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = hIdx === null ? history.length - 1 : Math.max(0, hIdx - 1)
      setHIdx(i)
      setInput(history[i])
    } else if (e.key === 'ArrowDown' && hIdx !== null) {
      e.preventDefault()
      const i = hIdx + 1
      if (i >= history.length) {
        setHIdx(null)
        setInput('')
      } else {
        setHIdx(i)
        setInput(history[i])
      }
    }
  }

  return (
    <div
      className="min-h-full bg-[#1C1B18] p-4 font-mono text-[12.5px] leading-relaxed text-[#F2EDE3]"
      onClick={() => inputRef.current?.focus()}
    >
      <div role="log" aria-live="polite">
        {lines.map((l, i) => (
          <pre
            key={i}
            className={
              'whitespace-pre-wrap break-words font-mono ' +
              (l.kind === 'err' ? 'text-[#FF8A7A]' : l.kind === 'in' ? 'text-[#F2EDE3]' : 'text-[#A8A192]')
            }
          >
            {l.kind === 'in' ? (
              <>
                <span className="text-[#8EA2FF]">{PROMPT}</span> {l.text}
              </>
            ) : (
              l.text
            )}
          </pre>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2">
        <label htmlFor="term-input" className="shrink-0 text-[#8EA2FF]">
          {PROMPT}
        </label>
        <input
          id="term-input"
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent caret-[#8EA2FF] outline-none"
          aria-label="Terminal command"
        />
      </form>
      <div ref={endRef} />
    </div>
  )
}

// ── Trash: small easter eggs that point back to real work ────
interface TrashItem {
  name: string
  icon: IconName
  note: string
  action?: { label: string; app: AppId; param?: string }
}

const TRASH: TrashItem[] = [
  {
    name: 'Drupal_Knowledge_Tool',
    icon: 'folder',
    note: 'Retired in 2026. I scoped and built its replacement during my Federal Reserve internship.',
    action: { label: 'Open Intelswap', app: 'project', param: 'intelswap' },
  },
  {
    name: 'unsolicited_feedback.js',
    icon: 'doc',
    note: 'iCodePal only reads a student’s code when they ask for help. This file did not make the cut.',
    action: { label: 'Open iCodePal', app: 'project', param: 'icodepal' },
  },
  {
    name: 'placeholder_bio.txt',
    icon: 'doc',
    note: 'Replaced by a version written in my own voice.',
    action: { label: 'Open About_Me.txt', app: 'about' },
  },
]

export function TrashApp() {
  const { open } = useOS()
  const [items, setItems] = useState(TRASH)
  const [sel, setSel] = useState<string | null>(null)
  const current = items.find(i => i.name === sel)

  return (
    <div className="flex h-full flex-col">
      <ul className="flex flex-1 flex-wrap content-start gap-2 p-4">
        {items.map(item => (
          <li key={item.name}>
            <button
              type="button"
              onClick={() => setSel(item.name)}
              aria-pressed={sel === item.name}
              className="group flex w-[118px] flex-col items-center gap-1.5 p-2"
            >
              <AppIcon name={item.icon} size={44} />
              <span
                className={
                  'break-all rounded px-1.5 text-center font-aqua text-[11.5px] leading-tight ' +
                  (sel === item.name ? 'bg-accent text-white' : 'group-hover:bg-surface')
                }
              >
                {item.name}
              </span>
            </button>
          </li>
        ))}
        {!items.length && (
          <li className="w-full pt-10 text-center font-aqua text-[13px] text-muted">
            Trash is empty. Some things are worth keeping, though.
          </li>
        )}
      </ul>

      <div className="os-statusbar flex min-h-[60px] items-center gap-3 px-4 py-2.5">
        <p className="flex-1 font-aqua text-[12.5px] leading-snug text-[var(--chrome-title)]">
          {current ? current.note : items.length ? 'Select an item to inspect it.' : ''}
        </p>
        {current?.action ? (
          <OSButton onClick={() => open(current.action!.app, current.action!.param)}>
            {current.action.label}
          </OSButton>
        ) : items.length ? (
          <OSButton
            onClick={() => {
              setItems([])
              setSel(null)
            }}
          >
            Empty Trash
          </OSButton>
        ) : null}
      </div>
    </div>
  )
}
