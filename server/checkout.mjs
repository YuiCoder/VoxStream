import Stripe from "stripe";
import { priceTable, PLANS } from "./plans.mjs";
import { upsertUser } from "./db.mjs";
import { createSession, sidCookie, mePayload } from "./session.mjs";

const NAMES = { plus: "VoxStream Plus", pro: "VoxStream Pro", ultra: "VoxStream Ultra" };

function stripeClient(secret) {
  return new Stripe(secret);
}

export async function startCheckout(req, res, secret) {
  if (!secret) {
    res.status(501).json({ ok: false, code: "stripe_not_configured" });
    return;
  }
  const want = String((req.body && req.body.plan) || "pro").toLowerCase();
  if (!PLANS[want] || want === "free") {
    res.status(400).json({ ok: false, code: "bad_plan" });
    return;
  }
  const cents = priceTable()[want];
  const origin = "http://localhost:" + (process.env.PORT || 8787);
  try {
    const session = await stripeClient(secret).checkout.sessions.create({
      mode: "subscription",
      success_url: origin + "/v1/checkout/sync?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/?paid=0",
      metadata: { plan: want },
      subscription_data: { metadata: { plan: want } },
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
    res.status(502).json({ ok: false, code: "stripe_error", hint: String(err && err.message || err) });
  }
}

export async function syncCheckout(req, res, secret) {
  const id = String((req.query && req.query.session_id) || (req.body && req.body.session_id) || "").trim();
  if (!secret) {
    res.status(501).json({ ok: false, code: "stripe_not_configured" });
    return;
  }
  if (!id.startsWith("cs_")) {
    res.status(400).json({ ok: false, code: "bad_session" });
    return;
  }
  try {
    const session = await stripeClient(secret).checkout.sessions.retrieve(id);
    if (session.status !== "complete" && session.payment_status !== "paid") {
      res.status(409).json({ ok: false, code: "not_paid", status: session.status });
      return;
    }
    const email = String(session.customer_details && session.customer_details.email || session.customer_email || "").toLowerCase();
    const plan = (session.metadata && session.metadata.plan) || "pro";
    if (!email) {
      res.status(422).json({ ok: false, code: "no_email" });
      return;
    }
    upsertUser(email, PLANS[plan] ? plan : "pro", {
      customer: session.customer || null,
      sub: session.subscription || null
    });
    const cookie = createSession(email, PLANS[plan] ? plan : "pro");
    res.setHeader("Set-Cookie", sidCookie(cookie.sid));
    res.json(mePayload(cookie));
  } catch (err) {
    res.status(502).json({ ok: false, code: "stripe_error", hint: String(err && err.message || err) });
  }
}
