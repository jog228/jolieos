import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'
import type { ReactNode } from 'react'
import { profile, proofPoints } from '@/lib/content'

// Link preview (iMessage, Slack, LinkedIn, X): a still of the JolieOS landing view
// in light mode. Menu bar, the Welcome window, desktop icons, and the dock.
//
// Node.js runtime: fonts are read from disk. Satori can't read WOFF2, so we load
// WOFF1 files from the @fontsource packages. Satori only supports flexbox, so every
// element with more than one child needs display: 'flex'.

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'JolieOS: Jolie Goldstein’s portfolio, styled as a desktop'

function font(relativePath: string): Buffer {
  return readFileSync(path.join(process.cwd(), 'node_modules', relativePath))
}

// Light-theme tokens from globals.css
const C = {
  wallA: '#EDE6FB',
  wallB: '#DCCFF6',
  wallC: '#E8DDF7',
  paper: '#FFFFFF',
  ink: '#1D1D1F',
  muted: '#6B6E75',
  hairline: '#D6D8DC',
  chromeTop: '#EDEDED',
  chromeBottom: '#D0D0D0',
  chromeBorder: '#9C9C9C',
  chromeTitle: '#404040',
  green: '#3fbf3f',
  canvas: '#F5F6F8',
  accent: '#7048E8',
  deskLabel: '#3B2A63',
}

const flex = { display: 'flex' } as const

// ── Small pieces of OS chrome ────────────────────────────────

function Light({ from, to }: { from: string; to: string }) {
  return (
    <div
      style={{
        ...flex,
        width: 14,
        height: 14,
        borderRadius: 9999,
        background: `linear-gradient(${from}, ${to})`,
        border: '1px solid rgba(0,0,0,.45)',
      }}
    />
  )
}

function Pill({ children, primary }: { children: ReactNode; primary?: boolean }) {
  return (
    <div
      style={{
        ...flex,
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        padding: '0 14px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        borderRadius: 9999,
        fontSize: 14,
        color: primary ? '#ffffff' : '#1D1D1F',
        background: primary ? 'linear-gradient(#a58bff, #6a43e0)' : 'linear-gradient(#ffffff, #dcdcdf)',
        border: '1px solid rgba(0,0,0,.35)',
      }}
    >
      {children}
    </div>
  )
}

// ── Icons (shared by the desktop and the dock) ───────────────

function DocIcon({ s = 1, badge }: { s?: number; badge?: 'pdf' | 'info' }) {
  return (
    <div
      style={{
        ...flex,
        position: 'relative',
        flexDirection: 'column',
        gap: 5 * s,
        width: 44 * s,
        height: 56 * s,
        padding: `${16 * s}px ${8 * s}px 0`,
        borderRadius: 3 * s,
        background: 'linear-gradient(#ffffff, #e9e9ee)',
        boxShadow: '0 2px 5px rgba(0,0,0,.28)',
      }}
    >
      {[1, 0.8, 1, 0.7, 0.9].map((w, i) => (
        <div key={i} style={{ ...flex, height: 2 * s, width: `${w * 100}%`, background: '#b9bbc3' }} />
      ))}
      {badge === 'pdf' && (
        <div
          style={{
            ...flex,
            position: 'absolute',
            left: -4 * s,
            bottom: 12 * s,
            padding: `${1 * s}px ${5 * s}px`,
            borderRadius: 3 * s,
            background: '#e0443e',
            color: '#fff',
            fontSize: 10 * s,
            fontWeight: 700,
          }}
        >
          PDF
        </div>
      )}
      {badge === 'info' && (
        <div
          style={{
            ...flex,
            position: 'absolute',
            left: 5 * s,
            top: 4 * s,
            width: 12 * s,
            height: 12 * s,
            borderRadius: 9999,
            background: '#7048e8',
          }}
        />
      )}
    </div>
  )
}

