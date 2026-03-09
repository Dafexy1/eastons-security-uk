const Stripe     = require('stripe');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { google } = require('googleapis');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

// Build PDF in memory — returns a Buffer
function buildPDF(session) {
  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data',  chunk => chunks.push(chunk));
    doc.on('end',   ()    => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const meta = session.metadata || {};
    const ref  = 'ET' + new Date().toISOString().slice(2,10).replace(/-/g,'') +
                 Math.random().toString(36).slice(2,6).toUpperCase();

    // ── Header bar ───────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 80).fill('#1a1a1a');
    doc.rect(0, 80, doc.page.width, 6).fill('#c0392b');

    doc.fillColor('#ffffff')
       .font('Helvetica-Bold').fontSize(22)
       .text("EASTON'S TRAINING", 50, 22);
    doc.fillColor('#c0392b').font('Helvetica').fontSize(10)
       .text('Professional Security Training — Dunfermline, Scotland', 50, 50);

    // ── Title ────────────────────────────────────────────────────
    doc.moveDown(3);
    doc.fillColor('#1a1a1a').font('Helvetica-Bold').fontSize(18)
       .text('BOOKING CONFIRMATION & RECEIPT', { align: 'center' });
    doc.moveDown(0.4);
    doc.fillColor('#c0392b').font('Helvetica').fontSize(11)
       .text(`Booking Reference: ${ref}`, { align: 'center' });

    // ── Section: Personal Details ────────────────────────────────
    doc.moveDown(1.5);
    sectionHeader(doc, 'PERSONAL DETAILS');
    tableRow(doc, 'Full Name',  `${meta.firstName || ''} ${meta.lastName || ''}`.trim());
    tableRow(doc, 'Email',       session.customer_email || '');
    tableRow(doc, 'Phone',       meta.phone || '—');
    tableRow(doc, 'Notes',       meta.notes || '—');

    // ── Section: Course Details ──────────────────────────────────
    doc.moveDown(0.8);
    sectionHeader(doc, 'COURSE DETAILS');
    tableRow(doc, 'Course',      meta.course    || '—');
    tableRow(doc, 'Date',        meta.date      || '—');
    tableRow(doc, 'Duration',    meta.duration  || '—');
    tableRow(doc, 'Location',    meta.location  || '—');

    // ── Section: Payment ─────────────────────────────────────────
    doc.moveDown(0.8);
    sectionHeader(doc, 'PAYMENT');
    tableRow(doc, 'Amount Paid', `£${(session.amount_total / 100).toFixed(2)}`);
    tableRow(doc, 'Currency',    (session.currency || 'gbp').toUpperCase());
    tableRow(doc, 'Payment ID',  session.payment_intent || '—');
    tableRow(doc, 'Status',      'PAID ✓');
    tableRow(doc, 'Date',        new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' }));

    // ── Declaration ──────────────────────────────────────────────
    doc.moveDown(1.5);
    doc.rect(50, doc.y, doc.page.width - 100, 80)
       .stroke('#e0e0e0');
    doc.fillColor('#555555').font('Helvetica').fontSize(9)
       .text(
         'By completing this booking you confirm that all information provided is accurate, ' +
         'that you meet any entry requirements for the course, and that you agree to ' +
         "Easton's Training terms and conditions. A full refund is available if cancelled " +
         'more than 14 days before the course start date.',
         62, doc.y + 8, { width: doc.page.width - 124, lineGap: 3 }
       );

    // ── Footer ───────────────────────────────────────────────────
    doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill('#1a1a1a');
    doc.fillColor('#888888').font('Helvetica').fontSize(9)
       .text(
         `Easton's Training Ltd  |  Unit 8, Dewar House, Dunfermline  |  +44(0)7340 376225  |  ${process.env.EMAIL_USER || 'info@eastonstraining.com'}`,
         50, doc.page.height - 32, { align: 'center', width: doc.page.width - 100 }
       );

    doc.end();
  });
}

function sectionHeader(doc, title) {
  doc.rect(50, doc.y, doc.page.width - 100, 24).fill('#1a1a1a');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
     .text(title, 62, doc.y - 18);
  doc.moveDown(0.2);
}

function tableRow(doc, label, value) {
  const y = doc.y;
  doc.rect(50, y, doc.page.width - 100, 22).stroke('#e8e8e8');
  doc.fillColor('#777777').font('Helvetica-Bold').fontSize(9)
     .text(label, 62, y + 6, { width: 120 });
  doc.fillColor('#222222').font('Helvetica').fontSize(9)
     .text(String(value), 190, y + 6, { width: doc.page.width - 250 });
  doc.y = y + 22;
}

// ── Update Google Sheet row status to PAID ────────────────────────
async function markSheetPaid(sessionId) {
  try {
    if (!process.env.GOOGLE_SHEET_ID ||
        !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
        !process.env.GOOGLE_PRIVATE_KEY) return;

    const auth = new google.auth.JWT({
      email:  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key:    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const sheets  = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.GOOGLE_SHEET_ID;

    // Find the row with this session ID (column M = index 12)
    const rows = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:O'
    });

    const values = rows.data.values || [];
    const rowIndex = values.findIndex(r => r[12] === sessionId);

    if (rowIndex > -1) {
      // Update Status column (O = column 15, index 14)
      await sheets.spreadsheets.values.update({
        spreadsheetId:   sheetId,
        range:           `Sheet1!O${rowIndex + 1}`,
        valueInputOption: 'RAW',
        requestBody:     { values: [['PAID']] }
      });
      console.log('[sheets] marked PAID, row', rowIndex + 1);
    }
  } catch (err) {
    console.error('[sheets] markPaid error:', err.message);
  }
}

