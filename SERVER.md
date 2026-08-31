# SERVER.md

Contract for the Node host in `server/`. Pages stays the app. One studio. Tiers are flags, not SKUs.

This file lists the routes that exist in `server/index.mjs`. Do not add extra routes. Do not put `EULER_API_KEY`, Stripe secrets, `ADMIN_SECRET`, Ko-fi tokens, OAuth client secrets, or dollar amounts on Pages. Never commit `ADMIN_SECRET`.

Free never needs an account. Twitch, Ensayo, user Euler, TTS, filters, queue, bits, rejoin stay in the browser. ElevenLabs BYOK stays in the browser.

Local default: `http://localhost:8787`


## SQLite

Users and sessions live in SQLite (`server/db.mjs`). Login is GitHub or Google OAuth (cookie session). There is no password form.

- File: `server/data/voxstream.db`
- Directory `server/data/` is gitignored (already in `.gitignore`). Do not commit the database.

Table `users`:

- `email` PRIMARY KEY
- `plan` default `free`
- `stripe_customer`
- `stripe_sub`
- `plan_expires`
- `created_at`

Table `sessions`:

- `sid` PRIMARY KEY
- `email`
- `plan` default `free`
- `created_at`

Anonymous `GET /v1/me` (no cookie / unknown sid) is still plan `free`.


## Routes (as of this commit)

### `GET /health`

Liveness. `{ ok, product, stripe, webhook, admin, github, google, kofi, euler, time }`. Booleans only. No secrets. `admin` is true when `ADMIN_SECRET` is set on the host.

### `GET /v1/plans`

Public flag table from `server/plans.mjs`. `{ product, selling: false, note, plans }`. Team plans are granted by the owner or a Ko-fi shop order. Stripe is not required. Do not print any cents on the Pages landing.

### `GET /v1/me`

Cookie session via `voxstream_sid`. Anonymous (no cookie / unknown sid) is always `plan: "free"`. Body is `{ ok, email, plan, live, flags }`.

Example body:

```json
{
  "ok": true,
  "email": null,
  "plan": "free",
  "live": true,
  "flags": {
    "id": "free",
    "live": true,
    "seats": 1,
    "maxQueue": 12,
    "twitch": true,
    "tiktokUserKey": true,
    "tiktokHosted": false,
    "youtube": false,
    "elevenlabsByok": false,
    "extraFilters": false
  }
}
```

### `GET /v1/auth/github` and `GET /v1/auth/github/callback`

GitHub OAuth. Scope `read:user user:email`. Mints the same session cookie. Keeps an existing plan on that email. Redirects to `studio.html?ok=github`.

### `GET /v1/auth/google` and `GET /v1/auth/google/callback`

Google OAuth. Scope `openid email profile`. Same session model. Redirects to `studio.html?ok=google`.

### `POST /v1/kofi`

Ko-fi webhook. `application/x-www-form-urlencoded` body with `data` JSON. Needs `KOFI_VERIFICATION_TOKEN`.

**Shop Order only.** Donation, Commission, Subscription, and Tip return `{ ok: true, ignored: true }` and do not change a plan. Twitch bits, Twitch subs, and stream coffees never hit this route.

When `KOFI_PLUS_CODE` or `KOFI_PRO_CODE` is set on the host, only shop items whose `direct_link_code` matches grant Plus or Pro. That keeps the VTuber tip jar off the coding shop. Without those vars, the handler only accepts product names that contain `VoxStream Plus` or `VoxStream Pro`.

Do not put the verification token or the codes in the repo.

### `POST /v1/admin/grant`

Owner grant. This is how teammates get Plus/Pro/Ultra. Not a card. Stripe is not required.

Needs `ADMIN_SECRET` on the host (Railway). Never commit it. Never put it in Pages, GitHub, or chat.

- No `ADMIN_SECRET` → `501` `{ ok: false, code: "admin_not_configured" }`
- Secret from JSON `secret` or header `x-admin-secret`. Wrong secret → `401` `{ ok: false, code: "bad_admin" }`
- Body `{ email, plan }`. `plan` defaults to `pro`. Email is lowercased.
- Bad email → `400` `{ ok: false, code: "bad_email" }`
- Unknown plan, or `free` → `400` `{ ok: false, code: "bad_plan" }`
- Success: upserts the user, mints a session cookie, `{ ok: true, granted, me }`

Owner-only. Team is VE/LATAM/US/EU.

### `POST /v1/auth/magic`

Body `{ email }`. Bad email → `400`. No `RESEND_API_KEY` → `501`, no mail, no account. If the mailer key is set, it mints a **free** memory session and `Set-Cookie`. Still not a paid user.

### `POST /v1/checkout`

Still in the binary. **Not required.** Stripe live is closed. Donations later. Test Checkout only.

Needs a Stripe **test** key. Missing key returns `501` (`stripe_not_configured`). Bad plan returns `400`. On success returns a test Checkout Session url (subscription mode). No cards on GitHub Pages. No Customer Portal. Do not print cents on Pages.

### `GET /v1/checkout/sync` and `POST /v1/checkout/sync`

Applies a paid **test** session to SQLite (`users` + `sessions`). Query or body: `session_id` (`cs_...`) or `subscription_id` (`sub_...`). Paid or complete session applies the plan to SQLite, mints a cookie, and returns `/me`. Missing test key returns `501`. Not paid returns `409`. No email on the session returns `422`. Test only. Not live charges.

### `POST /v1/stripe/webhook`

Still in the binary. **Not required.** Stripe live is closed. Verifies the Stripe signature in test.

Stripe Dashboard destination: **VoxStream test** → `APP_URL/v1/stripe/webhook` (Railway).

The signing secret is `STRIPE_WEBHOOK_SECRET` on Railway only. Never in the repo, Pages, or chat. Without it the route returns `501`. Test mode only. No live keys.

### `POST /v1/tiktok/hosted`

Body `{ uniqueId }`. Needs Pro flag `tiktokHosted` on the session (`403` otherwise). Needs `EULER_API_KEY` on the host (`501` otherwise). Returns `{ ok, relay }` pointing at the WebSocket path. Free users keep pasting their own Euler key in the studio.

### `WS /v1/tiktok/relay?uniqueId=`

Same Pro + Euler rules. If either is missing, the socket closes. Relays to Euler. Never put the Euler key in the repo or in chat.

## Flags

From `PLANS` in `server/plans.mjs`:

- Free: live. No account.
- Plus / Pro / Ultra: granted by the owner (`POST /v1/admin/grant`) or a matching Ko-fi shop SKU. Not a card. Not a stream tip.
- Pro: hosted TikTok. BYOK in the browser.
- Ultra / YouTube / seats / Business: later. Not new routes.
- Stripe live closed.

## Build order

1. `/me` + magic link stub
2. Owner grant (`POST /v1/admin/grant`)
3. GitHub + Google OAuth
4. Ko-fi shop webhook
5. Hosted TikTok gated on Pro
6. YouTube later

## Out of scope

Auth0, Firebase, rewriting `app.js`, Twitch login, dollar amounts on the Pages landing, live Stripe keys, selling via card, Customer Portal, committing `ADMIN_SECRET`, treating stream tips as a plan.
