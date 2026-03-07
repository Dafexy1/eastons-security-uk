const stripe = Stripe("YOUR_STRIPE_PUBLISHABLE_KEY");

async function startPayment(email, amount) {

  const response = await fetch("/.netlify/functions/create-checkout", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      amount: amount
    })
  });

  const session = await response.json();

  stripe.redirectToCheckout({
    sessionId: session.id
  });

}