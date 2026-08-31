import { PLANS } from "./plans.mjs";
import { upsertUser } from "./db.mjs";

const TOKEN = (process.env.KOFI_VERIFICATION_TOKEN || "").trim();
const PLUS_CODE = (process.env.KOFI_PLUS_CODE || "").trim().toLowerCase();
const PRO_CODE = (process.env.KOFI_PRO_CODE || "").trim().toLowerCase();

export function kofiReady() {
  return Boolean(TOKEN);
}

function parseBody(req) {
  if (req.body && typeof req.body.data === "string") {
    try { return JSON.parse(req.body.data); } catch (e) { return {}; }
  }
  if (req.body && typeof req.body === "object" && req.body.type) return req.body;
  return {};
}

function planFrom(payload) {
  const type = String(payload.type || "").toLowerCase();
  if (type !== "shop order") return "";
  const items = Array.isArray(payload.shop_items) ? payload.shop_items : [];
  const codes = items.map((i) => String((i && i.direct_link_code) || "").toLowerCase());
  if (PRO_CODE && codes.includes(PRO_CODE)) return "pro";
  if (PLUS_CODE && codes.includes(PLUS_CODE)) return "plus";
  const blob = [payload.tier_name, payload.message].concat(items.map((i) => i && (i.name || i.direct_link_code))).join(" ").toLowerCase();
  if (/\bpro\b/.test(blob)) return "pro";
  if (/\bplus\b/.test(blob)) return "plus";
  return "";
}

export function handleKofi(req, res) {
  if (!TOKEN) {
    res.status(501).json({ ok: false, code: "kofi_not_configured" });
    return;
  }
  const payload = parseBody(req);
  if (String(payload.verification_token || "") !== TOKEN) {
    res.status(401).json({ ok: false, code: "bad_kofi" });
    return;
  }
  const email = String(payload.email || "").trim().toLowerCase();
  const plan = planFrom(payload);
  if (!email.includes("@") || !PLANS[plan] || plan === "free") {
    res.json({ ok: true, ignored: true });
    return;
  }
  upsertUser(email, plan, {});
  res.json({ ok: true, granted: plan });
}
