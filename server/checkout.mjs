import Stripe from "stripe";
import { priceTable, PLANS } from "./plans.mjs";

const NAMES = { plus: "VoxStream Plus", pro: "VoxStream Pro", ultra: "VoxStream Ultra" };

export async function startCheckout(req, res, secret) {
  if (!secret) {
    res.status(501).json({
      ok: false,
      code: "stripe_not_configured",
      hint: "STRIPE_SECRET_KEY missing in server/.env"
    });
    return;
  }
  const want = String((req.body && req.body.plan) || "pro").toLowerCase();
  if (!PLANS[want] || want === "free") {
    res.status(400).json({ ok: false, code: "bad_plan" });
    return;
  }
  const cents = priceTable()[want];
  if (!cents) {
    res.status(400).json({ ok: false, code: "no_price" });
    return;
  }
  const stripe = new Stripe(secret);
  const origin = "http://localhost:" + (process.env.PORT || 8787);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: origin + "/?paid=1",
      cancel_url: origin + "/?paid=0",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: cents,
          recurring: { interval: "month" },
          product_data: { name: NAMES[want] || want }
        }
      }]
    });
    res.json({ ok: true, url: session.url, id: session.id, plan: want });
  } catch (err) {
    res.status(502).json({
      ok: false,
      code: "stripe_error",
      hint: String(err && err.message || err)
    });
  }
}
