import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'
import type { ReactNode } from 'react'
import { profile } from '@/lib/content'

// Link preview (iMessage, Slack, LinkedIn, X): a still of the JolieOS landing view
// in dark mode. Menu bar, the Welcome window, desktop icons, and the dock.
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

// Dark-theme tokens from globals.css
const C = {
  wallA: '#241A3D',
  wallB: '#2E2150',
  wallC: '#2A1E45',
  paper: '#232325',
  ink: '#EDEDEF',
  muted: '#A1A1A6',
  hairline: '#3A3A3D',
  chromeTop: '#4A4A4D',
  chromeBottom: '#343436',
  chromeBorder: '#131314',
  chromeTitle: '#E6E6E8',
  green: '#4cc764',
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
        width: 176,
        height: 30,
        borderRadius: 9999,
        fontSize: 16,
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
        boxShadow: '0 3px 8px rgba(0,0,0,.4)',
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
        boxShadow: '0 3px 8px rgba(0,0,0,.4)',
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
        OCT
      </div>
      <div style={{ ...flex, flex: 1, alignItems: 'center', justifyContent: 'center', fontSize: 24 * s, fontWeight: 700, color: '#1D1D1F' }}>
        3
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
          boxShadow: '0 3px 8px rgba(0,0,0,.4)',
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
        boxShadow: '0 3px 8px rgba(0,0,0,.45)',
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
        boxShadow: '0 3px 8px rgba(0,0,0,.4)',
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
        boxShadow: '0 3px 8px rgba(0,0,0,.45)',
      }}
    >
      {'>_'}
    </div>
  )
}

function DeskIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ ...flex, flexDirection: 'column', alignItems: 'center', gap: 8, width: 112 }}>
      <div style={{ ...flex, height: 58, alignItems: 'flex-end' }}>{children}</div>
      <div style={{ ...flex, fontSize: 15, fontWeight: 600, color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,.6)' }}>{label}</div>
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
            background: 'linear-gradient(rgba(48,48,52,.96), rgba(34,34,38,.96))',
            borderBottom: '1px solid rgba(0,0,0,.5)',
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
          </div>
        </div>

        {/* Welcome window */}
        <div
          style={{
            ...flex,
            position: 'absolute',
            left: 80,
            top: 58,
            width: 660,
            height: 494,
            flexDirection: 'column',
            borderRadius: '7px 7px 5px 5px',
            overflow: 'hidden',
            background: C.paper,
            boxShadow: '0 0 0 1px rgba(0,0,0,.6), 0 26px 60px rgba(0,0,0,.55)',
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

          <div style={{ ...flex, flexDirection: 'column', padding: '30px 36px 0' }}>
            <div style={{ ...flex, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', color: C.muted }}>
              WELCOME TO JOLIEOS
            </div>
            <div
              style={{
                ...flex,
                marginTop: 14,
                fontFamily: 'Fraunces',
                fontWeight: 900,
                fontSize: 46,
                lineHeight: 1.12,
                letterSpacing: '-0.015em',
                color: '#ffffff',
                maxWidth: 560,
              }}
            >
              Hi, I’m Jolie. This desktop is my portfolio.
            </div>
            <div style={{ ...flex, marginTop: 16, fontSize: 18, lineHeight: 1.5, color: C.ink, maxWidth: 580 }}>
              {profile.tagline}
            </div>
            <div
              style={{
                ...flex,
                alignSelf: 'flex-start',
                alignItems: 'center',
                gap: 8,
                marginTop: 18,
                padding: '6px 14px',
                borderRadius: 9999,
                border: `1px solid ${C.hairline}`,
                fontSize: 14,
                color: C.muted,
              }}
            >
              <div style={{ ...flex, width: 7, height: 7, borderRadius: 9999, background: C.green }} />
              {profile.availability}
            </div>
            <div style={{ ...flex, flexWrap: 'wrap', gap: 12, marginTop: 22, width: 560 }}>
              <Pill primary>About me</Pill>
              <Pill>Experience</Pill>
              <Pill>Projects</Pill>
              <Pill>
                Resume
                <svg width="11" height="11" viewBox="0 0 10 10" style={{ marginLeft: 7 }}>
                  <path d="M2 8 L8 2 M3.5 2 H8 V6.5" stroke="#1D1D1F" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                </svg>
              </Pill>
              <Pill>Say hello</Pill>
              <Pill>Records</Pill>
            </div>
            <div style={{ ...flex, marginTop: 24, height: 1, width: 560, background: C.hairline }} />
            <div style={{ ...flex, marginTop: 18, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', color: C.muted }}>
              HOW TO USE
            </div>
            <div style={{ ...flex, marginTop: 10, fontSize: 16, lineHeight: 1.5, color: C.muted, maxWidth: 560 }}>
              Double-click desktop icons, or click anything in the dock.
            </div>
          </div>
        </div>

        {/* Desktop icons, right edge */}
        <div style={{ ...flex, position: 'absolute', right: 24, top: 62, gap: 4 }}>
          <div style={{ ...flex, flexDirection: 'column', gap: 26 }}>
            <DeskIcon label="Resume.pdf">
              <DocIcon badge="pdf" />
            </DeskIcon>
            <DeskIcon label="Experience">
              <CalendarIcon />
            </DeskIcon>
            <DeskIcon label="Records">
              <VinylIcon />
            </DeskIcon>
          </div>
          <div style={{ ...flex, flexDirection: 'column', gap: 26 }}>
            <DeskIcon label="Read Me">
              <DocIcon badge="info" />
            </DeskIcon>
            <DeskIcon label="Projects">
              <FolderIcon />
            </DeskIcon>
            <DeskIcon label="About Me.txt">
              <DocIcon />
            </DeskIcon>
          </div>
        </div>

        {/* Dock, bleeding off the bottom edge */}
        <div
          style={{
            ...flex,
            position: 'absolute',
            left: 300,
            bottom: -14,
            width: 600,
            height: 82,
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingBottom: 10,
            borderRadius: 18,
            background: 'rgba(255,255,255,.12)',
            border: '1px solid rgba(255,255,255,.22)',
          }}
        >
          <DocIcon s={0.8} badge="info" />
          <CalendarIcon s={0.9} />
          <FolderIcon s={0.9} />
          <VinylIcon s={0.95} />
          <MailIcon s={0.9} />
          <TerminalIcon s={0.9} />
          <DocIcon s={0.8} badge="pdf" />
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
