const Stripe = require("stripe");
const { savePayment } = require("./googleSheets");
const { sendReceipt } = require("./sendEmail");
const { createPDF } = require("./generatePDF");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {

  const sig = event.headers["stripe-signature"];

  let stripeEvent;

  try {

    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };

  }

  if (stripeEvent.type === "checkout.session.completed") {

    const session = stripeEvent.data.object;

    const email = session.customer_email;
    const amount = session.amount_total / 100;
    const paymentId = session.payment_intent;

    await savePayment(email, amount, paymentId);

    const pdfPath = await createPDF(email, amount, paymentId);

    await sendReceipt(email, pdfPath);

  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };

};