function CalendarIcon({ s = 1 }: { s?: number }) {
  const today = new Date()
  return (
    <div
      style={{
        ...flex,
        flexDirection: 'column',
        width: 52 * s,
        height: 52 * s,
        borderRadius: 9 * s,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 2px 5px rgba(0,0,0,.28)',
      }}
    >
      <div
        style={{
          ...flex,
          justifyContent: 'center',
          alignItems: 'center',
          height: 15 * s,
          background: '#e0443e',
          color: '#fff',
          fontSize: 9 * s,
          fontWeight: 700,
        }}
      >
        {today.toLocaleString('en-US', { month: 'short' }).toUpperCase()}
      </div>
      <div style={{ ...flex, flex: 1, alignItems: 'center', justifyContent: 'center', fontSize: 24 * s, fontWeight: 700, color: '#1D1D1F' }}>
        {today.getDate()}
      </div>
    </div>
  )
}

function FolderIcon({ s = 1 }: { s?: number }) {
  return (
    <div style={{ ...flex, flexDirection: 'column', width: 60 * s, height: 48 * s }}>
      <div style={{ ...flex, width: 24 * s, height: 7 * s, borderRadius: `${4 * s}px ${4 * s}px 0 0`, background: '#9a7ff0' }} />
      <div
        style={{
          ...flex,
          flex: 1,
          borderRadius: `0 ${6 * s}px ${6 * s}px ${6 * s}px`,
          background: 'linear-gradient(#b9a2ff, #7d5ce0)',
          boxShadow: '0 2px 5px rgba(0,0,0,.28)',
        }}
      />
    </div>
  )
}

function VinylIcon({ s = 1 }: { s?: number }) {
  return (
    <div
      style={{
        ...flex,
        alignItems: 'center',
        justifyContent: 'center',
        width: 52 * s,
        height: 52 * s,
        borderRadius: 9999,
        background: '#111113',
        border: `${4 * s}px solid #2a2a2e`,
        boxShadow: '0 2px 5px rgba(0,0,0,.3)',
      }}
    >
      <div style={{ ...flex, width: 18 * s, height: 18 * s, borderRadius: 9999, background: 'linear-gradient(135deg, #a58bff, #7048e8)' }} />
    </div>
  )
}

function MailIcon({ s = 1 }: { s?: number }) {
  return (
    <div
      style={{
        ...flex,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: 56 * s,
        height: 38 * s,
        borderRadius: 4 * s,
        background: 'linear-gradient(#ffffff, #e2e2e8)',
        boxShadow: '0 2px 5px rgba(0,0,0,.28)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          ...flex,
          width: 40 * s,
          height: 40 * s,
          marginTop: -24 * s,
          transform: 'rotate(45deg)',
          border: `${2 * s}px solid #b9bbc3`,
        }}
      />
    </div>
  )
}

function TerminalIcon({ s = 1 }: { s?: number }) {
  return (
    <div
      style={{
        ...flex,
        width: 56 * s,
        height: 44 * s,
        padding: `${6 * s}px ${8 * s}px`,
        borderRadius: 6 * s,
        background: 'linear-gradient(#2c2c30, #0e0e10)',
        border: `${1 * s}px solid #4a4a4e`,
        color: '#ffffff',
        fontSize: 16 * s,
        fontWeight: 700,
        boxShadow: '0 2px 5px rgba(0,0,0,.3)',
      }}
    >
      {'>_'}
    </div>
  )
}

// The next four reuse the SVG paths from components/os/AppIcon.tsx
// (that component uses hooks, so it can't render here directly).

