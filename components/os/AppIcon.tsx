'use client'

// Glossy Mac OS X (Aqua-era) style icons, drawn as inline SVG so they stay
// sharp at any size and ship with zero image requests.

import { useId } from 'react'

export type IconName =
  | 'readme'
  | 'doc'
  | 'pdf'
  | 'folder'
  | 'calendar'
  | 'terminal'
  | 'mail'
  | 'trash'
  | 'press'
  | 'gear'
  | 'trophy'
  | 'app'
  | 'image'
  | 'vinyl'

interface Props {
  name: IconName
  size?: number
  className?: string
  /** Letter shown on the generic `app` icon */
  letter?: string
  /** Two gradient stops for the `app` icon */
  hue?: [string, string]
}

export function AppIcon({ name, size = 48, className, letter, hue }: Props) {
  const uid = useId().replace(/:/g, '')
  const id = (s: string) => `${uid}-${s}`
  const url = (s: string) => `url(#${id(s)})`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className={className}>
      <defs>
        <linearGradient id={id('paper')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4e7ec" />
        </linearGradient>
        <linearGradient id={id('blue')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cbb6ff" />
          <stop offset="1" stopColor="#8a5fe3" />
        </linearGradient>
        <linearGradient id={id('blueBack')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a687ee" />
          <stop offset="1" stopColor="#6c43c9" />
        </linearGradient>
        <linearGradient id={id('red')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6b5e" />
          <stop offset="1" stopColor="#d1251a" />
        </linearGradient>
        <linearGradient id={id('gold')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe28a" />
          <stop offset=".55" stopColor="#f2b51e" />
          <stop offset="1" stopColor="#c98a06" />
        </linearGradient>
        <linearGradient id={id('metal')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="1" stopColor="#9aa1ab" />
        </linearGradient>
        <linearGradient id={id('screen')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3d44" />
          <stop offset="1" stopColor="#0d0e11" />
        </linearGradient>
        <linearGradient id={id('app')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hue?.[0] ?? '#a58bff'} />
          <stop offset="1" stopColor={hue?.[1] ?? '#7048e8'} />
        </linearGradient>
        <linearGradient id={id('gloss')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('vinyl')} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#0b0b0b" />
        </radialGradient>
        <filter id={id('shadow')} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" floodOpacity=".35" />
        </filter>
      </defs>

      <g filter={url('shadow')}>{renderIcon(name, url, letter)}</g>
    </svg>
  )
}

function Page({ url, children }: { url: (s: string) => string; children?: React.ReactNode }) {
  return (
    <>
      <path d="M14 4h26l12 12v42a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill={url('paper')} stroke="#b9bec7" />
      <path d="M40 4v10a2 2 0 0 0 2 2h10" fill="#dfe3e9" stroke="#b9bec7" />
      {children}
    </>
  )
}

function lines(ys: number[], x1 = 19, x2 = 45) {
  return ys.map(y => <rect key={y} x={x1} y={y} width={x2 - x1} height="2.2" rx="1.1" fill="#b6bcc6" />)
}

function renderIcon(name: IconName, url: (s: string) => string, letter?: string) {
  switch (name) {
    case 'doc':
      return <Page url={url}>{lines([24, 30, 36, 42, 48])}</Page>

    case 'readme':
      return (
        <Page url={url}>
          {lines([30, 36, 42, 48])}
          <circle cx="24" cy="20" r="7" fill={url('blue')} stroke="#6c43c9" />
          <rect x="23" y="18.5" width="2.2" height="6" rx="1" fill="#fff" />
          <circle cx="24.1" cy="16" r="1.3" fill="#fff" />
        </Page>
      )

    case 'pdf':
      return (
        <Page url={url}>
          {lines([22, 28])}
          <rect x="8" y="34" width="40" height="14" rx="2" fill={url('red')} />
          <text x="28" y="45" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">
            PDF
          </text>
        </Page>
      )

    case 'folder':
      return (
        <>
          <path d="M5 14a3 3 0 0 1 3-3h15l5 5h28a3 3 0 0 1 3 3v31a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill={url('blueBack')} />
          <path d="M5 22a3 3 0 0 1 3-3h48a3 3 0 0 1 3 3v28a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" fill={url('blue')} stroke="#7650d0" />
          <path d="M6 23h52" stroke="#fff" strokeOpacity=".6" />
        </>
      )

    case 'calendar': {
      const now = new Date()
      const mon = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      return (
        <>
          <rect x="8" y="8" width="48" height="50" rx="7" fill={url('paper')} stroke="#b9bec7" />
          <path d="M8 15a7 7 0 0 1 7-7h34a7 7 0 0 1 7 7v7H8z" fill={url('red')} />
          <text x="32" y="19.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" suppressHydrationWarning>
            {mon}
          </text>
          <text x="32" y="49" textAnchor="middle" fontSize="24" fontWeight="600" fill="#2b2b2b" fontFamily="Helvetica, Arial, sans-serif" suppressHydrationWarning>
            {now.getDate()}
          </text>
        </>
      )
    }

    case 'terminal':
      return (
        <>
          <rect x="5" y="9" width="54" height="44" rx="5" fill={url('metal')} stroke="#8a919b" />
          <rect x="9" y="13" width="46" height="36" rx="2" fill={url('screen')} />
          <path d="M15 22l7 5-7 5" stroke="#e8ecf2" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="25" y="31" width="11" height="2.6" rx="1.3" fill="#e8ecf2" />
          <path d="M10 14h44" stroke="#fff" strokeOpacity=".15" />
        </>
      )

    case 'mail':
      return (
        <>
          <rect x="5" y="14" width="54" height="36" rx="4" fill={url('paper')} stroke="#a9b0ba" />
          <path d="M6 16l26 19 26-19" fill="none" stroke="#a9b0ba" strokeWidth="1.6" />
          <rect x="43" y="18" width="11" height="13" rx="1" fill={url('blue')} stroke="#fff" strokeWidth="1.2" />
          <circle cx="48.5" cy="24.5" r="3" fill="#fff" fillOpacity=".8" />
        </>
      )

    case 'trash':
      return (
        <>
          <ellipse cx="32" cy="12" rx="20" ry="4.5" fill="#d8dce2" stroke="#8c939d" />
          <path d="M12 12l4 44a4 4 0 0 0 4 3.6h24a4 4 0 0 0 4-3.6l4-44" fill={url('metal')} fillOpacity=".85" stroke="#8c939d" />
          {[20, 26, 32, 38, 44].map(x => (
            <path key={x} d={`M${x} 18 L${x + (x - 32) * 0.08} 55`} stroke="#7d848e" strokeOpacity=".55" strokeWidth="1.4" />
          ))}
          <ellipse cx="32" cy="12" rx="18" ry="3" fill="#596069" fillOpacity=".55" />
        </>
      )

    case 'press':
      return (
        <>
          <rect x="10" y="10" width="46" height="46" rx="2" fill="#d9dce1" />
          <rect x="7" y="7" width="46" height="46" rx="2" fill={url('paper')} stroke="#b0b6bf" />
          <rect x="12" y="12" width="36" height="5" rx="1" fill="#2b2b2b" />
          <rect x="12" y="21" width="16" height="14" rx="1" fill={url('blue')} />
          {lines([21, 25, 29, 33], 31, 48)}
          {lines([39, 43, 47], 12, 48)}
        </>
      )

    case 'gear': {
      const teeth = Array.from({ length: 10 }, (_, i) => i * 36)
      return (
        <>
          <rect x="6" y="6" width="52" height="52" rx="12" fill={url('metal')} stroke="#8a919b" />
          <g transform="translate(32 32)">
            {teeth.map(a => (
              <rect key={a} x="-3.5" y="-21" width="7" height="9" rx="1.5" fill="#5d646e" transform={`rotate(${a})`} />
            ))}
            <circle r="15" fill="#6b727c" />
            <circle r="6" fill="#e6e9ee" />
          </g>
          <rect x="7" y="7" width="50" height="22" rx="11" fill={url('gloss')} />
        </>
      )
    }

    case 'trophy':
      return (
        <>
          <path d="M18 10h28v14a14 14 0 0 1-28 0z" fill={url('gold')} stroke="#b07a08" />
          <path d="M18 14H9v4a9 9 0 0 0 9 9M46 14h9v4a9 9 0 0 1-9 9" fill="none" stroke="#c98a06" strokeWidth="3" />
          <rect x="29" y="37" width="6" height="9" fill={url('gold')} />
          <rect x="19" y="46" width="26" height="9" rx="2" fill="#6b4a1e" />
          <rect x="24" y="49" width="16" height="3" rx="1" fill="#e9c46a" />
          <path d="M22 13h6v12a6 6 0 0 1-6-6z" fill="#fff" fillOpacity=".45" />
        </>
      )

    case 'app':
      return (
        <>
          <rect x="6" y="6" width="52" height="52" rx="12" fill={url('app')} />
          <rect x="6" y="6" width="52" height="24" rx="12" fill={url('gloss')} />
          <text
            x="32"
            y="43"
            textAnchor="middle"
            fontSize={letter && letter.length > 1 ? 18 : 27}
            fontWeight="700"
            fill="#fff"
            fontFamily="Georgia, 'Times New Roman', serif"
          >
            {letter ?? '•'}
          </text>
        </>
      )

    case 'image':
      return (
        <>
          <rect x="5" y="10" width="54" height="44" rx="3" fill="#fff" stroke="#a9b0ba" />
          <rect x="9" y="14" width="46" height="36" fill="#bcd6ff" />
          <circle cx="44" cy="23" r="4.5" fill="#ffe28a" />
          <path d="M9 50l14-17 9 10 7-7 16 14z" fill="#3d8b4f" />
        </>
      )

    case 'vinyl':
      return (
        <>
          <circle cx="32" cy="32" r="27" fill={url('vinyl')} />
          {[22, 18, 14].map(r => (
            <circle key={r} cx="32" cy="32" r={r} fill="none" stroke="#fff" strokeOpacity=".08" />
          ))}
          <circle cx="32" cy="32" r="9.5" fill={url('app')} />
          <circle cx="32" cy="32" r="2" fill="#111" />
          <path d="M14 20a22 22 0 0 1 14-10" stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )
  }
}
