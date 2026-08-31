import { getUser, upsertUser } from "./db.mjs";
import { createSession, sidCookie } from "./session.mjs";

const ID = (process.env.GOOGLE_CLIENT_ID || "").trim();
const SECRET = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
const APP_URL = String(process.env.APP_URL || "").replace(/\/$/, "");
const STUDIO = (process.env.PUBLIC_ORIGIN || "https://yuicoder.github.io") + "/VoxStream/studio.html";

export function googleReady() {
  return Boolean(ID && SECRET && APP_URL);
}

export function startGoogle(_req, res) {
  if (!googleReady()) {
    res.status(501).json({ ok: false, code: "google_not_configured" });
    return;
  }
  const state = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  res.setHeader("Set-Cookie", "voxstream_gg=" + state + "; Path=/; SameSite=Lax; Secure; Max-Age=600");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", ID);
  url.searchParams.set("redirect_uri", APP_URL + "/v1/auth/google/callback");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  res.redirect(url.toString());
}

function cookieMap(header) {
  const out = {};
  String(header || "").split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i < 1) return;
    out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  });
  return out;
}

export async function finishGoogle(req, res) {
  if (!googleReady()) {
    res.status(501).json({ ok: false, code: "google_not_configured" });
    return;
  }
  const url = new URL(req.url, APP_URL);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const expect = cookieMap(req.headers.cookie).voxstream_gg || "";
  if (!code || !state || state !== expect) {
    res.status(400).send("google state mismatch");
    return;
  }
  const body = new URLSearchParams({
    code,
    client_id: ID,
    client_secret: SECRET,
    redirect_uri: APP_URL + "/v1/auth/google/callback",
    grant_type: "authorization_code"
  });
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const tokenBody = await tokenRes.json();
  if (!tokenBody.access_token) {
    res.status(401).send("google token failed");
    return;
  }
  const meRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: "Bearer " + tokenBody.access_token }
  });
  const me = await meRes.json();
  const email = String(me.email || "").toLowerCase();
  if (!email || !email.includes("@")) {
    res.status(400).send("google email missing");
    return;
  }
  const existing = getUser(email);
  const plan = (existing && existing.plan) || "free";
  upsertUser(email, plan, {});
  const session = createSession(email, plan);
  res.setHeader("Set-Cookie", sidCookie(session.sid));
  res.redirect(STUDIO + "?ok=google");
}
