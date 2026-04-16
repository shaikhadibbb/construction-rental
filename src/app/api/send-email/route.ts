import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getServerEnv } from '@/lib/env'
import { createActionClient } from '@/lib/supabase-server'

/** Sanitize user input before embedding in HTML to prevent XSS */
function esc(str: string | undefined | null): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 1000)
}

export async function POST(request: NextRequest) {
  try {
    // ── Auth guard: only authenticated users can trigger booking emails ──
    const supabase = await createActionClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Payload size guard ──────────────────────────────────────────
    const contentLength = Number(request.headers.get('content-length') ?? '0')
    if (contentLength > 5_000) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }

    const resend = new Resend(getServerEnv().resendApiKey)
    const body = (await request.json()) as Partial<{
      to: string; userName: string; equipmentName: string
      startDate: string; endDate: string; totalAmount: number
      days: number; bookingId: string
    }>

    const { to, userName, equipmentName, startDate, endDate, bookingId } = body
    if (!to || !userName || !equipmentName || !startDate || !endDate || !bookingId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // ── Verify the bookingId actually belongs to this user ──────────
    const { data: booking } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // ── Sanitize ────────────────────────────────────────────────────
    const safeUserName = esc(userName)
    const safeEquipmentName = esc(equipmentName)
    const safeStartDate = esc(startDate)
    const safeEndDate = esc(endDate)
    const totalAmount = Math.max(0, Number(body.totalAmount || 0))
    const days = Math.max(1, Number(body.days || 1))

    const { bookingConfirmationEmail } = await import('@/lib/emails/bookingConfirmation')
    const html = bookingConfirmationEmail({
      userName: safeUserName,
      equipmentName: safeEquipmentName,
      startDate: safeStartDate,
      endDate: safeEndDate,
      totalAmount,
      days,
      bookingId: esc(bookingId),
    })

    const { data, error } = await resend.emails.send({
      from: `ConstructRent <${getServerEnv().resendFromEmail}>`,
      to: [to],
      subject: `Booking Confirmed — ${safeEquipmentName}`,
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
