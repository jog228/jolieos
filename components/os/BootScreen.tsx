'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const BOOT_LOG = [
  'Loading curiosity.sys',
  'Mounting /projects',
  'Indexing user research notes',
  'Calibrating empathy drivers',
  'Starting desktop',
]

const DURATION = 1900 // ms

// Shown once per browser session. An inline script in layout.tsx sets
// html[data-booted] before paint for returning visitors, and CSS hides
// .boot-screen in that case, so there's no flash.
export function BootScreen({ onDone }: { onDone: () => void }) {
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const total = reduceMotion ? 500 : DURATION
    const per = total / BOOT_LOG.length
    const timers = BOOT_LOG.map((_, i) => setTimeout(() => setStep(i + 1), per * (i + 1)))
    const done = setTimeout(onDone, total + 250)

    // Any key or click skips
    const skip = () => onDone()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone, reduceMotion])

  const pct = Math.round((step / BOOT_LOG.length) * 100)

  return (
    <motion.div
      className="boot-screen fixed inset-0 z-[9000] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#3a3a3e_0%,#111113_75%)] text-white"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4 }}
      role="status"
      aria-live="polite"
      aria-label="JolieOS is starting"
    >
      <div className="w-[min(300px,80vw)] text-center">
        <p className="font-mono text-[56px] font-bold lowercase leading-none tracking-tight [text-shadow:0_0_40px_rgba(180,155,255,.45)]">
          jolie
        </p>
        <p className="mt-3 font-aqua text-[12px] text-white/55">JolieOS · Version 2026.10</p>

        {/* Aqua progress bar */}
        <div
          className="mt-9 h-[13px] overflow-hidden rounded-full bg-gradient-to-b from-[#2b2b2e] to-[#4a4a4e] shadow-[inset_0_1px_3px_rgba(0,0,0,.6),0_1px_0_rgba(255,255,255,.12)]"
          aria-hidden
        >
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{
              width: `${pct}%`,
              background:
                'repeating-linear-gradient(-45deg, rgba(255,255,255,.18) 0 6px, transparent 6px 12px), linear-gradient(#d2c4ff 0%, #9273f2 49%, #7048e8 51%, #a58bff 100%)',
            }}
          />
        </div>

        <p className="mt-3 h-4 font-aqua text-[12px] text-white/60">{BOOT_LOG[Math.max(0, step - 1)]}…</p>
        <p className="mt-6 font-aqua text-[11px] text-white/35">Press any key to skip</p>
      </div>
    </motion.div>
  )
}
