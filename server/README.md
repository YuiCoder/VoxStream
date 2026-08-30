# VoxStream server

Pages cannot take payments or hide an Euler key. Run this on your PC, later on Railway / Fly / Render.

See ../RUN.md for Windows steps (`npm.cmd` if PowerShell blocks npm).

```
cd server
copy .env.example .env
npm.cmd install
npm.cmd start
```

- 200 /health = process is up
- 501 on /v1/auth/magic or /v1/checkout = route exists, key missing. That is normal.
- Do not commit `.env`
