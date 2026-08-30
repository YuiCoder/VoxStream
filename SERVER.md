# SERVER.md

Contract for the Node host in `server/`. Pages stays the app. One studio. Tiers are flags, not SKUs.

This file lists the routes that exist in `server/index.mjs`. Do not add extra routes. Do not put `EULER_API_KEY`, Stripe secrets, or dollar amounts on Pages.

Free never needs an account. Twitch, Ensayo, user Euler, TTS, filters, queue, bits, rejoin stay in the browser. ElevenLabs BYOK stays in the browser.

Local default: `http://localhost:8787`


## SQLite

Users and sessions live in SQLite (`server/db.mjs`). No OAuth.

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

Liveness. `{ ok, product, stripe, euler, mailer, time }`. Booleans only. No secrets.

### `GET /v1/plans`

Public flag table from `server/plans.mjs`. `{ product, selling: false, note, plans }`. Checkout is not live. Do not print any cents on the Pages landing.

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


### `GET /v1/entitlement?plan=`

Lookup a row in `PLANS` by query string. Not a session. Unknown plan falls back to free.

### `POST /v1/auth/magic`

Body `{ email }`. Bad email → `400`. No `RESEND_API_KEY` → `501`, no mail, no account. If the mailer key is set, it mints a **free** memory session and `Set-Cookie`. Still not a paid user.

### `POST /v1/checkout`

Stripe **test** Checkout. Not live. Not always `501`.

Needs a Stripe **test** key. Missing key returns `501` (`stripe_not_configured`). Bad plan returns `400`. On success returns a test Checkout Session url (subscription mode). No cards on GitHub Pages. No Customer Portal. Do not print cents on Pages.

### `GET /v1/checkout/sync` and `POST /v1/checkout/sync`

Applies a paid **test** session to SQLite (`users` + `sessions`). Query or body: `session_id` (`cs_...`) or `subscription_id` (`sub_...`). Paid or complete session applies the plan to SQLite, mints a cookie, and returns `/me`. Missing test key returns `501`. Not paid returns `409`. No email on the session returns `422`. Test only. Not live charges.

### `POST /v1/stripe/webhook`

Verifies the Stripe signature. Owner shipped the signed handler.

Stripe Dashboard destination: **VoxStream test** → `APP_URL/v1/stripe/webhook` (Railway).

The signing secret is `STRIPE_WEBHOOK_SECRET` on Railway only. Never in the repo, Pages, or chat. Without it the route returns `501`. Test mode only. No live keys.

### `POST /v1/tiktok/hosted`

Body `{ uniqueId }`. Needs Pro flag `tiktokHosted` on the session (`403` otherwise). Needs `EULER_API_KEY` on the host (`501` otherwise). Returns `{ ok, relay }` pointing at the WebSocket path. Free users keep pasting their own Euler key in the studio.

### `WS /v1/tiktok/relay?uniqueId=`

Same Pro + Euler rules. If either is missing, the socket closes. Relays to Euler. Never put the Euler key in the repo or in chat.

## Flags

From `PLANS` in `server/plans.mjs`:

- Free: live. No account.
- Plus: not for sale. UI lock until Pro sells.
- Pro: the SKU we sell. Hosted TikTok. BYOK in the browser.
- Ultra / YouTube / seats / Business: later. Not new routes.

## Build order

1. `/me` + magic link stub
2. Stripe test Checkout
3. Hosted TikTok gated on Pro
4. YouTube later

## Out of scope

Auth0, Firebase, rewriting `app.js`, Twitch login, dollar amounts on the Pages landing, live Stripe keys, Customer Portal this week.
