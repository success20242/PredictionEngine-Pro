const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET);

router.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Football Prediction Pro"
          },
          unit_amount: 999
        },
        quantity: 1
      }
    ],
    success_url: "https://yourapp.com/dashboard",
    cancel_url: "https://yourapp.com/"
  });

  res.json({ url: session.url });
});

module.exports = router;
