const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {

  try {

    const data = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Covenant Payment",
            },
            unit_amount: data.amount * 100
          },
          quantity: 1
        }
      ],

      mode: "payment",

      customer_email: data.email,

      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/cancel.html`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: error.toString()
    };

  }

};