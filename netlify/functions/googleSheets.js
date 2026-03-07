const { google } = require("googleapis");

exports.savePayment = async (email, amount, paymentId) => {

  const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials/google-service-account.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:D",
    valueInputOption: "RAW",
    resource: {
      values: [
        [
          email,
          amount,
          paymentId,
          new Date().toISOString()
        ]
      ]
    }
  });

};