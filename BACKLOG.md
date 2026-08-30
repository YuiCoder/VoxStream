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

## Now (bot may take these in order)

- [x] B1. Keep SERVER.md in sync with real routes in server/index.mjs. No extra routes.
- [ ] B2. server/README.md: Windows + Mac run steps, what 501 means, what Pages cannot host.
- [ ] B3. Add GET /v1/me example JSON to SERVER.md. Anonymous is always plan free.
- [ ] B4. Landing footer and README: link SERVER.md and BACKLOG.md. Still no prices.
- [ ] B5. Favicon / og / header: confirm VOX·STREAM + rhombus + lilac. Fix if a file still says LIVE.
- [ ] B6. CONTRIBUTING.md: friend may edit copy. Bot and owner own app.js / server.
- [ ] B7. Add a short FAQ.md: muted tab, Probar voz, Euler key, no exe, old /Voxlive/ URL is dead.
- [ ] B8. Stage-mode CSS pass only (styles.css). Bigger now-text, hide more chrome, no JS rewrite.
- [ ] B9. Accessible labels on sliders (aria-valuetext) in studio.html. Do not change app.js logic.
- [ ] B10. 404.html on Pages that points people to /VoxStream/studio.html.

STOP after B10. Owner reviews.

## Next (only after owner says OPEN)

- [ ] C1. Magic-link email copy (subject + body) in server/mail.mjs. Do not send until RESEND_API_KEY exists.
- [ ] C2. Stripe test fixtures: document products Plus/Pro/Ultra in STRIPE.md. No live keys.
- [ ] C3. Webhook handler stub POST /v1/stripe/webhook that returns 501 without the secret.
- [ ] C4. Hosted TikTok status text in the studio lock card only. No new socket code.
- [ ] C5. ElevenLabs BYOK fields in studio.html (hidden behind Pro label). Do not call ElevenLabs yet.

STOP after C5.

## Later (do not start)

- [ ] L1. YouTube OAuth
- [ ] L2. Ultra seats
- [ ] L3. Business invoices
- [ ] L4. Twitch login
- [ ] L5. Customer Portal
- [ ] L6. Custom domain
- [ ] L7. Desktop wrapper
