import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { bookingConfirmationEmail } from '@/lib/emails/bookingConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, userName, equipmentName, startDate, endDate, totalAmount, days, bookingId } = body

    const html = bookingConfirmationEmail({
      userName,
      equipmentName,
      startDate,
      endDate,
      totalAmount,
      days,
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
