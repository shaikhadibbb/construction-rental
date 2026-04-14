import { SITE_URL } from '@/lib/constants'

export function bookingConfirmationEmail({
  userName,
  equipmentName,
  startDate,
  endDate,
  totalAmount,
  days,
  bookingId,
}: {
  userName: string
  equipmentName: string
  startDate: string
  endDate: string
  totalAmount: number
  days: number
  bookingId: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1f2937,#78350f);padding:32px;text-align:center;">
      <p style="font-size:32px;margin:0 0 8px;">🏗️</p>
      <h1 style="color:white;margin:0;font-size:24px;font-weight:bold;">ConstructRent</h1>
      <p style="color:#fbbf24;margin:8px 0 0;font-size:14px;">Construction Equipment Rental</p>
    </div>

    <!-- Success banner -->
    <div style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:20px 32px;text-align:center;">
      <p style="font-size:24px;margin:0 0 4px;">✅</p>
      <h2 style="color:#166534;margin:0;font-size:18px;">Booking Confirmed!</h2>
      <p style="color:#16a34a;margin:4px 0 0;font-size:14px;">Your equipment rental is all set</p>
    </div>

    <!-- Content -->
    <div style="padding:32px;">
      <p style="color:#374151;font-size:16px;margin:0 0 24px;">Hi ${userName},</p>
      <p style="color:#374151;font-size:15px;margin:0 0 24px;line-height:1.6;">
        Your booking for <strong>${equipmentName}</strong> has been confirmed. Here are your rental details:
      </p>

      <!-- Booking details card -->
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">Equipment</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${equipmentName}</td>
          </tr>
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">Start Date</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${startDate}</td>
          </tr>
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">End Date</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${endDate}</td>
          </tr>
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:8px 0;color:#6b7280;font-size:14px;">Duration</td>
            <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${days} days</td>
          </tr>
          <tr style="border-top:2px solid #e5e7eb;">
            <td style="padding:12px 0 0;color:#111827;font-size:16px;font-weight:bold;">Total Amount</td>
            <td style="padding:12px 0 0;color:#d97706;font-size:20px;font-weight:bold;text-align:right;">$${totalAmount}</td>
          </tr>
        </table>
      </div>

      <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Booking Reference</p>
      <p style="color:#111827;font-size:13px;font-family:monospace;background:#f3f4f6;padding:8px 12px;border-radius:6px;margin:0 0 24px;">${bookingId}</p>

      <a href="${SITE_URL}/dashboard"
         style="display:block;background:#eab308;color:#111827;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:bold;font-size:15px;">
        View My Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        © 2026 ConstructRent. If you have questions, reply to this email.
      </p>
    </div>

  </div>
</body>
</html>
  `
}
