import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ADMIN_EMAIL, CALL_NUMBER, SITE_URL } from '@/lib/constants'
import { getServerEnv } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(getServerEnv().resendApiKey)
    const { name, email, phone, equipment, start_date, end_date, message } = (await request.json()) as {
      name?: string
      email?: string
      phone?: string
      equipment?: string
      start_date?: string
      end_date?: string
      message?: string
    }
    if (!name || !email || !equipment) {
      return NextResponse.json({ error: 'Name, email, and equipment are required' }, { status: 400 })
    }

    // ── 1. Admin notification email ──
    await resend.emails.send({
      from: 'ConstructRent <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `🏗️ New Quote Request: ${equipment}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

                <!-- Header -->
                <tr>
                  <td style="background:#0a1628;padding:32px 40px">
                    <table width="100%">
                      <tr>
                        <td>
                          <div style="display:inline-block;background:#eab308;border-radius:8px;padding:8px 12px;margin-bottom:16px">
                            <span style="color:#0a1628;font-weight:900;font-size:14px">🏗️ CR</span>
                          </div>
                          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900">New Quote Request</h1>
                          <p style="margin:8px 0 0;color:#9ca3af;font-size:14px">Someone wants to rent equipment</p>
                        </td>
                        <td align="right" valign="top">
                          <span style="background:#eab308;color:#0a1628;font-weight:900;font-size:12px;padding:6px 14px;border-radius:999px">ACTION REQUIRED</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Equipment highlight -->
                <tr>
                  <td style="background:#fefce8;border-bottom:2px solid #eab308;padding:20px 40px">
                    <p style="margin:0;color:#92400e;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Equipment Requested</p>
                    <p style="margin:4px 0 0;color:#0a1628;font-size:20px;font-weight:900">${equipment}</p>
                  </td>
                </tr>

                <!-- Customer details -->
                <tr>
                  <td style="padding:32px 40px">
                    <p style="margin:0 0 20px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Customer Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${[
                        ['👤 Name', name],
                        ['✉️ Email', email],
                        ['📞 Phone', phone || 'Not provided'],
                        ['📅 Start Date', start_date || 'Not specified'],
                        ['📅 End Date', end_date || 'Not specified'],
                        ['💬 Notes', message || 'None'],
                      ].map(([label, value], i) => `
                        <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'}">
                          <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#374151;width:140px;border-radius:8px 0 0 8px">${label}</td>
                          <td style="padding:12px 16px;font-size:13px;color:#111827;border-radius:0 8px 8px 0">${value}</td>
                        </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding:0 40px 32px">
                    <a href="${SITE_URL}/admin/bookings"
                      style="display:inline-block;background:#eab308;color:#0a1628;font-weight:900;font-size:15px;padding:14px 28px;border-radius:12px;text-decoration:none">
                      View in Admin Panel →
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px">
                    <p style="margin:0;color:#9ca3af;font-size:12px">ConstructRent · Mumbai, Maharashtra · Reply to this email to contact the customer directly at ${email}</p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `
    })

    // ── 2. Customer confirmation email ──
    if (email) {
      await resend.emails.send({
        from: 'ConstructRent <onboarding@resend.dev>',
        to: [email],
        subject: `✅ Quote Request Received — ${equipment}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
              <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

                  <!-- Header -->
                  <tr>
                    <td style="background:#0a1628;padding:40px;text-align:center">
                      <div style="display:inline-block;background:#eab308;border-radius:10px;padding:10px 16px;margin-bottom:20px">
                        <span style="color:#0a1628;font-weight:900;font-size:16px">🏗️ ConstructRent</span>
                      </div>
                      <div style="width:64px;height:64px;background:#22c55e;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center">
                        <span style="font-size:28px">✅</span>
                      </div>
                      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900">Quote Request Received!</h1>
                      <p style="margin:10px 0 0;color:#9ca3af;font-size:15px">We'll get back to you within 2 hours</p>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding:32px 40px 0">
                      <p style="margin:0;color:#111827;font-size:16px">Hi <strong>${name}</strong>,</p>
                      <p style="margin:12px 0 0;color:#6b7280;font-size:15px;line-height:1.6">
                        Thank you for your quote request! We've received your inquiry for <strong style="color:#0a1628">${equipment}</strong> and our team will review it shortly.
                      </p>
                    </td>
                  </tr>

                  <!-- Summary box -->
                  <tr>
                    <td style="padding:24px 40px">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                        <tr>
                          <td style="background:#0a1628;padding:14px 20px">
                            <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Your Request Summary</p>
                          </td>
                        </tr>
                        ${[
                          ['Equipment', equipment],
                          ['Rental Period', start_date && end_date ? `${start_date} → ${end_date}` : 'To be confirmed'],
                          ['Your Phone', phone || 'Not provided'],
                          ['Notes', message || 'None'],
                        ].map(([label, value], i) => `
                          <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9fafb'}">
                            <td style="padding:11px 20px;font-size:13px;font-weight:600;color:#6b7280;width:140px">${label}</td>
                            <td style="padding:11px 20px;font-size:13px;color:#111827">${value}</td>
                          </tr>
                        `).join('')}
                      </table>
                    </td>
                  </tr>

                  <!-- What happens next -->
                  <tr>
                    <td style="padding:0 40px 32px">
                      <p style="margin:0 0 16px;color:#111827;font-size:14px;font-weight:700">What happens next?</p>
                      ${[
                        ['⚡', 'Our team reviews your request within 2 hours'],
                        ['📞', 'We call or email you with pricing and availability'],
                        ['✅', 'Confirm your booking and we arrange delivery to your site'],
                      ].map(([icon, text]) => `
                        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
                          <span style="font-size:18px;flex-shrink:0">${icon}</span>
                          <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.5">${text}</p>
                        </div>
                      `).join('')}
                    </td>
                  </tr>

                  <!-- CTA -->
                  <tr>
                    <td style="padding:0 40px 32px;text-align:center">
                      <a href="${SITE_URL}/catalog"
                        style="display:inline-block;background:#eab308;color:#0a1628;font-weight:900;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none">
                        Browse More Equipment →
                      </a>
                    </td>
                  </tr>

                  <!-- Contact -->
                  <tr>
                    <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center">
                      <p style="margin:0 0 8px;color:#374151;font-size:13px;font-weight:600">Need urgent help?</p>
                      <p style="margin:0;color:#9ca3af;font-size:13px">📞 ${CALL_NUMBER} · ✉️ ${ADMIN_EMAIL}</p>
                      <p style="margin:16px 0 0;color:#d1d5db;font-size:11px">© 2026 ConstructRent · Mumbai, Maharashtra</p>
                    </td>
                  </tr>

                </table>
              </td></tr>
            </table>
          </body>
          </html>
        `
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}