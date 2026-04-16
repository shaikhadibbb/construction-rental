import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ADMIN_EMAIL } from '@/lib/constants'
import { getServerEnv } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(getServerEnv().resendApiKey)
    const { name, email, subject, message } = (await request.json()) as {
      name?: string
      email?: string
      subject?: string
      message?: string
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    await resend.emails.send({
      from: `ConstructRent Contact <${getServerEnv().resendFromEmail}>`,
      to: [ADMIN_EMAIL],
      subject: 'Contact Form: ' + subject,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
