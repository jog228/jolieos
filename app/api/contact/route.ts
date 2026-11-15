// Contact form endpoint: forwards a visitor's message to my inbox via Resend.
// Needs RESEND_API_KEY. Optional: CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.

import { profile } from '@/lib/content'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function bad(error: string, status = 400) {
  return Response.json({ error }, { status })
}

export async function POST(req: Request) {
  let data: Record<string, unknown>
  try {
    data = await req.json()
  } catch {
    return bad('Invalid request.')
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const email = str(data.email)
  const subject = str(data.subject).replace(/[\r\n]+/g, ' ')
  const message = str(data.message)

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (str(data.website)) return Response.json({ ok: true })

  if (!EMAIL_RE.test(email) || email.length > 254) return bad('Please enter a valid email address.')
  if (!message) return bad('Please write a message.')
  if (message.length > 5000) return bad('That message is too long (5,000 characters max).')
  if (subject.length > 200) return bad('That subject is too long.')

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY is not set')
    return bad('Email is not set up yet. Please copy my address instead.', 500)
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // onboarding@resend.dev works without a verified domain, but can only
      // deliver to the address the Resend account was created with.
      from: process.env.CONTACT_FROM_EMAIL || 'JolieOS Mail <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL || profile.email],
      reply_to: email,
      subject: subject || 'New message from your portfolio',
      text: `From: ${email}\n\n${message}`,
    }),
  }).catch(err => {
    console.error('contact: network error', err)
    return null
  })

  if (!res || !res.ok) {
    if (res) console.error('contact: Resend error', res.status, await res.text())
    return bad('Something went wrong sending that. Please copy my address instead.', 502)
  }

  return Response.json({ ok: true })
}
