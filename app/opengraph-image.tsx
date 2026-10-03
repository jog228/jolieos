import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import path from 'path'

// Node.js runtime — needed to read font files from disk.
// WOFF2 is unsupported in the bundled Satori; we load WOFF1 from @fontsource packages instead.
// (If you upgrade Next.js and Satori gains WOFF2 support, switch back to Edge + Google Fonts fetch.)

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function font(relativePath: string): Buffer {
  return readFileSync(path.join(process.cwd(), 'node_modules', relativePath))
}

export default function Image() {
  const frauncesData = font('@fontsource/fraunces/files/fraunces-latin-900-normal.woff')
  const interData = font('@fontsource/inter/files/inter-latin-400-normal.woff')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: '#FAF8F3',
          padding: '80px',
        }}
      >
        {/* Name — Fraunces 900, matching hero */}
        <div
          style={{
            fontFamily: 'Fraunces',
            fontWeight: 900,
            fontSize: 96,
            color: '#1C1B18',
            lineHeight: 0.93,
            letterSpacing: '-0.02em',
            marginBottom: 36,
            display: 'flex',
          }}
        >
          Jolie Goldstein
        </div>

        {/* Role — Inter 400, uppercase, letter-spaced, muted */}
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 17,
            color: '#6E6B63',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 56,
            display: 'flex',
          }}
        >
          Front-End Developer · UX & User Research
        </div>

        {/* Domain — very quiet, hairline color */}
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 13,
            color: '#E3DFD6',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          joliegoldstein.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: frauncesData, weight: 900, style: 'normal' },
        { name: 'Inter', data: interData, weight: 400, style: 'normal' },
      ],
    }
  )
}
