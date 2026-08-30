import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { PLANS, publicPlans } from "./plans.mjs";

const PORT = Number(process.env.PORT || 8787);
const ORIGIN = process.env.PUBLIC_ORIGIN || "https://yuicoder.github.io";
const EULER = (process.env.EULER_API_KEY || "").trim();
const STRIPE = (process.env.STRIPE_SECRET_KEY || "").trim();

const app = express();
app.use(express.json({ limit: "32kb" }));
app.use(cors({
  origin: [ORIGIN, "http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:5500"],
  methods: ["GET", "POST", "OPTIONS"]
}));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    product: "voxstream",
    stripe: Boolean(STRIPE),
    euler: Boolean(EULER),
    time: new Date().toISOString()
  });
});

app.get("/v1/plans", (_req, res) => {
  res.json({
    product: "voxstream",
    selling: false,
    note: "Checkout is not live. Pages stays Free.",
    plans: publicPlans()
  });
});

app.get("/v1/entitlement", (req, res) => {
  const plan = String(req.query.plan || "free").toLowerCase();
  const row = PLANS[plan] || PLANS.free;
  res.json({ plan: row.id, live: row.live, features: row });
});

app.post("/v1/checkout", (_req, res) => {
  if (!STRIPE) {
    res.status(501).json({
      ok: false,
      code: "stripe_not_configured",
      hint: "Set STRIPE_SECRET_KEY on the host. Do not collect cards on GitHub Pages."
    });
    return;
  }
  res.status(501).json({
    ok: false,
    code: "stripe_not_wired",
    hint: "Secret present, Checkout Session not implemented until Auth exists."
  });
});

app.post("/v1/tiktok/hosted", (req, res) => {
  const uniqueId = String((req.body && req.body.uniqueId) || "").replace(/^@/, "").trim();
  if (uniqueId.length < 2) {
    res.status(400).json({ ok: false, code: "bad_user" });
    return;
  }
  if (!EULER) {
    res.status(501).json({
      ok: false,
      code: "euler_not_configured",
      hint: "Put EULER_API_KEY in server/.env. This is the Pro hosted TikTok path."
    });
    return;
  }
  res.json({
    ok: true,
    relay: "/v1/tiktok/relay?uniqueId=" + encodeURIComponent(uniqueId),
    note: "Open that path as WebSocket on this same host."
  });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/v1/tiktok/relay" });

wss.on("connection", (client, req) => {
  if (!EULER) {
    client.close(1011, "euler_not_configured");
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
  console.log("health  GET  /health");
  console.log("plans   GET  /v1/plans");
  console.log("euler   " + (EULER ? "yes" : "no"));
  console.log("stripe  " + (STRIPE ? "key set, checkout still 501" : "no"));
});
