# VoxStream backlog

Standing work list. One item per commit. Do not skip ahead. Do not invent SKUs.

Rules that never expire:
- Pages stays the app. One studio.
- Do not rewrite Twitch / Ensayo / user-Euler / queue in app.js unless the item says so.
- Do not put $ on the landing.
- Do not commit .env, Euler keys, Stripe keys, or PATs.
- Do not add Auth0, Firebase, React, or an exe.
- YouTube, Ultra seats, Business software, Twitch login = only when an item is marked OPEN.
- After every push: reply with commit URL and WAIT for the owner if the item says STOP.
- Do not edit app.js unless the owner pastes a concrete bug.
- Do not touch app.js, server, or Stripe.
- Never commit ADMIN_SECRET. Stripe live is closed. Donations later.

## Now (bot may take these in order)

- [x] B1. Keep SERVER.md in sync with real routes in server/index.mjs. No extra routes.
- [x] B2. server/README.md: Windows + Mac run steps, what 501 means, what Pages cannot host.
- [x] B3. Add GET /v1/me example JSON to SERVER.md. Anonymous is always plan free.
- [x] B4. Landing footer and README: link SERVER.md and BACKLOG.md. Still no prices.
- [x] B5. Favicon / og / header: confirm VOX·STREAM + rhombus + lilac. Fix if a file still says LIVE.
- [x] B6. CONTRIBUTING.md: friend may edit copy. Bot and owner own app.js / server.
- [x] B7. Add a short FAQ.md: muted tab, Probar voz, Euler key, no exe, old /Voxlive/ URL is dead.
- [x] B8. Stage-mode CSS pass only (styles.css). Bigger now-text, hide more chrome, no JS rewrite.
- [x] B9. Accessible labels on sliders (aria-valuetext) in studio.html. Do not change app.js logic.
- [x] B10. 404.html on Pages that points people to /VoxStream/studio.html.

STOP after B10. Owner reviews.

## Next (only after owner says OPEN)

- [x] C1. Magic-link email copy (subject + body) in server/mail.mjs. Do not send until RESEND_API_KEY exists.
- [x] C2. Stripe test fixtures: document products Plus/Pro/Ultra in STRIPE.md. No live keys.
- [x] C3. Webhook handler stub POST /v1/stripe/webhook that returns 501 without the secret.
- [x] C4. Hosted TikTok status text in the studio lock card only. No new socket code.
- [x] C5. ElevenLabs BYOK fields in studio.html (hidden behind Pro label). Do not call ElevenLabs yet.

STOP after C5.


## Done (D)

- [x] D1. SERVER.md: SQLite users + sessions. File server/data/voxstream.db, gitignored. Anonymous /me is free.
- [x] D2. FAQ.md: Free needs no account. Stripe test is not live charges.
- [x] D3. BACKLOG: check C3; record D1 D2.


## Done (F)

- [x] F1. HOST.md: Railway Volume + DATA_DIR=/data. Paid rows die on deploy without it.
- [x] F2. FAQ.md: no local terminal, live Stripe off, Free keeps user Euler.
- [x] F3. SERVER.md: checkout sync + webhook stub documented.

## G (owner)

Volume is owner (Railway click). Webhook secret is owner (`STRIPE_WEBHOOK_SECRET`). L still closed.

- [x] G1. BACKLOG: F done; G is owner (volume + webhook secret); L closed.
- [x] G2. SERVER.md: webhook verifies Stripe signature; 501 without STRIPE_WEBHOOK_SECRET.
- [x] G3. FAQ: going Live is not a bot task. YouTube is closed.


## H (Stripe test destination)

Owner created Stripe destination **VoxStream test** → `/v1/stripe/webhook`. Signing secret goes to Railway only. L still closed.

- [x] H1. BACKLOG: VoxStream test destination; secret on Railway; L closed.
- [x] H2. SERVER.md: destination VoxStream test → /v1/stripe/webhook; signing secret on Railway only.
- [x] H3. FAQ: signing secret is Railway only. No Live.


## I (product pass)

Owner paused Stripe Live. Money later. Next is studio bugs the owner files.

- [x] I1. FAQ: how to test studio (voice, Twitch, Euler TikTok, Escenario). No prices.
- [x] I2. BACKLOG: money later. Next is studio bugs the owner files.
- [x] I3. Do not edit app.js unless owner pastes a concrete bug.

STOP after I3.


## J (after product pass)

Owner confirmed studio works on Twitch + TikTok. Queue cap is on main. Money stays later.
Product pass ok. Next is look (CSS) or copy only if owner says A or B.

- [x] J1. BACKLOG: product pass ok. Next is look (CSS) or copy only if owner says A or B.
- [x] J2. Do not touch app.js, server, or Stripe.

STOP after J1 unless owner says A or B.


## K (grant, Stripe not required)

Owner dropped Stripe-as-required. Team is VE/LATAM/US/EU. Grant API is on main: `POST /v1/admin/grant`.
Stripe live closed. Donations later. L closed.

- [x] K1. SERVER.md: document grant. Needs ADMIN_SECRET. Never commit the secret.
- [x] K2. FAQ: teammates get Pro from the owner, not a card.
- [x] K3. BACKLOG: Stripe live closed. Donations later. L closed.

STOP after K3.

## Later (do not start)

- [ ] L1. YouTube OAuth
- [ ] L2. Ultra seats
- [ ] L3. Business invoices
- [ ] L4. Twitch login
- [ ] L5. Customer Portal
- [ ] L6. Custom domain
- [ ] L7. Desktop wrapper