function TrophyIcon({ s = 1 }: { s?: number }) {
  return (
    <svg width={56 * s} height={56 * s} viewBox="0 0 64 64">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe28a" />
          <stop offset=".55" stopColor="#f2b51e" />
          <stop offset="1" stopColor="#c98a06" />
        </linearGradient>
      </defs>
      <path d="M18 10h28v14a14 14 0 0 1-28 0z" fill="url(#gold)" stroke="#b07a08" />
      <path d="M18 14H9v4a9 9 0 0 0 9 9M46 14h9v4a9 9 0 0 1-9 9" fill="none" stroke="#c98a06" strokeWidth="3" />
      <rect x="29" y="37" width="6" height="9" fill="url(#gold)" />
      <rect x="19" y="46" width="26" height="9" rx="2" fill="#6b4a1e" />
      <rect x="24" y="49" width="16" height="3" rx="1" fill="#e9c46a" />
      <path d="M22 13h6v12a6 6 0 0 1-6-6z" fill="#fff" fillOpacity=".45" />
    </svg>
  )
}

function PressIcon({ s = 1 }: { s?: number }) {
  const line = (y: number, x1: number, x2: number) => (
    <rect key={`${y}-${x1}`} x={x1} y={y} width={x2 - x1} height="2.2" rx="1.1" fill="#b6bcc6" />
  )
  return (
    <svg width={56 * s} height={56 * s} viewBox="0 0 64 64">
      <defs>
        <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4e7ec" />
        </linearGradient>
        <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cbb6ff" />
          <stop offset="1" stopColor="#8a5fe3" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="46" height="46" rx="2" fill="#d9dce1" />
      <rect x="7" y="7" width="46" height="46" rx="2" fill="url(#paper)" stroke="#b0b6bf" />
      <rect x="12" y="12" width="36" height="5" rx="1" fill="#2b2b2b" />
      <rect x="12" y="21" width="16" height="14" rx="1" fill="url(#blue)" />
      {[21, 25, 29, 33].map(y => line(y, 31, 48))}
      {[39, 43, 47].map(y => line(y, 12, 48))}
    </svg>
  )
}

function GearIcon({ s = 1 }: { s?: number }) {
  return (
    <svg width={56 * s} height={56 * s} viewBox="0 0 64 64">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="1" stopColor="#9aa1ab" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="12" fill="url(#metal)" stroke="#8a919b" />
      <g transform="translate(32 32)">
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x="-3.5" y="-21" width="7" height="9" rx="1.5" fill="#5d646e" transform={`rotate(${i * 36})`} />
        ))}
        <circle r="15" fill="#6b727c" />
        <circle r="6" fill="#e6e9ee" />
      </g>
    </svg>
  )
}

function TrashIcon({ s = 1 }: { s?: number }) {
  return (
    <svg width={56 * s} height={56 * s} viewBox="0 0 64 64">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="1" stopColor="#9aa1ab" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="12" rx="20" ry="4.5" fill="#d8dce2" stroke="#8c939d" />
      <path d="M12 12l4 44a4 4 0 0 0 4 3.6h24a4 4 0 0 0 4-3.6l4-44" fill="url(#metal)" fillOpacity=".85" stroke="#8c939d" />
      {[20, 26, 32, 38, 44].map(x => (
        <path key={x} d={`M${x} 18 L${x + (x - 32) * 0.08} 55`} stroke="#7d848e" strokeOpacity=".55" strokeWidth="1.4" />
      ))}
      <ellipse cx="32" cy="12" rx="18" ry="3" fill="#596069" fillOpacity=".55" />
    </svg>
  )
}

function Arrow({ color, size = 11 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10">
      <path d="M2 8 L8 2 M3.5 2 H8 V6.5" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function DeskIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ ...flex, flexDirection: 'column', alignItems: 'center', gap: 8, width: 112 }}>
      <div style={{ ...flex, height: 58, alignItems: 'flex-end' }}>{children}</div>
      <div style={{ ...flex, fontSize: 15, fontWeight: 600, color: C.deskLabel, textShadow: '0 1px 0 rgba(255,255,255,.6)' }}>{label}</div>
    </div>
  )
}

// ── Image ────────────────────────────────────────────────────

