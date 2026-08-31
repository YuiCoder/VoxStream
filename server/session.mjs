import { PLANS } from "./plans.mjs";
import { getSession, putSession, getUser } from "./db.mjs";

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
  const row = getSession(sid);
  if (!row) return { sid: "", email: null, plan: "free" };
  const user = row.email ? getUser(row.email) : null;
  return {
    sid: row.sid,
    email: row.email,
    plan: (user && user.plan) || row.plan || "free"
  };
}

export function createSession(email, plan) {
  const sid = "vs_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const cleanPlan = PLANS[plan] ? plan : "free";
  const cleanEmail = String(email || "").toLowerCase() || null;
  putSession(sid, cleanEmail, cleanPlan);
  return { sid, email: cleanEmail, plan: cleanPlan, createdAt: Date.now() };
}

export function sidCookie(sid) {
  return "voxstream_sid=" + sid + "; Path=/; SameSite=None; Secure; Max-Age=2592000";
}

export function clearSidCookie() {
  return "voxstream_sid=; Path=/; SameSite=None; Secure; Max-Age=0";
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
