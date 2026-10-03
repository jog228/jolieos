'use client'

// Small shared building blocks for JolieOS app windows.

import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { useOS } from './OSProvider'
import type { AppId } from './registry'

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary'
}

const btnBase =
  'os-btn inline-flex items-center justify-center gap-1.5 px-3.5 py-[5px] text-[12.5px] font-medium leading-none whitespace-nowrap'

export function OSButton({ variant = 'default', className, ...props }: BtnProps) {
  return <button type="button" {...props} className={cn(btnBase, `os-btn--${variant}`, className)} />
}

export function OSLinkButton({
  className,
  variant = 'default',
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: 'default' | 'primary' }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={cn(btnBase, `os-btn--${variant}`, className)}
    />
  )
}

// Leopard-style section header: small, bold, uppercase, gray
export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('font-aqua text-[11px] font-bold uppercase tracking-[0.06em] text-muted', className)}>
      {children}
    </p>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-hairline bg-canvas px-2 py-0.5 font-aqua text-[11px] text-muted">
      {children}
    </span>
  )
}

// A strip at the bottom of a window, like a Finder status bar
export function StatusBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="os-statusbar sticky bottom-0 z-10 px-3 py-[3px] text-center font-aqua text-[11px] text-[var(--chrome-title)]">
      {children}
    </div>
  )
}

// Turns known phrases inside a paragraph into buttons that open windows.
export type LinkMap = Record<string, { app: AppId; param?: string }>

export function Linkified({ text, map }: { text: string; map: LinkMap }) {
  const { open } = useOS()
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  if (!keys.length) return <>{text}</>
  const pattern = new RegExp(`(${keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  const parts = text.split(pattern)
  const used = new Set<string>()

  return (
    <>
      {parts.map((part, i) => {
        const target = map[part]
        // Only link the first mention of each phrase
        if (!target || used.has(part)) return <Fragment key={i}>{part}</Fragment>
        used.add(part)
        return (
          <button
            key={i}
            type="button"
            onClick={() => open(target.app, target.param)}
            className="inline font-medium text-accent underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent"
          >
            {part}
          </button>
        )
      })}
    </>
  )
}