export default function Image() {
  const fraunces = font('@fontsource/fraunces/files/fraunces-latin-900-normal.woff')
  const inter = font('@fontsource/inter/files/inter-latin-400-normal.woff')
  const interSemi = font('@fontsource/inter/files/inter-latin-600-normal.woff')
  const interBold = font('@fontsource/inter/files/inter-latin-700-normal.woff')

  return new ImageResponse(
    (
      <div
        style={{
          ...flex,
          position: 'relative',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          fontFamily: 'Inter',
          background: `linear-gradient(140deg, ${C.wallA} 0%, ${C.wallB} 55%, ${C.wallC} 100%)`,
        }}
      >
        {/* Menu bar */}
        <div
          style={{
            ...flex,
            alignItems: 'center',
            height: 36,
            padding: '0 20px',
            gap: 24,
            background: 'linear-gradient(rgba(255,255,255,.96), rgba(232,232,232,.96))',
            borderBottom: '1px solid rgba(0,0,0,.28)',
            fontSize: 16,
            color: C.ink,
          }}
        >
          <div style={{ ...flex, fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>jolie</div>
          <div style={flex}>Go</div>
          <div style={flex}>Social</div>
          <div style={flex}>Special</div>
          <div style={{ ...flex, marginLeft: 'auto', alignItems: 'center', gap: 8, color: C.muted, fontSize: 15 }}>
            <div style={{ ...flex, width: 7, height: 7, borderRadius: 9999, background: C.green }} />
            {profile.availability}
            <svg width="15" height="15" viewBox="0 0 24 24" style={{ marginLeft: 14 }}>
              <circle cx="11" cy="11" r="7" stroke={C.ink} strokeWidth="2.4" fill="none" />
              <path d="M16.5 16.5 L21 21" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginLeft: 10 }}>
              <circle cx="12" cy="12" r="4" stroke={C.ink} strokeWidth="2" fill="none" />
              <path
                d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                stroke={C.ink}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Welcome window */}
        <div
          style={{
            ...flex,
            position: 'absolute',
            left: 56,
            top: 60,
            width: 730,
            flexDirection: 'column',
            borderRadius: '7px 7px 5px 5px',
            overflow: 'hidden',
            background: C.paper,
            boxShadow: '0 0 0 1px rgba(0,0,0,.28), 0 18px 44px rgba(60,30,120,.28)',
          }}
        >
          <div
            style={{
              ...flex,
              alignItems: 'center',
              height: 32,
              padding: '0 12px',
              background: `linear-gradient(${C.chromeTop}, ${C.chromeBottom})`,
              borderBottom: `1px solid ${C.chromeBorder}`,
            }}
          >
            <div style={{ ...flex, gap: 8 }}>
              <Light from="#ff8a80" to="#c9302a" />
              <Light from="#ffe08a" to="#d39614" />
              <Light from="#a6ec8f" to="#33a02a" />
            </div>
            <div style={{ ...flex, flex: 1, justifyContent: 'center', marginRight: 58, fontSize: 15, color: C.chromeTitle }}>
              Welcome
            </div>
          </div>

          <div style={{ ...flex, flexDirection: 'column', padding: '24px 34px 28px' }}>
            <div style={{ ...flex, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ ...flex, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: C.muted }}>
                WELCOME TO JOLIEOS
              </div>
              <div
                style={{
                  ...flex,
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 12px',
                  borderRadius: 9999,
                  border: `1px solid ${C.hairline}`,
                  background: C.canvas,
                  fontSize: 13,
                  color: C.muted,
                }}
              >
                <div style={{ ...flex, width: 7, height: 7, borderRadius: 9999, background: C.green }} />
                {profile.availability}
              </div>
            </div>
            <div
              style={{
                ...flex,
                marginTop: 12,
                fontFamily: 'Fraunces',
                fontWeight: 900,
                fontSize: 41,
                lineHeight: 1.12,
                letterSpacing: '-0.015em',
                color: C.ink,
                maxWidth: 600,
              }}
            >
              Hi, I’m Jolie. This desktop is my portfolio.
            </div>
            <div style={{ ...flex, marginTop: 10, fontSize: 15, fontWeight: 700, color: C.accent }}>{profile.school}</div>
            <div style={{ ...flex, marginTop: 8, fontSize: 17, lineHeight: 1.5, color: C.ink }}>{profile.tagline}</div>

            {/* Proof points */}
            <div style={{ ...flex, gap: 10, marginTop: 18 }}>
              {proofPoints.map(pt => (
                <div
                  key={pt.label}
                  style={{
                    ...flex,
                    flex: 1,
                    flexDirection: 'column',
                    padding: '12px 13px 13px',
                    borderRadius: 8,
                    border: `1px solid ${C.hairline}`,
                    background: C.canvas,
                  }}
                >
                  <div style={{ ...flex, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        ...flex,
                        fontSize: 11.5,
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: C.muted,
                      }}
                    >
                      {pt.label}
                    </div>
                    <Arrow color={C.muted} size={10} />
                  </div>
                  <div style={{ ...flex, marginTop: 7, fontSize: 13.5, lineHeight: 1.38, color: C.ink }}>{pt.text}</div>
                </div>
              ))}
            </div>

            <div style={{ ...flex, gap: 8, marginTop: 18 }}>
              <Pill primary>
                View resume
                <div style={{ ...flex, marginLeft: 7 }}>
                  <Arrow color="#ffffff" />
                </div>
              </Pill>
              <Pill>About me</Pill>
              <Pill>Projects</Pill>
              <Pill>Experience</Pill>
              <Pill>Leadership</Pill>
              <Pill>Contact</Pill>
            </div>
          </div>
        </div>

        {/* Desktop icons, right edge */}
        <div style={{ ...flex, position: 'absolute', right: 20, top: 58, gap: 0 }}>
          <div style={{ ...flex, flexDirection: 'column', gap: 24 }}>
            <DeskIcon label="Leadership">
              <TrophyIcon />
            </DeskIcon>
            <DeskIcon label="Press">
              <PressIcon />
            </DeskIcon>
            <DeskIcon label="Records">
              <VinylIcon />
            </DeskIcon>
            <DeskIcon label="Resume.pdf">
              <DocIcon badge="pdf" />
            </DeskIcon>
          </div>
          <div style={{ ...flex, flexDirection: 'column', gap: 24 }}>
            <DeskIcon label="Read Me">
              <DocIcon badge="info" />
            </DeskIcon>
            <DeskIcon label="About Me.txt">
              <DocIcon />
            </DeskIcon>
            <DeskIcon label="Experience">
              <CalendarIcon />
            </DeskIcon>
            <DeskIcon label="Projects">
              <FolderIcon />
            </DeskIcon>
          </div>
        </div>

        {/* Dock, bleeding off the bottom edge */}
        <div
          style={{
            ...flex,
            position: 'absolute',
            left: 215,
            bottom: -14,
            width: 770,
            height: 82,
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingBottom: 10,
            borderRadius: 18,
            background: 'linear-gradient(rgba(255,255,255,.55), rgba(255,255,255,.3))',
            border: '1px solid rgba(255,255,255,.75)',
            boxShadow: '0 10px 30px rgba(0,0,0,.18)',
          }}
        >
          <DocIcon s={0.8} badge="info" />
          <DocIcon s={0.8} />
          <CalendarIcon s={0.9} />
          <FolderIcon s={0.9} />
          <TrophyIcon s={0.9} />
          <VinylIcon s={0.95} />
          <GearIcon s={0.9} />
          <MailIcon s={0.9} />
          <TerminalIcon s={0.9} />
          <DocIcon s={0.8} badge="pdf" />
          <div style={{ ...flex, width: 1, height: 40, background: 'rgba(0,0,0,.18)' }} />
          <TrashIcon s={0.9} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 900, style: 'normal' },
        { name: 'Inter', data: inter, weight: 400, style: 'normal' },
        { name: 'Inter', data: interSemi, weight: 600, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      ],
    },
  )
}
