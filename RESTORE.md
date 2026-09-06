# RESTORE.md — OPEN, do this first

`app.js` on main is truncated. Studio is broken until this file is restored.

1. Open https://raw.githubusercontent.com/YuiCoder/VoxStream/9b6c6ae5e55804a077983e94e3940749d54fc840/app.js
2. Replace `app.js` on `main` with that exact file.
3. Then only these edits:
   - `let maxQ = 8;`
   - `const SPEAK_FRESH_MS = 5000;`
   - feed cap `220` → `80`
   - in `shouldSkipSpeak`:
     `if (m.kind === "gift" && (!readGift || m.platform === "tiktok")) return true;`
     `if (m.kind === "follow" && (!readFollow || m.platform === "tiktok")) return true;`
4. Bump `studio.html` to `app.js?v=14`
5. STOP.

Do not rewrite Twitch or Ensayo. Do not start Tauri.
