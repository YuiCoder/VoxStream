# chats/2026-09-08-drop-tiktok.md

Owner: friend quit TikTok. Remove TikTok from the product. Twitch only.

Did:
- Studio has no TikTok inputs, no Euler key, no hosted.js
- Server has no /v1/tiktok/* and no Euler relay
- Plans flags tiktokUserKey / tiktokHosted are false
- Site copy is Twitch-only

Human still must delete EULER_API_KEY on Railway.
