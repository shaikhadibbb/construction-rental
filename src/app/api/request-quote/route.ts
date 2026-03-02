import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, equipment, start_date, end_date, message } = await request.json()

    await resend.emails.send({
      from: 'ConstructRent Quotes <onboarding@resend.dev>',
      to: ['adibazam123@gmail.com'],
      subject: `New Quote Request: ${equipment}`,
      html: `
        <h2 style="color:#eab308">New Quote Request</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Equipment:</td><td style="padding:8px">${equipment}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Name:</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${email}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Phone:</td><td style="padding:8px">${phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Start Date:</td><td style="padding:8px">${start_date || 'Not specified'}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">End Date:</td><td style="padding:8px">${end_date || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Notes:</td><td style="padding:8px">${message || 'None'}</td></tr>
        </table>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
