import { getUser, upsertUser } from "./db.mjs";
import { createSession, sidCookie, mePayload } from "./session.mjs";

const ID = (process.env.GITHUB_CLIENT_ID || "").trim();
const SECRET = (process.env.GITHUB_CLIENT_SECRET || "").trim();
const APP_URL = String(process.env.APP_URL || "").replace(/\/$/, "");
const STUDIO = (process.env.PUBLIC_ORIGIN || "https://yuicoder.github.io") + "/VoxStream/studio.html";

export function githubReady() {
  return Boolean(ID && SECRET && APP_URL);
}

export function startGithub(_req, res) {
  if (!githubReady()) {
    res.status(501).json({ ok: false, code: "github_not_configured" });
    return;
  }
  const state = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  res.setHeader("Set-Cookie", "voxstream_gh=" + state + "; Path=/; SameSite=Lax; Secure; Max-Age=600");
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", ID);
  url.searchParams.set("redirect_uri", APP_URL + "/v1/auth/github/callback");
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);
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

export async function finishGithub(req, res) {
  if (!githubReady()) {
    res.status(501).json({ ok: false, code: "github_not_configured" });
    return;
  }
  const url = new URL(req.url, APP_URL);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const expect = cookieMap(req.headers.cookie).voxstream_gh || "";
  if (!code || !state || state !== expect) {
    res.status(400).send("github state mismatch");
    return;
  }
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: ID,
      client_secret: SECRET,
      code,
      redirect_uri: APP_URL + "/v1/auth/github/callback"
    })
  });
  const tokenBody = await tokenRes.json();
  const token = tokenBody.access_token;
  if (!token) {
    res.status(401).send("github token failed");
    return;
  }
  const emailsRes = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "User-Agent": "VoxStream" }
  });
  const emails = await emailsRes.json();
  const list = Array.isArray(emails) ? emails : [];
  const primary = list.find((e) => e.primary && e.verified) || list.find((e) => e.verified) || list[0];
  const email = String((primary && primary.email) || "").toLowerCase();
  if (!email || !email.includes("@")) {
    res.status(400).send("github email missing");
    return;
  }
  const existing = getUser(email);
  const plan = (existing && existing.plan) || "free";
  upsertUser(email, plan, {});
  const session = createSession(email, plan);
  res.setHeader("Set-Cookie", sidCookie(session.sid));
  res.redirect(STUDIO + "?ok=github");
}
