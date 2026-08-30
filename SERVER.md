# SERVER.md

Approved server plan for VoxStream. This is the only plan. Do not invent extra products.

Pages stays the app. One studio. Tiers are flags, not SKUs. Free never needs an account.

The other Grok owns `server/index.mjs` and `server/plans.mjs`. Do not edit those from this doc. Do not put `EULER_API_KEY` in the repo, in Pages, or in chat.

## What the server is for

- `GET /me` (plan + flags)
- Magic link (stub first)
- Stripe webhook later
- Hosted TikTok (our Euler key, Pro only)

Twitch IRC, Ensayo, user Euler, browser TTS, filters, queue, bits, rejoin stay in the studio. ElevenLabs BYOK stays in the browser.

## Approved API

Anonymous callers are Free.

### `GET /health`

Liveness. No secrets.

### `GET /v1/plans`

Public flag table. No dollar amounts. Checkout is not live. Pages stays Free.

### `GET /v1/me`

Returns `{ plan, flags }`.

No session → `{ plan: "free", flags: { ...free } }`.

### `POST /v1/auth/magic`

Stub. Does not send mail yet. Does not create a paid user.

### `POST /v1/checkout`

`501` until Stripe test keys exist **and** magic auth is real. No live Stripe keys. No Customer Portal this week. No cards on GitHub Pages.

### `WS /v1/tiktok/relay`

Pro only. Needs `EULER_API_KEY` on the host. If the plan is not Pro, the socket does not open. Free users keep pasting their own Euler key in the studio.

## Flags

- Free: live. Twitch, Ensayo, user Euler, TTS, filters. No account.
- Plus: not for sale. UI lock (extra filters, longer queue) until Pro actually sells.
- Pro: the SKU we sell. Account required. Hosted TikTok. ElevenLabs BYOK in the browser.
- Ultra seats: later. Not an API.
- YouTube OAuth: later. Not an API.
- Business invoices: not software.

## Build order

1. `/me` + magic link stub
2. Stripe test Checkout
3. Hosted TikTok gated on Pro
4. YouTube later

## Out of scope

Auth0, Firebase, rewriting `app.js` into a framework, Twitch login, dollar amounts on the Pages landing, live Stripe keys, Customer Portal this week.
