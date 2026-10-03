import type { Metadata } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/providers/ThemeProvider'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  // Variable font — weight range 100–900 and custom axes are available via CSS
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://joliegoldstein.com'),
  title: {
    default: 'Jolie Goldstein',
    template: '%s — Jolie Goldstein',
  },
  description:
    'Full-stack developer and UX researcher. I build products end to end and ground the decisions in real user research.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://joliegoldstein.com',
    siteName: 'Jolie Goldstein',
    title: 'JolieOS',
    description: 'Full-stack developer and UX researcher. Explore my work in JolieOS, a portfolio you click around like a desktop.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JolieOS',
    description: 'Full-stack developer and UX researcher. Explore my work in JolieOS, a portfolio you click around like a desktop.',
  },
}

// Runs synchronously before first paint to prevent FOUC
// Also marks returning visitors (same browser session) so the JolieOS boot
// screen is skipped without a flash.
const themeScript = `(function(){var d=document.documentElement;try{var s=localStorage.getItem('theme');d.setAttribute('data-theme',s||'dark')}catch(e){}try{if(sessionStorage.getItem('jolieos-booted'))d.setAttribute('data-booted','')}catch(e){}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Anti-FOUC: set theme before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="h-dvh overflow-hidden">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
