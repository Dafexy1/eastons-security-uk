const nodemailer = require("nodemailer");

exports.sendReceipt = async (email, pdfPath) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Payment Confirmation",
    text: "Thank you for your payment. Your receipt is attached.",
    attachments: [
      {
        filename: "receipt.pdf",
        path: pdfPath
      }
    ]
  });

};