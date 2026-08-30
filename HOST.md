# Deploy the API (Railway)

Pages stays the estudio. Railway runs `server/`.

Owner confirmed `/health` returns `ok: true` and `stripe: true`.

## Once

1. https://railway.app — login with GitHub (YuiCoder).
2. New project → Deploy from GitHub repo → VoxStream.
3. Settings → Root directory → `server`
4. Settings → Generate domain. Copy `https://something.up.railway.app` with no slash at the end.
5. Variables (do not paste secrets into chat or GitHub):

```
APP_URL=https://something.up.railway.app
PUBLIC_ORIGIN=https://yuicoder.github.io
DATA_DIR=/data
STRIPE_SECRET_KEY=sk_test_your_local_key
```

Stay on a Stripe **test** key. No live keys.

6. Volume (required if anyone pays):
   - Railway → service → Volumes → New volume
   - Mount path: `/data`
   - Then `DATA_DIR=/data` as above
7. Deploy. Open `https://something.up.railway.app/health`

`ok: true` and `stripe: true` means the API is up.

## After it is up

Test checkout from PowerShell:

```
Invoke-RestMethod -Method POST -Uri https://YOUR-APP.up.railway.app/v1/checkout -ContentType "application/json" -Body '{"plan":"pro"}'
```

Stay in Stripe Test mode. Card 4242 only.

## Volume + DATA_DIR=/data

SQLite is the user/session store (`users` + `sessions`). On Railway the disk is empty after each deploy unless a Volume holds it.

Without the Volume, paid SQLite rows die on deploy.

- Mount the Volume at `/data`
- Set `DATA_DIR=/data`
- The db file is `voxstream.db` on that mount (locally it is `server/data/voxstream.db`, which is gitignored)

Do this before treating Checkout as sticky.
