# SERVER.md

Contract for the Node host in `server/`. Pages stays the app. One studio. Tiers are flags, not SKUs.

This file lists the routes that exist in `server/index.mjs`. Do not add extra routes. Do not put `EULER_API_KEY`, Stripe secrets, or dollar amounts on Pages.

Free never needs an account. Twitch, Ensayo, user Euler, TTS, filters, queue, bits, rejoin stay in the browser. ElevenLabs BYOK stays in the browser.

Local default: `http://localhost:8787`

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

Always `501`. Waits for Stripe **and** a real magic session. No cards on GitHub Pages. No Customer Portal.

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
