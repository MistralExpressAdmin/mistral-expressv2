const Stripe = require("stripe");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).send("Cart is empty.");
    }

    // Sécurité minimale: valide le format
    const safeItems = items
      .map((x) => ({
        id: String(x.id || ""),
        name: String(x.name || ""),
        qty: Number(x.qty || 0),
        price: Number(x.price || 0),
      }))
      .filter((x) => x.id && x.name && x.qty > 0 && Number.isFinite(x.price) && x.price > 0);

    if (safeItems.length === 0) {
      return res.status(400).send("No valid items (check prices/qty).");
    }

    const origin =
      process.env.SITE_URL ||
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://${req.headers.host}` : `https://${req.headers.host}`);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: safeItems.map((it) => ({
        quantity: it.qty,
        price_data: {
          currency: "eur",
          product_data: {
            name: it.name,
          },
          // Stripe attend des centimes
          unit_amount: Math.round(it.price * 100),
        },
      })),
      success_url: `${origin}/carte.html?success=1`,
      cancel_url: `${origin}/carte.html?canceled=1`,
      metadata: {
        order_source: "mistral-express",
        order_items: JSON.stringify(
          safeItems.map((x) => ({ id: x.id, name: x.name, qty: x.qty, price: x.price }))
        ),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message || "Server error");
  }
};