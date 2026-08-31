# Chat 2026-08-30 — Ko-fi SKU lock + landing look

Owner asked to keep VTuber stream money (bits, donations, Twitch subs, Ko-fi tips) out of VoxStream tiers, check the proprietary LICENSE, then make the landing prettier.

## License

`LICENSE` (commit `Docs: proprietary license, all rights reserved`) is correct:

- Copyright 2026 YuiCoder. All rights reserved.
- Public Pages Free use is allowed.
- That use does not license the source.
- No copy / modify / distribute / sell as your own product without written permission.
- PRs assign to YuiCoder.
- AS IS, no warranty.

Do not switch to MIT/Apache.

## What this chat shipped

- `server/kofi.mjs`: still Shop Order only. If `KOFI_PLUS_CODE` or `KOFI_PRO_CODE` is set, **only those shop `direct_link_code` values grant**. Name fallback is then off, so a VTuber merch title with "pro" cannot flip a plan. Without codes, fallback requires the exact product names `VoxStream Pro` / `VoxStream Plus`.
- Twitch bits / subs never hit `/v1/kofi`. Ko-fi Donation / Commission / Subscription / Tip still return `{ ignored: true }`.
- Landing look pass (`index.html` + scoped `.landing` CSS). No `app.js`. No studio reader rewrite. No `$` on the landing.
- Cache bump `styles.css?v=14` on the landing. Studio `?v=` left until a studio CSS need.
- Docs: HOST.md / SERVER.md / `.env.example` list the Ko-fi code var **names**. No secrets.

## Railway (owner click — bot cannot set vars)

I cannot write Railway from this chat. Owner must add (values from Ko-fi shop item URLs, not from stream tip buttons):

- `KOFI_PLUS_CODE` = Plus item `direct_link_code`
- `KOFI_PRO_CODE` = Pro item `direct_link_code`

Webhook URL stays `https://voxstream-production.up.railway.app/v1/kofi`. Token already on (`kofi:true`).

How to read the code: open the shop product → share / direct link. The slug after `ko-fi.com/s/` is the code.

## Owner still needs to do

1. Paste the two codes on Railway → Variables → Redeploy.
2. Buy Plus once with the Google Gmail if you want a live badge test. Or keep grant.

## Do not

- Do not treat bits, Twitch subs, or Ko-fi tips as Plus/Pro.
- Do not revive Stripe live.
- Do not edit `app.js` unless a studio bug is pasted.
- Do not put parallax on the studio reader chrome.
- Do not commit tokens or `ADMIN_SECRET`.

## Next

1. Owner sets the two Railway codes and redeploys.
2. Optional badge test with the same Gmail as Google.
3. Studio visual polish only if owner asks (CSS, not `app.js`).
