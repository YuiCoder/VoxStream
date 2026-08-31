# Chat 2026-08-30 — OAuth + Ko-fi Shop

Owner: YuiCoder. Product: VoxStream (was Voxlive). Team: VE / LATAM / US / EU.
This session ran long and started lagging. Next chat must read this file instead of the old thread.

## URLs

- Repo: https://github.com/YuiCoder/VoxStream
- Pages: https://yuicoder.github.io/VoxStream/
- Studio: https://yuicoder.github.io/VoxStream/studio.html
- API: https://voxstream-production.up.railway.app
- Health: `GET /health` last seen `{ ok, product:voxstream, stripe:false, webhook:false, admin:true, github:true, google:true, kofi:true }`
- Ko-fi shop (Bloodbyte): products **VoxStream Pro $19** and **VoxStream Plus $9** with preview covers live

## What this chat shipped

- Stripe live abandoned (org / team cards blocked for VE members). Keys not required. `STRIPE.md` is historical. `/v1/stripe/webhook` may still 501. Do not turn Stripe live back on.
- GitHub OAuth: `server/github.mjs`, routes `/v1/auth/github` + callback. Scope `read:user user:email`. Session cookie SameSite=Lax. Login keeps existing plan.
- Google OAuth: `server/google.mjs`, same session model. Scope `openid email profile`. Tested; badge painted.
- Ko-fi webhook: `server/kofi.mjs` + `express.urlencoded` + `POST /v1/kofi`. **Shop Order only.** Tips / donations / VTuber stream coffees must not flip a plan.
- `planFrom` uses product name (`VoxStream Plus` / `VoxStream Pro`), amount, optional `KOFI_PLUS_CODE` / `KOFI_PRO_CODE` (direct_link_code). Codes not required while titles stay exact.
- Owner grant stays: `POST /v1/admin/grant` + `ADMIN_SECRET` on Railway. Never commit the secret.
- `me.js` paints flags + queue cap from `flags.maxQueue`.
- Studio header now has login links (Grok bot commit "Studio: GitHub and Google login links"):
  - `https://voxstream-production.up.railway.app/v1/auth/github`
  - `https://voxstream-production.up.railway.app/v1/auth/google`
- Callbacks redirect to `studio.html?ok=github|google`.
- FAQ updated: shop grants, stream tips ignored.
- Preview JPGs generated in chat for Ko-fi (not committed; owner uploaded them in the Shop UI).
- One Ko-fi wallet. VTuber debut button is separate from Shop products.

## Owner confirmed in UI

- Google login works.
- GitHub login works (email mismatch was fixed by granting the address GitHub actually returns).
- Railway health green after OAuth + Ko-fi mount.
- Ko-fi Shop list screenshot: Pro $19 + Plus $9 with the dark VOX·STREAM covers.
- Free studio always works without an account.

## Do not

- Do not edit `app.js` unless the owner pastes a concrete studio bug.
- Do not rewrite the auth screen. Buttons in the studio header are enough.
- Do not put parallax / heavy decoration on the reader core.
- Do not treat stream tips as plan payment.
- Do not add Auth0, Firebase, React, exe, YouTube, Ultra seats, Twitch login.
- Do not print $ on the landing unless the owner asks.
- Do not commit `.env`, tokens, or `ADMIN_SECRET`.

## Files that matter

- `server/index.mjs` — mounts github, google, kofi, grant, health flags
- `server/github.mjs` / `server/google.mjs` / `server/kofi.mjs`
- `server/session.mjs` / `server/db.mjs` / `server/plans.mjs`
- `studio.html` — header login `<a>` tags
- `me.js` — paint plan badge + queue cap
- `FAQ.md` / `SERVER.md` / `BACKLOG.md`

## Next (pick one)

1. Owner optional: buy Plus with the same Gmail used for Google, confirm badge flips. Or skip and keep using grant for the team.
2. Optional Railway vars `KOFI_PLUS_CODE` / `KOFI_PRO_CODE` from Ko-fi item direct_link_code.
3. Landing look / parallax only if owner says so. Not on `studio.html` reader chrome.
4. Studio bugs only if owner pastes one.
5. After any CSS/JS change on Pages, bump `?v=` on `styles.css` / `app.js` / `me.js`.

## Env that should already exist on Railway (names only)

`PUBLIC_ORIGIN`, `APP_URL`, `DATA_DIR=/data`, `ADMIN_SECRET`, GitHub OAuth client id/secret, Google OAuth client id/secret, `KOFI_VERIFICATION_TOKEN` (or whatever `kofi.mjs` reads). Optional `KOFI_PLUS_CODE`, `KOFI_PRO_CODE`.
