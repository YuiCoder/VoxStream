# Deploy the API (Railway)

Pages stays the estudio. Railway runs `server/`.

## Once

1. https://railway.app — login with GitHub (YuiCoder).
2. New project → Deploy from GitHub repo → VoxStream.
3. Settings → Root directory → `server`
4. Settings → Generate domain. Copy `https://something.up.railway.app` with no slash at the end.
5. Variables (do not paste these into chat or GitHub):

```
APP_URL=https://something.up.railway.app
PUBLIC_ORIGIN=https://yuicoder.github.io
STRIPE_SECRET_KEY=sk_test_your_local_key
```

6. Deploy. Open `https://something.up.railway.app/health`

`ok: true` and `stripe: true` means the boss is up.

## After it is up

Test checkout from PowerShell, new URL:

```
Invoke-RestMethod -Method POST -Uri https://YOUR-APP.up.railway.app/v1/checkout -ContentType "application/json" -Body '{"plan":"pro"}'
```

Stay in Stripe Test mode. Card 4242 only.

## Honest limits

SQLite on Railway dies on each new deploy unless you add a Volume later and set `DATA_DIR` to that mount. First fight is just a public URL. Volume is the next one.
