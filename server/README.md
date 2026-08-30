# VoxStream server

GitHub Pages cannot take payments or hide an Euler key. This folder is the future host.

It does **not** go live on Pages. Run it on your machine, then later on Railway / Fly / Render.

## Run locally

```
cd server
cp .env.example .env
npm install
npm start
```

Open http://localhost:8787/health
Open http://localhost:8787/v1/plans

## What works today

- Plan matrix: free / plus / pro / ultra
- Hosted TikTok relay **only if** `EULER_API_KEY` is set in `.env`
- Stripe checkout returns 501 until Auth exists. Do not paste a secret into the website.

## What does not work yet

- Login
- Real Stripe Checkout Session
- YouTube OAuth
- Binding a paying user to Pro

Paper prices live in env cents: Plus 1000, Pro 1900, Ultra 3900. Change them in `.env`. Do not print them on the Pages landing until checkout is real.
