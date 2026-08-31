import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { PLANS, publicPlans } from "./plans.mjs";
import { readSession, createSession, sidCookie, mePayload } from "./session.mjs";
import { startCheckout, syncCheckout } from "./checkout.mjs";
import { handleStripeWebhook } from "./webhook.mjs";
import { upsertUser } from "./db.mjs";
import { githubReady, startGithub, finishGithub } from "./github.mjs";
import { googleReady, startGoogle, finishGoogle } from "./google.mjs";
import { kofiReady, handleKofi } from "./kofi.mjs";

const PORT = Number(process.env.PORT || 8787);
const ORIGIN = process.env.PUBLIC_ORIGIN || "https://yuicoder.github.io";
const APP_URL = String(process.env.APP_URL || "").replace(/\/$/, "");
const EULER = (process.env.EULER_API_KEY || "").trim();
const STRIPE = (process.env.STRIPE_SECRET_KEY || "").trim();
const STRIPE_WH = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
const ADMIN = (process.env.ADMIN_SECRET || "").trim();

function okEmail(email) {
  const at = email.indexOf("@");
  const dot = email.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < email.length - 1 && !email.includes(" ");
}

const app = express();
app.post("/v1/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
  handleStripeWebhook(req, res, STRIPE, STRIPE_WH);
});
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: [ORIGIN, APP_URL, "http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:5500", "http://localhost:8787"].filter(Boolean),
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

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    product: "voxstream",
    stripe: Boolean(STRIPE),
    webhook: Boolean(STRIPE_WH),
    admin: Boolean(ADMIN),
    github: githubReady(),
    google: googleReady(),
    kofi: kofiReady(),
    euler: Boolean(EULER),
    time: new Date().toISOString()
  });
});

app.get("/v1/plans", (_req, res) => {
  res.json({
    product: "voxstream",
    selling: false,
    note: "Public estudio stays Free. Team plans are granted by the owner or Ko-fi.",
    plans: publicPlans()
  });
});

app.get("/v1/me", (req, res) => {
  res.json(mePayload(readSession(req)));
});

app.get("/v1/auth/github", startGithub);
app.get("/v1/auth/github/callback", finishGithub);
app.get("/v1/auth/google", startGoogle);
app.get("/v1/auth/google/callback", finishGoogle);
app.post("/v1/kofi", handleKofi);

app.post("/v1/admin/grant", (req, res) => {
  if (!ADMIN) {
    res.status(501).json({ ok: false, code: "admin_not_configured" });
    return;
  }
  const secret = String((req.body && req.body.secret) || req.headers["x-admin-secret"] || "");
  if (secret !== ADMIN) {
    res.status(401).json({ ok: false, code: "bad_admin" });
    return;
  }
  const email = String((req.body && req.body.email) || "").trim().toLowerCase();
  const plan = String((req.body && req.body.plan) || "pro").toLowerCase();
  if (!okEmail(email)) {
    res.status(400).json({ ok: false, code: "bad_email" });
    return;
  }
  if (!PLANS[plan] || plan === "free") {
    res.status(400).json({ ok: false, code: "bad_plan" });
    return;
  }
  upsertUser(email, plan, {});
  const session = createSession(email, plan);
  res.setHeader("Set-Cookie", sidCookie(session.sid));
  res.json({ ok: true, granted: plan, me: mePayload(session) });
});

app.post("/v1/checkout", (req, res) => startCheckout(req, res, STRIPE));
app.get("/v1/checkout/sync", (req, res) => syncCheckout(req, res, STRIPE));
app.post("/v1/checkout/sync", (req, res) => syncCheckout(req, res, STRIPE));

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
  console.log("kofi    " + (kofiReady() ? "on" : "off"));
});
