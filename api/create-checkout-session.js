const Stripe = require("stripe");

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { items } = req.body;

  try {

    const line_items = items.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.qty
    }));


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items,

      success_url: `${process.env.SITE_URL}/merci.html`,
      cancel_url: `${process.env.SITE_URL}/carte.html`
    });

    res.status(200).json({ url: session.url });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Stripe error" });

  }

};