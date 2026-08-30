import Stripe from "stripe";
import { PLANS } from "./plans.mjs";
import { upsertUser } from "./db.mjs";

export async function handleStripeWebhook(req, res, secret, hookSecret) {
  if (!secret || !hookSecret) {
    res.status(501).json({ ok: false, code: "webhook_not_configured" });
    return;
  }
  const stripe = new Stripe(secret);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
    event = stripe.webhooks.constructEvent(raw, sig, hookSecret);
  } catch (err) {
    res.status(400).json({ ok: false, code: "bad_signature" });
    return;
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = String((session.customer_details && session.customer_details.email) || session.customer_email || "").toLowerCase();
    const plan = (session.metadata && session.metadata.plan) || "pro";
    if (email && PLANS[plan] && plan !== "free") {
      upsertUser(email, plan, { customer: session.customer, sub: session.subscription });
    }
  }
  res.json({ ok: true });
}