// ── Send completion email with PDF attachment ─────────────────────
async function sendCompletionEmail(session, pdfBuffer) {
  const meta      = session.metadata || {};
  const firstName = meta.firstName   || 'Student';
  const email     = session.customer_email;
  const course    = meta.course      || 'your course';
  const date      = meta.date        || '';
  const amount    = (session.amount_total / 100).toFixed(2);

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" style="padding:32px 16px;"><tr><td align="center">
<table width="580" style="background:#fff;max-width:580px;">

  <tr><td style="background:#1a1a1a;padding:24px 32px;border-top:4px solid #c0392b;">
    <p style="margin:0;font-size:22px;font-weight:700;color:#fff;text-transform:uppercase;">Easton's Training</p>
    <p style="margin:4px 0 0;font-size:11px;color:#c0392b;letter-spacing:0.2em;text-transform:uppercase;">Professional Security Training</p>
  </td></tr>

  <tr><td style="background:#27ae60;padding:16px 32px;">
    <p style="margin:0;font-size:16px;font-weight:700;color:#fff;text-transform:uppercase;">✓ Payment Confirmed — You're Booked!</p>
  </td></tr>

  <tr><td style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;">Dear ${firstName},</p>
    <p style="font-size:14px;color:#555;line-height:1.75;">
      Your payment of <strong>£${amount}</strong> has been confirmed. 
      Your booking for <strong>${course}</strong> on <strong>${date}</strong> is now secured.
      Please find your official booking confirmation and receipt attached as a PDF.
    </p>

    <table width="100%" style="border:1px solid #e0e0e0;border-top:3px solid #27ae60;margin:20px 0;border-collapse:collapse;">
      <tr style="background:#f4f4f4;">
        <td colspan="2" style="padding:10px 16px;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#555;">What Happens Next</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #eee;vertical-align:top;width:28px;">1.</td>
        <td style="padding:10px 16px;font-size:14px;border-bottom:1px solid #eee;">Our team will contact you within 2 working days with your pre-course information pack.</td>
      </tr>
      <tr style="background:#fafafa;">
        <td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #eee;vertical-align:top;">2.</td>
        <td style="padding:10px 16px;font-size:14px;border-bottom:1px solid #eee;">Please bring a valid form of ID on the first day of your course.</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;vertical-align:top;">3.</td>
        <td style="padding:10px 16px;font-size:14px;">Save this email and the attached PDF as your receipt and proof of booking.</td>
      </tr>
    </table>

    <p style="font-size:14px;color:#555;">
      Questions? Call <a href="tel:+447340376225" style="color:#c0392b;">+44(0)7340 376225</a> 
      or reply to this email.
    </p>
  </td></tr>

  <tr><td style="background:#1a1a1a;padding:16px 32px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#666;">Easton's Training &nbsp;|&nbsp; Unit 8, Dewar House, Dunfermline</p>
  </td></tr>

</table></td></tr></table>
</body>
</html>`;

  const transporter = getTransporter();

  // Email to student
  await transporter.sendMail({
    from:        `"Easton's Training" <${process.env.EMAIL_USER}>`,
    to:          email,
    subject:     `Booking Confirmed: ${course} — ${date}`,
    html,
    attachments: [{
      filename:    `EastonsTraining_Booking_${course.replace(/\s+/g,'_')}.pdf`,
      content:     pdfBuffer,
      contentType: 'application/pdf'
    }]
  });

  // Notify admin
  await transporter.sendMail({
    from:    `"Easton's Training Site" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_USER,
    subject: `PAYMENT CONFIRMED: ${course} — ${meta.firstName} ${meta.lastName}`,
    text: `
Payment confirmed via Stripe.

Course:     ${course}
Date:       ${date}
Duration:   ${meta.duration  || '—'}
Location:   ${meta.location  || '—'}
Amount:     £${amount}
Payment ID: ${session.payment_intent}

Customer:
  Name:     ${meta.firstName} ${meta.lastName}
  Email:    ${email}
  Phone:    ${meta.phone  || '—'}
  Notes:    ${meta.notes  || '—'}
    `.trim()
  });

  console.log('[email] completion email sent to', email);
}

// ─────────────────────────────────────────────────────────────────
//  MAIN WEBHOOK HANDLER
// ─────────────────────────────────────────────────────────────────
exports.handler = async (event) => {

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[webhook] signature error:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  console.log('[webhook] event received:', stripeEvent.type);

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    console.log('[webhook] session:', session.id, '| paid:', session.payment_status);

    if (session.payment_status === 'paid') {
      try {
        // Build PDF, update sheet, send email — all in parallel
        const [pdfBuffer] = await Promise.all([
          buildPDF(session),
          markSheetPaid(session.id)
        ]);
        await sendCompletionEmail(session, pdfBuffer);
      } catch (err) {
        console.error('[webhook] processing error:', err.message);
        // Still return 200 so Stripe doesn't retry endlessly
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};
