const Stripe = require("stripe");

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Ici tu "récupères la commande"
      // -> tu peux la voir dans Stripe, et/ou la forward vers un webhook Make/Zapier si tu veux
      const order = {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email || null,
        customer_name: session.customer_details?.name || null,
        metadata: session.metadata || {},
        created: session.created,
      };

      console.log("✅ NEW ORDER:", JSON.stringify(order, null, 2));

      // Option: forward vers un outil (Make / Zapier / webhook.site)
      if (process.env.ORDER_WEBHOOK_URL) {
        await fetch(process.env.ORDER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Webhook handler failed.");
  }
};