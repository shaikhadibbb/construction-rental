import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ADMIN_EMAIL } from '@/lib/constants'
import { getServerEnv } from '@/lib/env'

/** Sanitize user input before embedding in HTML to prevent XSS */
function esc(str: string | undefined | null): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 2000)
}

export async function POST(request: NextRequest) {
  try {
    // ── Payload size guard ──────────────────────────────────────────
    const contentLength = Number(request.headers.get('content-length') ?? '0')
    if (contentLength > 10_000) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }

    const resend = new Resend(getServerEnv().resendApiKey)
    const raw = (await request.json()) as {
      name?: string; email?: string; subject?: string; message?: string
    }

    if (!raw.name?.trim() || !raw.email?.trim() || !raw.message?.trim()) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    // ── Email format validation ──────────────────────────────────────
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── Sanitize all user-supplied fields ────────────────────────────
    const name = esc(raw.name)
    const email = esc(raw.email)
    const subject = esc(raw.subject) || 'General Enquiry'
    const message = esc(raw.message)

    await resend.emails.send({
      from: `ConstructRent Contact <${getServerEnv().resendFromEmail}>`,
      to: [ADMIN_EMAIL],
      replyTo: raw.email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb;border-radius:12px">
          <h2 style="color:#0a1628">New Contact Form Submission</h2>
          <table style="width:100%;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
            ${[['Name', name], ['Email', email], ['Subject', subject]].map(([label, val], i) => `
              <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'}">
                <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#374151;width:100px">${label}</td>
                <td style="padding:12px 16px;font-size:13px;color:#111827">${val}</td>
              </tr>
            `).join('')}
          </table>
          <div style="margin-top:16px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151">Message:</p>
            <p style="margin:0;font-size:14px;color:#111827;line-height:1.6;white-space:pre-wrap">${message}</p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
