# PRO.md — make Pro real (OPEN)

Owner 2026-08-31 said yes. Free studio stays. Do not revive Stripe.

## What Pro is, this pass

- Hosted TikTok: Pro session → `POST /v1/tiktok/hosted` → Railway WebSocket relay. User does not paste an Euler key.
- Free / Plus still paste their own Euler key in the studio.
- ElevenLabs BYOK is the next Pro slice. Not this file.
- YouTube stays later.

## Owner (Railway)

Health is `euler: false` until this exists:

```
EULER_API_KEY=
```

That is the host Euler key for Pro only. Never commit it. Never paste it in chat.
After it is set, `/health` must show `euler: true`.

Grant your own email Pro to test:

`POST /v1/admin/grant` `{ email, plan: "pro" }` with the **new** admin secret. Do not paste the secret.

## Code already started

- `hosted.js` wraps `startTikTok` when `flags.tiktokHosted` is on.
- Studio must load `hosted.js` after `app.js`.
- `me.js` hides the TikTok key row for Pro.

## Do not

- Do not rewrite Twitch / Ensayo / queue.
- Do not put the Euler key in Pages.
- Do not claim ElevenLabs is live until that slice ships.
