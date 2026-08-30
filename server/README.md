# VoxStream server

GitHub Pages is the website (`index.html`, `studio.html`). Pages cannot host this Node process.

Pages cannot:

- take payments or run Stripe
- hide an Euler API key
- send magic-link mail
- keep a hosted TikTok WebSocket relay
- set `voxstream_sid` cookies on a real host

Run this folder on your PC (later Railway / Fly / Render). Full runbook: [../RUN.md](../RUN.md)

Do not put secrets in this file. Copy `.env.example` to `.env` on your machine. Never commit `.env`.

## What 501 means

`501` means the route exists, but a key (or Stripe) is missing. That is normal on a fresh clone.

- `POST /v1/auth/magic` returns 501 if the mailer key is not set. No mail is sent.
- `POST /v1/checkout` always returns 501 until Stripe and a real session exist.
- `POST /v1/tiktok/hosted` returns 501 if the host has no Euler key.

`GET /health` returning 200 means the process is up. `stripe` / `euler` / `mailer` stay false until you add keys. Do not add keys yet.

Anonymous `GET /v1/me` is always plan `free`.

## Windows (PowerShell)

Install Node LTS from https://nodejs.org and Git from https://git-scm.com.

```
cd server
copy .env.example .env
```

PowerShell may block `npm` (execution policy). Use the `.cmd` shim:

```
npm.cmd install
npm.cmd start
```

Then open http://localhost:8787/health

If you want `npm` itself to work later:

```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

See [../RUN.md](../RUN.md) for clone / pull steps.

## Mac (Terminal)

Install Node LTS from https://nodejs.org (or `brew install node`).

```
cd server
cp .env.example .env
npm install
npm start
```

Then open http://localhost:8787/health

## Check

- http://localhost:8787/health
- http://localhost:8787/v1/me -- anonymous is always `plan` `free`

Pages keeps working if this window is closed.
