const Stripe = require("stripe");

module.exports = async (req, res) => {

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];

  let event;

  try {

    const chunks = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const rawBody = Buffer.concat(chunks);

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {

    console.log("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);

  }

  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    console.log("Nouvelle commande payée ✅");

    console.log("Montant :", session.amount_total / 100, "€");

    console.log("Email client :", session.customer_details?.email);

  }

  res.json({ received: true });

};