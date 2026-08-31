# Deploy the API (Railway)

Pages stays the estudio. Railway runs `server/`.

Team Pro is owner grant (`POST /v1/admin/grant`) or a Ko-fi **shop** order. Stripe live is closed. Stream tips, bits, and Twitch subs do not grant.

Live `/health` should look like `{ ok: true, stripe: false, webhook: false, admin: true, github: true, google: true, kofi: true }`. `admin: true` means `ADMIN_SECRET` is set on Railway. Never commit that secret. Never paste it in GitHub or chat.

## Once

1. https://railway.app — login with GitHub (YuiCoder).
2. New project → Deploy from GitHub repo → VoxStream.
3. Settings → Root directory → `server`
4. Settings → Generate domain. Copy `https://something.up.railway.app` with no slash at the end.
5. Variables (do not paste secrets into chat or GitHub):

```
APP_URL=https://voxstream-production.up.railway.app
PUBLIC_ORIGIN=https://yuicoder.github.io
DATA_DIR=/data
ADMIN_SECRET=
KOFI_VERIFICATION_TOKEN=
KOFI_PLUS_CODE=
KOFI_PRO_CODE=
```

Leave Stripe keys unset. Grant does not need them.

`KOFI_PLUS_CODE` and `KOFI_PRO_CODE` are the shop item `direct_link_code` values (the slug in `ko-fi.com/s/...`). When either is set, only those two shop SKUs grant Plus/Pro. Donations, commissions, memberships, tips, Twitch bits, and Twitch subs never grant.

6. Volume (required so granted users survive deploys):
   - Railway → service → Volumes → New volume
   - Mount path: `/data`
   - Then `DATA_DIR=/data` as above
7. Deploy. Open `https://something.up.railway.app/health`

`ok: true` and `admin: true` means the API is up and grant is on.

## After it is up

Owner grants a plan with `POST /v1/admin/grant`. Body `{ email, plan }`. `plan` defaults to `pro`. Secret is JSON `secret` or header `x-admin-secret`. Never put the secret in this file.

Ko-fi webhook: `APP_URL/v1/kofi`. Shop orders only.

## Volume + DATA_DIR=/data

SQLite is the user/session store (`users` + `sessions`). On Railway the disk is empty after each deploy unless a Volume holds it.

Without the Volume, granted rows die on deploy.

- Mount the Volume at `/data`
- Set `DATA_DIR=/data`
- The db file is `voxstream.db` on that mount (locally it is `server/data/voxstream.db`, which is gitignored)
