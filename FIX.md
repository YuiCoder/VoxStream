# FIX.md — OPEN, three exact edits in app.js. Keep the file whole.

1. Replace
`const tag = m.source === "demo" ? '<span class="tag">ENSAYO</span>' : "";`
with
`const tag = m.source === "demo" ? '<span class="tag">DEMO</span>' : "";`

2. After
`load(); fillVoices(); syncStage(); applyLang();`
add
`setTimeout(fillVoices, 300);`
`setTimeout(fillVoices, 1200);`

3. Delete this line if it is still there:
`["lock-plus", "lock-pro"].forEach(function (id) { if ($(id)) $(id).onclick = openSoon; });`
Leave Plus/Pro clicks to me.js.

Bump already on studio: app.js?v=17. Do not rewrite the file. STOP.
