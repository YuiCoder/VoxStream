import { PLANS } from "./plans.mjs";

const sessions = new Map();

function cookieMap(header) {
  const out = {};
  String(header || "").split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i < 1) return;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

export function readSession(req) {
  const cookies = cookieMap(req.headers.cookie);
  const sid = cookies.voxstream_sid || "";
  if (sid && sessions.has(sid)) return sessions.get(sid);
  return { sid: "", email: null, plan: "free" };
}

export function createSession(email, plan) {
  const sid = "vs_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const row = { sid, email: String(email || "").toLowerCase(), plan: PLANS[plan] ? plan : "free", createdAt: Date.now() };
  sessions.set(sid, row);
  return row;
}

export function sidCookie(sid) {
  return "voxstream_sid=" + sid + "; Path=/; SameSite=Lax; Max-Age=2592000";
}

export function mePayload(session) {
  const plan = PLANS[session.plan] ? session.plan : "free";
  const flags = PLANS[plan];
  return {
    ok: true,
    email: session.email,
    plan,
    live: Boolean(flags.live),
    flags
  };
}
