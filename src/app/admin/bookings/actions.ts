'use server'

import { createActionClient } from '@/lib/supabase-server'
import { Resend } from 'resend'
import { getServerEnv } from '@/lib/env'

export async function updateBookingStatus(id: string, newStatus: string) {
  const supabase = await createActionClient()
  
  // 1. Update Booking Status
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single()
    
  if (error || !booking) {
    throw new Error(error?.message || 'Failed to update booking status.')
  }
  
  // 2. State Machine Logic: Dispatch Confirmation Email
  if (newStatus === 'confirmed' && booking.customer_email) {
    try {
      const env = getServerEnv()
      const resend = new Resend(env.resendApiKey)
      
      await resend.emails.send({
        from: `ConstructRent <${env.resendFromEmail}>`,
        to: [booking.customer_email],
        subject: `🎉 Booking Confirmed: ${booking.equipment_name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #f4a261;">Your Booking is Confirmed!</h2>
            <p>Hi ${booking.customer_name || 'there'},</p>
            <p>Great news! Your booking request for the <strong>${booking.equipment_name}</strong> has been officially confirmed by our team.</p>
            <div style="background: #f4f4f5; border-left: 4px solid #f4a261; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <p style="margin:0 0 10px 0;"><strong>Booking Reference:</strong> ${booking.id.split('-')[0]}</p>
              ${booking.start_date ? `<p style="margin:0 0 10px 0;"><strong>Dates:</strong> ${booking.start_date} ${booking.end_date ? `to ${booking.end_date}` : ''}</p>` : ''}
              <p style="margin:0;"><strong>Total Estimate:</strong> ₹${Number(booking.total_amount || 0).toLocaleString('en-IN')}</p>
            </div>
            <p>Our logistics team will contact you shortly at <strong>${booking.customer_phone || 'your phone'}</strong> to arrange delivery and confirm any remaining documents (e.g., GST or site permits).</p>
            <br>
            <p>Best regards,<br>The ConstructRent Team</p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // We don't fail the entire mutation if the email fails.
    }
  }

  return booking
}
