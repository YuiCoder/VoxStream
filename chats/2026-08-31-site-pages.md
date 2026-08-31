# Chat 2026-08-31 — site pages task for GitHub Grok bot

Owner confirmed the landing look is good, then asked to stop stacking everything on home.

## Shipped (N1–N8)

- Separate screens: Home, How, Features, Plans, Future, FAQ.
- Home is hero + studio mock + 3 steps + Open studio. Plans left Home.
- English default. EN / ES / PT / JA in `i18n.js`, persisted as `localStorage.voxstream-lang`.
- Nav: Home How Features Plans Future FAQ + GitHub + Google + Open studio. Wordmark = Home. Contrast bar.
- Short fade on landing enter. Light hover tilt on plan cards only.
- Studio: Home link only. No motion on the reader or #stage.
- Ko-fi shop: https://ko-fi.com/bloodybytes/shop
- Buy flow: no account → GitHub/Google modal → shop. Tips do not grant.
- LICENSE still proprietary. No `$`. No `app.js`. No Stripe live.

## Still open

Owner review on Pages. Do not start L.

## Files

index.html, how.html, features.html, plans.html, future.html, faq.html, i18n.js, styles.css, studio.html (Home link), 404.html, SITE.md, CHATS.md, this file.

## Do not

- Do not edit `app.js`.
- Do not decorate `#stage` or the reader feed.
- Do not use `ko-fi.com/bloodbyte`.
- Do not print `$` on Pages.
- Do not revive Stripe live.
