# DROP.md — DONE

TikTok is cancelled. Twitch only.

Already on main: studio.html has no TikTok UI, hosted.js deleted, server tiktok routes gone, plans flags false, me.js has no Euler text.

Still do:

1. In `app.js` delete `ingestTikTok`, `classifyTikTokError`, `startTikTok`, `stopTikTok`, `tiktokOn`, `tiktokSock`, the tiktok-btn / ttkey handlers, and ttkey save/load. Demo rows that said tiktok → twitch. Empty copy that mentions Euler. Bump studio already at app.js?v=15.
2. In `i18n.js` and landing html, no "TikTok" / "Euler" in user-facing strings. Bump `i18n.js?v=2`.
3. README already Twitch-only if not, make it so.
4. Do not revive Stripe. Do not start Tauri. Do not add TikTok back.
5. STOP. Health check. `euler` in /health should be false after Railway redeploy.

Owner must delete `EULER_API_KEY` on Railway (human).
