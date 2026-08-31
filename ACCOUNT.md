# ACCOUNT.md — Pages account pass (OPEN)

Owner 2026-08-31. Shop + webhook + Railway SKU codes are done. No live paid test buy yet.
Do **not** edit `app.js`. Do **not** revive Stripe. Do **not** print `$`.
Ko-fi shop: https://ko-fi.com/bloodybytes/shop

Read CHATS.md, then this file. One commit per item. STOP after A5.

## What exists on the server (already on main)

- `GET /v1/me` → `{ email, plan, flags }`
- `GET /v1/logout` → clears `voxstream_sid`, redirects to `/VoxStream/account.html`
- `POST /v1/admin/grant` now accepts `plan: "free"` so the owner can undo a leftover Stripe-test Pro. Owner runs that. Bot does not.

## Honest plans (do not sell vapor)

Live today:
- Free: studio, Twitch, Demo, user Euler TikTok, stage, browser voice, filters, queue, bits.
- Plus: extra filters, longer queue.
- Pro: everything Plus + longer queue. Hosted TikTok and ElevenLabs BYOK are **not** a finished buyer feature. Say “later”, not “included now”.

No expiry date. Ko-fi shop is a one-time order.

## Bot order

- [x] A1. `account.html` with the same site nav/footer as the other pages. English default + `i18n.js`.
- [x] A2. Signed out: “Not signed in” + GitHub + Google. Signed in: email, plan name, Open studio, Sign out (`GET https://voxstream-production.up.railway.app/v1/logout`).
- [x] A3. If plan is free: Buy Plus / Buy Pro buttons using the same account-first modal as `plans.html`. If plus/pro: no buy push, just the plan name.
- [ ] A4. Add Account to the site nav on every public page (Home How Features Plans Future FAQ Account). Studio header: Account link next to Home. Do not restyle the reader.
- [ ] A5. STOP. Commit URLs. Wait.

No skins. No billing dates. No parallax. No mp4. No `app.js`.
