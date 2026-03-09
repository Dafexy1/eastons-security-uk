const Stripe = require('stripe');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ── Email transporter (Gmail App Password) ────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// ── Google Sheets logger ──────────────────────────────────────────
async function logToSheet(booking, sessionId) {
  try {
    if (!process.env.GOOGLE_SHEET_ID ||
        !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
        !process.env.GOOGLE_PRIVATE_KEY) {
      console.log('[sheets] env vars missing — skipping sheet log');
      return;
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key:   process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.GOOGLE_SHEET_ID;

    const now = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    const ref = 'ET' +
      new Date().toISOString().slice(2,10).replace(/-/g,'') +
      Math.random().toString(36).slice(2,6).toUpperCase();

    const row = [
      ref,
      now,
      booking.customer.firstName,
      booking.customer.lastName,
      booking.customer.email,
      booking.customer.phone,
      booking.course,
      booking.date,
      booking.duration,
      booking.location,
      `£${booking.price}`,
      'STRIPE CHECKOUT',
      sessionId,
      booking.customer.notes || '',
      'PENDING PAYMENT'
    ];

    // Write headers if sheet is empty
    const check = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1'
    }).catch(() => null);

    if (!check || !check.data.values) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'Ref','Date/Time','First Name','Last Name','Email','Phone',
            'Course','Course Date','Duration','Location',
            'Amount','Pay Method','Session ID','Notes','Status'
          ]]
        }
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] }
    });

    console.log('[sheets] logged row:', ref);
  } catch (err) {
    // Non-fatal — don't block payment
    console.error('[sheets] error:', err.message);
  }
}

// ── Confirmation email to student ─────────────────────────────────
async function sendConfirmationEmail(booking) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('[email] env vars missing — skipping email');
      return;
    }

    const transporter = getTransporter();

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" style="padding:32px 16px;"><tr><td align="center">
<table width="580" style="background:#fff;max-width:580px;">

  <tr><td style="background:#1a1a1a;padding:24px 32px;border-top:4px solid #c0392b;">
    <p style="margin:0;font-size:22px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.04em;">Easton's Training</p>
    <p style="margin:4px 0 0;font-size:11px;color:#c0392b;letter-spacing:0.2em;text-transform:uppercase;">Professional Security Training</p>
  </td></tr>

  <tr><td style="background:#c0392b;padding:16px 32px;">
    <p style="margin:0;font-size:16px;font-weight:700;color:#fff;text-transform:uppercase;">Booking Received — Awaiting Payment Confirmation</p>
  </td></tr>

  <tr><td style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;">Dear ${booking.customer.firstName},</p>
    <p style="font-size:14px;color:#555;line-height:1.75;">
      Thank you for your booking request. Once Stripe confirms your payment, 
      you will receive a full confirmation email. Your details are below.
    </p>

    <table width="100%" style="border:1px solid #e0e0e0;border-top:3px solid #c0392b;margin:20px 0;border-collapse:collapse;">
      <tr style="background:#f4f4f4;">
        <td colspan="2" style="padding:10px 16px;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#555;">Booking Summary</td>
      </tr>
      <tr>
        <td style="padding:9px 16px;font-size:13px;font-weight:700;color:#777;width:140px;border-bottom:1px solid #eee;">Course</td>
        <td style="padding:9px 16px;font-size:14px;border-bottom:1px solid #eee;">${booking.course}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:9px 16px;font-size:13px;font-weight:700;color:#777;border-bottom:1px solid #eee;">Date</td>
        <td style="padding:9px 16px;font-size:14px;border-bottom:1px solid #eee;">${booking.date}</td>
      </tr>
      <tr>
        <td style="padding:9px 16px;font-size:13px;font-weight:700;color:#777;border-bottom:1px solid #eee;">Duration</td>
        <td style="padding:9px 16px;font-size:14px;border-bottom:1px solid #eee;">${booking.duration}</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:9px 16px;font-size:13px;font-weight:700;color:#777;border-bottom:1px solid #eee;">Location</td>
        <td style="padding:9px 16px;font-size:14px;border-bottom:1px solid #eee;">${booking.location}</td>
      </tr>
      <tr>
        <td style="padding:9px 16px;font-size:13px;font-weight:700;color:#777;">Amount</td>
        <td style="padding:9px 16px;font-size:15px;font-weight:700;color:#c0392b;">£${booking.price}</td>
      </tr>
    </table>

    <p style="font-size:14px;color:#555;">
      Questions? Call <a href="tel:+447340376225" style="color:#c0392b;">+44(0)7340 376225</a> 
      or email <a href="mailto:${process.env.EMAIL_USER}" style="color:#c0392b;">${process.env.EMAIL_USER}</a>
    </p>
  </td></tr>

  <tr><td style="background:#1a1a1a;padding:16px 32px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#666;">Easton's Training &nbsp;|&nbsp; Unit 8, Dewar House, Dunfermline</p>
  </td></tr>

</table></td></tr></table>
</body>
</html>`;

    await transporter.sendMail({
      from:    `"Easton's Training" <${process.env.EMAIL_USER}>`,
      to:      booking.customer.email,
      subject: `Booking Received: ${booking.course} — ${booking.date}`,
      html
    });

    // Notify admin too
    await transporter.sendMail({
      from:    `"Easton's Training Site" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_USER,
      subject: `NEW BOOKING: ${booking.course} — ${booking.customer.firstName} ${booking.customer.lastName}`,
      text: `
New booking received:

Course:   ${booking.course}
Date:     ${booking.date}
Duration: ${booking.duration}
Price:    £${booking.price}

Customer:
  Name:  ${booking.customer.firstName} ${booking.customer.lastName}
  Email: ${booking.customer.email}
  Phone: ${booking.customer.phone}
  Notes: ${booking.customer.notes || 'none'}

Status: PENDING STRIPE PAYMENT
      `.trim()
    });

    console.log('[email] sent to', booking.customer.email);
  } catch (err) {
    console.error('[email] error:', err.message);
  }
}

// ── Main handler ──────────────────────────────────────────────────
exports.handler = async (event) => {

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Parse body
  let booking;
  try {
    booking = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  // Validate required fields
  const { course, price, date, duration, location, customer } = booking;
  if (!course || !price || !customer?.email || !customer?.firstName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: course, price, customer.email, customer.firstName' })
    };
  }

  // Determine site URL (works locally + on Netlify)
  const siteUrl = process.env.URL ||
                  process.env.DEPLOY_URL ||
                  'http://localhost:8888';

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      line_items: [{
        price_data: {
          currency:    'gbp',
          unit_amount: Math.round(price * 100), // convert £ to pence
          product_data: {
            name:        course,
            description: `${date} • ${duration} • ${location}`
          }
        },
        quantity: 1
      }],

      customer_email: customer.email,

      metadata: {
        courseKey:  booking.courseKey || '',
        course,
        date:       date       || '',
        duration:   duration   || '',
        location:   location   || '',
        firstName:  customer.firstName,
        lastName:   customer.lastName  || '',
        phone:      customer.phone     || '',
        notes:      customer.notes     || ''
      },

      success_url: `${siteUrl}/?booking=success&email=${encodeURIComponent(customer.email)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${siteUrl}/?booking=cancel`,

      locale:      'en-GB',
      submit_type: 'pay'
    });

    console.log('[checkout] session created:', session.id);

    // Fire-and-forget: log + email (don't await — don't delay the redirect)
    logToSheet(booking, session.id).catch(console.error);
    sendConfirmationEmail(booking).catch(console.error);

    return {
      statusCode: 200,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    console.error('[checkout] Stripe error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};