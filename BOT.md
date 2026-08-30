# Voxlive — briefing for Grok Bot

Repo: https://github.com/YuiCoder/Voxlive
Live site: https://yuicoder.github.io/Voxlive/
Owner: YuiCoder. Default branch: main. GitHub Pages from main / root.

## Product
Voxlive is a live-chat reader for streamers. It shows Twitch + TikTok chat and reads messages aloud with the browser Web Speech API. Target: Windows 11, Chrome. UI language Spanish first, English toggle already exists. Future: sell as a web subscription. Keep it a web app on GitHub Pages. Do NOT build EXEs, zips, or Electron unless the owner asks later.

## What already works
- Static SPA: index.html, app.js, styles.css, .nojekyll
- Dark studio UI, stage mode, ES/EN, localStorage
- Demo / Ensayo simulated chat
- Twitch live chat via `wss://irc-ws.chat.twitch.tv:443` as justinfan (no password)
- TTS via speechSynthesis. Audio must unlock on a user click ("Probar voz"). Auto-speak on page load is blocked by Chrome.
- TikTok live is NOT possible from Pages alone. Current path: user pastes a free Euler Stream or tik.tools API key, then connect to `wss://ws.eulerstream.com` or `wss://api.tik.tools`.

## Hard constraints
1. Stay on this repo. Commit to main. Do not create extra repos.
2. Keep Pages working: index.html at repo root.
3. Do not commit secrets, tokens, or the owner's API keys.
4. Do not restore old .exe / zip binaries.
5. Do not claim TikTok works without a bridge (Euler / tik.tools / a Node server).
6. Spanish copy must stay natural. No broken encodings.
7. After JS/CSS changes, bump the `?v=` query on script/link tags so users are not stuck on cache.
8. Test in a real browser: demo messages appear, Probar voz speaks, Twitch connects to a live channel.

## Build this (priority order)

### 1. Make TikTok connection reliable
- Keep the API-key field.
- Parse Euler Stream AND tik.tools websocket JSON (chat, gift, follow, sub).
- Clear statuses: connecting, live, offline, bad key, not live.
- Auto-stop Ensayo when a real source connects.
- Never leave the reader stuck on one line. Watchdog: if an utterance runs >8s, cancel and next.
- Cap the speak queue at ~8–12 items. Drop oldest.

### 2. Make TTS actually usable on stream
- First click on Probar voz / Conectar unlocks audio and says a short ready line.
- Skip, pause, resume must work.
- Prefer Spanish voices when lang=es.
- Ignore commands that start with `!`.
- Option to skip very short / emoji-only messages.

### 3. Product UI, not a prototype
- Fix white autofill on inputs (force dark background).
- Empty states that tell the user the next click.
- Separate live messages from Ensayo with a clear tag.
- Hide the API key with a show/hide toggle. Store only in localStorage.
- Short setup checklist on first visit: 1 Probar voz  2 Twitch channel  3 TikTok key + live user.
- Keep the layout tight enough for a second monitor / OBS browser source. Stage mode should hide settings.

### 4. README for humans
Rewrite README.md in Spanish + English:
- What it is
- Open https://yuicoder.github.io/Voxlive/
- Twitch: type channel, connect, be live
- TikTok: free key at eulerstream.com, paste, user must be LIVE, connect
- Chrome sound icon on the tab must be unmuted
- Pages is public; no password for Twitch

### 5. Optional if time
- OBS-friendly Stage URL hash `#stage` that opens already in stage mode
- Filter: only gifts / only subs / all chat
- Volume slider in addition to rate
- Do not start a Node backend unless you also add a one-click Render/Fly deploy file. Pages cannot run Node.

## Done means
- Site loads on GitHub Pages
- Ensayo shows messages
- Probar voz produces sound after one click
- Twitch live chat appears for a live channel
- TikTok path is documented and the websocket client handles real events when a key is present
- README matches reality
- No binaries in the repo
