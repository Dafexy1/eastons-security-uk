const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.createPDF = async (email, amount, paymentId) => {

  const path = `/tmp/receipt-${paymentId}.pdf`;

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(22).text("Payment Receipt");

  doc.moveDown();

  doc.text(`Email: ${email}`);
  doc.text(`Amount Paid: $${amount}`);
  doc.text(`Payment ID: ${paymentId}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.end();

  return path;

};