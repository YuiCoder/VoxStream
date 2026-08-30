import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { PLANS, publicPlans } from "./plans.mjs";
import { readSession, createSession, sidCookie, mePayload } from "./session.mjs";
import { startCheckout, syncCheckout } from "./checkout.mjs";

const PORT = Number(process.env.PORT || 8787);
const ORIGIN = process.env.PUBLIC_ORIGIN || "https://yuicoder.github.io";
const EULER = (process.env.EULER_API_KEY || "").trim();
const STRIPE = (process.env.STRIPE_SECRET_KEY || "").trim();
const STRIPE_WH = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
const MAILER = Boolean((process.env.RESEND_API_KEY || "").trim());

function okEmail(email) {
  const at = email.indexOf("@");
  const dot = email.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < email.length - 1 && !email.includes(" ");
}

const app = express();
app.use(express.json({ limit: "32kb" }));
app.use(cors({
  origin: [ORIGIN, "http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:5500", "http://localhost:8787"],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"]
}));
app.use((req, res, next) => {
  const t0 = Date.now();
  res.on("finish", () => {
    console.log(req.method, req.path, res.statusCode, Date.now() - t0 + "ms");
  });
  next();
});

app.get("/", (_req, res) => {
  res.type("html").send(
    "<!doctype html><meta charset=utf-8><title>VoxStream server</title>" +
    "<body style=\"font-family:sans-serif;background:#09090b;color:#f4f0ff;padding:32px\">" +
    "<h1>VoxStream</h1><p>Local API. Not the public estudio.</p><ul>" +
    "<li><a href=/health style=color:#c9a2ff>GET /health</a></li>" +
    "<li><a href=/v1/me style=color:#c9a2ff>GET /v1/me</a></li>" +
    "<li><a href=/v1/plans style=color:#c9a2ff>GET /v1/plans</a></li></ul>" +
    "<p>stripe " + (STRIPE ? "on" : "off") + " · euler " + (EULER ? "on" : "off") +
    " · mailer " + (MAILER ? "on" : "off") + "</p></body>"
  );
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    product: "voxstream",
    stripe: Boolean(STRIPE),
    webhook: Boolean(STRIPE_WH),
    euler: Boolean(EULER),
    mailer: MAILER,
    time: new Date().toISOString()
  });
});

app.get("/v1/plans", (_req, res) => {
  res.json({
    product: "voxstream",
    selling: false,
    note: "Checkout is test-only on localhost. Pages stays Free.",
    plans: publicPlans()
  });
});

app.get("/v1/me", (req, res) => {
  res.json(mePayload(readSession(req)));
});

app.get("/v1/entitlement", (req, res) => {
  const plan = String(req.query.plan || "free").toLowerCase();
  const row = PLANS[plan] || PLANS.free;
  res.json({ plan: row.id, live: row.live, features: row });
});

app.post("/v1/auth/magic", (req, res) => {
  const email = String((req.body && req.body.email) || "").trim().toLowerCase();
  if (!okEmail(email)) {
    res.status(400).json({ ok: false, code: "bad_email" });
    return;
  }
  if (!MAILER) {
    res.status(501).json({ ok: false, code: "mailer_not_configured" });
    return;
  }
  const session = createSession(email, "free");
  res.setHeader("Set-Cookie", sidCookie(session.sid));
  res.json({ ok: true, sent: true, me: mePayload(session) });
});

app.post("/v1/checkout", (req, res) => startCheckout(req, res, STRIPE));
app.get("/v1/checkout/sync", (req, res) => syncCheckout(req, res, STRIPE));
app.post("/v1/checkout/sync", (req, res) => syncCheckout(req, res, STRIPE));

app.post("/v1/stripe/webhook", (_req, res) => {
  res.status(501).json({ ok: false, code: "webhook_not_wired" });
});

app.post("/v1/tiktok/hosted", (req, res) => {
  const uniqueId = String((req.body && req.body.uniqueId) || "").replace(/^@/, "").trim();
  if (uniqueId.length < 2) {
    res.status(400).json({ ok: false, code: "bad_user" });
    return;
  }
  const me = mePayload(readSession(req));
  if (!me.flags.tiktokHosted) {
    res.status(403).json({ ok: false, code: "need_pro" });
    return;
  }
  if (!EULER) {
    res.status(501).json({ ok: false, code: "euler_not_configured" });
    return;
  }
  res.json({ ok: true, relay: "/v1/tiktok/relay?uniqueId=" + encodeURIComponent(uniqueId) });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, code: "not_found", path: req.path });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/v1/tiktok/relay" });

wss.on("connection", (client, req) => {
  const me = mePayload(readSession(req));
  if (!me.flags.tiktokHosted || !EULER) {
    client.close(1008, me.flags.tiktokHosted ? "euler_not_configured" : "need_pro");
    return;
  }
  const url = new URL(req.url, "http://localhost");
  const uniqueId = String(url.searchParams.get("uniqueId") || "").replace(/^@/, "").trim();
  if (uniqueId.length < 2) {
    client.close(1008, "bad_user");
    return;
  }
  const upstreamUrl = "wss://ws.eulerstream.com?uniqueId=" +
    encodeURIComponent(uniqueId) + "&apiKey=" + encodeURIComponent(EULER);
  const up = new WebSocket(upstreamUrl);
  up.on("message", (data) => {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  });
  up.on("close", () => client.close());
  up.on("error", () => client.close(1011, "upstream"));
  client.on("close", () => { try { up.close(); } catch (e) {} });
  client.on("error", () => { try { up.close(); } catch (e) {} });
});

server.listen(PORT, () => {
  console.log("VoxStream server on http://localhost:" + PORT);
  console.log("pay     POST /v1/checkout");
  console.log("sync    GET  /v1/checkout/sync?session_id=");
  console.log("stripe  " + (STRIPE ? "key set" : "no"));
});
