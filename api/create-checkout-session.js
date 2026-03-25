const Stripe = require("stripe");

module.exports = async (req, res) => {
  // Autoriser uniquement POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // 🔐 Stripe en LIVE via variable Vercel
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    // 📦 Lecture du panier
    const { items } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    // 🔒 Sécurisation des données
    const safeItems = items
      .map((x) => ({
        id: String(x.id || ""),
        name: String(x.name || ""),
        qty: Number(x.qty || 0),
        price: Number(x.price || 0),
      }))
      .filter(
        (x) =>
          x.id &&
          x.name &&
          x.qty > 0 &&
          Number.isFinite(x.price) &&
          x.price > 0
      );

    if (safeItems.length === 0) {
      return res.status(400).json({ error: "No valid items." });
    }

    // 🌐 URL dynamique (Vercel friendly)
    const origin =
      process.env.SITE_URL ||
      `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`;

    // 💳 Création session Stripe
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
          unit_amount: Math.round(it.price * 100),
        },
      })),

      success_url: `${origin}/success.html`,
      cancel_url: `${origin}/carte.html?canceled=1`,

      // 🔥 UX améliorée
      billing_address_collection: "auto",
      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        source: "mistral-express",
        items: JSON.stringify(safeItems),
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({
      error: "Payment session failed",
      message: err.message,
    });
  }
};