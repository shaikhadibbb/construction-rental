import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { bookingConfirmationEmail } from '@/lib/emails/bookingConfirmation'
import { getServerEnv } from '@/lib/env'

interface SendEmailPayload {
  to: string
  userName: string
  equipmentName: string
  startDate: string
  endDate: string
  totalAmount: number
  days: number
  bookingId: string
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(getServerEnv().resendApiKey)
    const body = (await request.json()) as Partial<SendEmailPayload>
    const { to, userName, equipmentName, startDate, endDate, totalAmount, days, bookingId } = body
    if (!to || !userName || !equipmentName || !startDate || !endDate || !bookingId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const html = bookingConfirmationEmail({
      userName,
      equipmentName,
      startDate,
      endDate,
      totalAmount: Number(totalAmount || 0),
      days: Number(days || 0),
      bookingId,
    })

    const { data, error } = await resend.emails.send({
      from: 'ConstructRent <onboarding@resend.dev>',
      to: [to],
      subject: 'Booking Confirmed — ' + equipmentName,
      html,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
