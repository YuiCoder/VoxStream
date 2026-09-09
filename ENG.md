# ENG.md — OPEN for Son

Owner: Spanish is out. English only. No language switch. No ES / PT / JA bars.

## app.js (must keep the file whole — no truncate)

- `let lang = "en";` never `es`.
- If load() restored `s.lang === "es"`, force `en`.
- Delete `#es` / `#en` click handlers. Guard applyLang so missing buttons do not throw.
- `speechText`: English only.
  - gift: `{name} sent {gift}`
  - follow: `{name} followed`
  - sub: `{name} subscribed`
  - bits: `{name} sent {n} bits`
  - chat: `{name} says {text}`
- Demo lines in English. No hola / envió / se suscribió.
- Twitch sub fallback text: `subscribed` not `se suscribió`.
- Utterance lang always `en-US` unless the chosen voice has its own `voice.lang`.
- `fillVoices`: list **every** `speechSynthesis.getVoices()` entry. Do not filter by language. Keep `voiceschanged`. Default pick: saved name, else `en-US` / `en`, else first voice.
- Bump `studio.html` to `app.js?v=16`.

## studio.html + site

- `html lang="en"`.
- Visible copy English (Connect, Cut, Test voice, Rehearsal, Stage, Home…).
- Remove the ES/EN (and PT/JA) switch from studio and every landing page.
- Stop loading language switching. `i18n.js` may keep English strings only; delete `es`/`pt`/`ja` dicts.
- `me.js` free-note in English.

## Do not

- Do not add TikTok back.
- Do not revive Stripe.
- Do not invent extra Chrome voices. The dropdown can only show what the OS/browser reports. Hint: "Voices come from your browser. Chrome on Linux often lists only a few."

STOP after studio is English and the lang buttons are gone.
