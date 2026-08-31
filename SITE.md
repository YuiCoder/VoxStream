# SITE.md — Pages site pass (OPEN)

Owner 2026-08-31: the public site should feel like a company site, not one long home dump.
Last finished GitHub-bot task: proprietary LICENSE (ffaca5c). This file is the next bot job.

Read CHATS.md first. Then this file. Then work **one item per commit**.

## Hard rules

- Pages only: `index.html` and new `*.html` + `styles.css` + a small `i18n.js` if needed.
- Do **not** edit `app.js`.
- Do **not** put parallax, fade chrome, or extra nav on the studio **reader** (`studio.html` layout, feed, sliders). A shared header on studio may gain a Home link. That is all.
- Do **not** revive Stripe live. Do **not** print `$` on Pages.
- Ko-fi shop is **https://ko-fi.com/bloodybytes/shop** (not `bloodbyte`).
- Buy flow stays: no account → GitHub/Google modal → then shop. Tips / bits / stream coffees do not grant.
- No React, no Auth0, no exe. Bump `?v=` after CSS/JS.
- English is the **default**. Spanish is the first extra language. Then more languages from the same dictionary. Do not invent a CMS.

## Site map (separate screens)

| File | Role |
| --- | --- |
| `index.html` | Home only. Hero + studio mock + short 3-step + CTA. No full feature list. No four tier cards. |
| `how.html` | How it works (the three steps, longer). |
| `features.html` | What is live today (Free list). |
| `plans.html` | Free / Plus / Pro / Ultra + buy buttons + account-then-Ko-fi modal. |
| `future.html` | Roadmap / what comes next (YouTube, hosted TikTok, more voices). Ultra note. |
| `faq.html` | Public FAQ from `FAQ.md` (EN default, ES available). |
| `studio.html` | Unchanged product. Add a Home link in the header only. |

`404.html` should point to `/VoxStream/` (home), not only studio.

## Nav (every public page except raw stage)

Wordmark = Home.

Visible links (not ghost gray-on-black):

- Home
- How
- Features
- Plans
- Future
- FAQ
- GitHub / Google (outline)
- Open studio (accent)

Contrast: nav links at least `--fg` or `--accent` on hover, idle not `--subtle`. Add a faint bar / blur behind the nav so How / Features / Plans never disappear into the grid.

Language control on the right of the nav: `EN` default, then `ES`, then `PT`, `JA` if the dictionary has those keys. Persist `localStorage.voxstream-lang`. First visit = `en`.

## Motion (landing pages only)

- Page / section enter: short opacity fade (200–280ms). No 1s luxury fade.
- Tier cards on `plans.html`: light hover tilt + lift (CSS `transform` + `box-shadow`). This is the “parallax on tiers”. No scroll-jacking. No library.
- Do not animate the studio feed or `#stage`.

## Copy defaults (EN)

Home H1: `Twitch and TikTok chat, read out loud.`
CTA: `Open studio`
Fine print: `Free to use. Plus and Pro: sign in, then the Ko-fi shop. Stream tips, bits, and subs do not grant a plan.`

Do not delete the Spanish strings. Put them in the dictionary.

## Bot order

- [x] N1. Extract a shared nav + footer pattern (copy-paste is fine; no build step). English default. Nav contrast fix. Home link.
- [x] N2. Split current `index.html` into the files in the site map. Home gets thinner. Plans move to `plans.html` with the existing buy modal.
- [x] N3. `faq.html` + `future.html` from FAQ.md / ROADMAP.md. No new product promises.
- [ ] N4. `i18n.js`: EN default, ES, and at least PT + JA stubs for nav + home + plans. Persist lang.
- [ ] N5. CSS: nav bar, fade-in, tier hover tilt. `?v=` bump. Studio reader untouched aside from Home link.
- [ ] N6. 404 + footer links match the new map. Ko-fi URL `bloodybytes`.
- [ ] N7. CHATS.md + `chats/2026-08-31-site-pages.md` update when done.
- [ ] N8. STOP. Reply with commit URLs and Pages links. Wait for the owner.

Do not start N4 before N2 is on main.
Do not start L (YouTube, Ultra seats, domain, exe).
